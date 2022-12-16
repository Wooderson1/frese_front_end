import { Component } from '@angular/core';
import { Stripe } from '@capacitor-community/stripe';
import {DataServiceService} from "./services/data-service.service";
import { Storage } from '@ionic/storage';
import {OrderService} from "./services/order.service";
import {SpecialsProductsService} from "./specials-products.service";
import {ProductsService} from "./products.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  types;
  constructor(private dataService: DataServiceService,
              private orderService: OrderService,
              private specialsProductsService: SpecialsProductsService,
              private productsService: ProductsService,
              private storage: Storage) {
    Stripe.initialize({
      publishableKey: 'Your Publishable Key',
    });
    this.initStorage();
  }
  async initStorage() {
    await this.storage.create();
    this.types = await this.dataService.getProductTypes().toPromise();
    this.dataService.getActiveMenu().subscribe(productResults => {
      this.orderService.setMenuLoading(false);
      const availableItems = this.formatMenu(productResults);
      this.productsService.setProducts(availableItems, this.types);
    });
    await this.orderService.loadRegularTimes();
    try {
      const res = await this.dataService.getActiveSpecial().toPromise();
      this.orderService.setLoading(false);
      if(!res || new Date(res.end) < new Date()) {
        this.orderService.setSpecialId(null);
        return;
      }
      this.orderService.setSpecialId(res.id);
      let temp = this.formatMenu(res.products);
      temp = this.sortBySpecial(temp);
      this.specialsProductsService.setProducts(temp);
      await this.orderService.loadSpecialTimes();

    } catch (err) {
      this.orderService.setLoading(false);
      this.orderService.setSpecialId(null);
    }


    await this.storage.set('types', this.types);
  }
  formatMenu(menu) {
    return this.initializeSelectedSizes(menu);
  }
  sortBySpecial(products) {
    const specialTypeId = this.types.find(element => {
      return element.name === "Special";
    })
    return products.sort((a, b) => {
      if (a.typeId === specialTypeId.id) {
        return -1;
      }
      return 1;
    })
  }
  initializeSelectedSizes(menu) {
    menu.forEach((item) => {
      if (item.product_sizes && item.product_sizes.length > 0) {
        item.product_size_selected = item.product_sizes[0];
      }
    });
    return menu;
  }
}
