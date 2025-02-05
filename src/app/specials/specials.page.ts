import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataServiceService} from "../services/data-service.service";
import {AlertController, isPlatform, ModalController, PopoverController} from "@ionic/angular";
import {PayNowPage} from "../pay-now/pay-now.page";
import {SpinnerService} from "../services/spinner.service";
import {PopoverComponent} from "../popover/popover.component";
import {Storage} from '@ionic/storage';
import {OrderService} from "../services/order.service";
import {SpecialsProductsService} from "../specials-products.service";
import * as moment from "moment";

@Component({
  selector: 'app-specials',

  templateUrl: './specials.page.html',
  styleUrls: ['./specials.page.scss'],
})
export class SpecialsPage implements OnInit {

  TAX_CONSTANT = .08;
  cart = {items: [], total: 0, subtotal: 0};
  products = [];
  mobile = false;
  menuToggled = false;
  types;
  specialTypeId;
  once = false;
  SPECIAL_ID = 0;
  special;

  constructor(public dataService: DataServiceService,
              private spinnerService: SpinnerService,
              public specialsProductsService: SpecialsProductsService,
              private modalController: ModalController,
              public orderService: OrderService,
              private alertController: AlertController,
              private router: Router,
              private storage: Storage,
              private route: ActivatedRoute,
              public popoverController: PopoverController) {
    const routeParams = this.route.snapshot.paramMap;
    this.SPECIAL_ID = parseInt(routeParams.get('specialsId'));
  }

  disableButton(item) {
    return item.quantity == 0;
  }
  async ionViewDidEnter() {
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

  refreshPage() {
    window.location.reload();
  }

  async goHome() {
    await this.router.navigate(['frese-bakery']);
  }

  displayTotal() {
    return this.getTotal().toFixed(2);
  }

  getTotal() {
    let subtotal = this.getSubtotal();
    return this.round(subtotal + this.getTax());
  }


  displayAmount(amount) {
    return amount.toFixed(2);
  }

  getAddOnValues(item, key) {
    return item.add_ons[key];
  }
  shouldBeTaxed(item) {
    const BreadType = this.types.find(element => {
      return element.name === "Bread";
    })
    return item.typeId !== BreadType.id;
  }
  getTax() {
    let total = 0;
    for (const item of this.orderService.getOrder().items) {
      let item_cost = item.price;
      Object.keys(item.selections).forEach(key => {
        if (item.selections[key].cost) {
          item_cost += item.selections[key].cost;
        }
      });
      Object.keys(item.add_ons).forEach(key => {
        for (const value of item.add_ons[key]) {
          if (value.cost) {
            item_cost += value.cost;
          }
        }
      });
      if(this.shouldBeTaxed(item)) {
        total += item_cost * item.quantity * this.TAX_CONSTANT;
      } else {
      }
    }
    return this.round(total);  }

  displaySubtotal() {
    return this.getSubtotal().toFixed(2);
  }

  round(value: number, digits = 2) {
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value;
  }

  getSubtotal() {
    let total = 0;
    for (const item of this.orderService.getOrder().items) {
      let item_cost = item.price;
      Object.keys(item.selections).forEach(key => {
        if (item.selections[key].cost) {
          item_cost += item.selections[key].cost;
        }
      });
      Object.keys(item.add_ons).forEach(key => {
        for (const value of item.add_ons[key]) {
          if (value.cost) {
            item_cost += value.cost;
          }
        }
      });
      total += item_cost * item.quantity;
    }
    return this.round(total);
  }

  getSelectionKeys(item) {
    return Object.keys(item.selections);
  }


  getSpecialStatus() {
    let res = "noSpecial";
    if(!this.specialsProductsService.specialLoading && !this.once) {
      this.once = true;
      this.spinnerService.hideSpinner();
    }
    if(this.specialsProductsService.specialLoading) {
      res = "loading";
    }
    if(this.specialsProductsService.activeSpecial() && !this.timesAvailable()) {
      res = "sold out";
    }
    if(this.specialsProductsService.activeSpecial()) {
      res = "active";
    }
    return res;
  }


  specialExists() {
    if(this.orderService.specialLoading) {
      return false;
    }
    return this.orderService.activeSpecial();
  }
  timesAvailable() {
    return this.specialsProductsService.specials[this.SPECIAL_ID]?.getAvailableTimesCount() > 0;
  }

  async addToCart(newItem) {
    let resp = await this.orderService.addToCart(newItem);
    if(resp === "Whoops we don't have that many left, we've updated your cart") {
      await this.presentAlertMessage("Whoops we don't have that many left, we've updated your cart");
    }
    if(resp === "Please make a selection") {
      const alert = await this.alertController.create({
        header: 'Whoops!',
        message: 'Please make a selection',
        buttons: [
          {
            text: 'Dismiss',
            handler: () => {
            }
          }
        ]
      });
      return alert.present();
    }
  }

  getTotalQuantity() {
    return this.orderService.getOrder().items.reduce((prev, x) => prev + x.quantity, 0);
  }

  async openPopover(event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
    });
    return await popover.present();
  }

  onMobile() {
    return isPlatform('mobile');
  }

  toggleMenu() {

    this.menuToggled = !this.menuToggled;
  }

  formatMenu(menu) {
    return this.initializeSelectedSizes(menu);
  }

  initializeSelectedSizes(menu) {
    menu.forEach((item) => {
      if (item.product_sizes && item.product_sizes.length > 0) {
        item.product_size_selected = item.product_sizes[0];
      }
    });
    return menu;
  }

  async ngOnInit() {
    if(this.specialsProductsService.specialLoading) {
      await this.spinnerService.showSpinner(20000);
    }
    await this.specialsProductsService.waitForSpecials();
    const routeParams = this.route.snapshot.paramMap;
    const specialId = parseInt(routeParams.get('specialsId'))
    if(!specialId) {
      const first = this.specialsProductsService.getFirstSpecial();
      this.SPECIAL_ID = first?.id
    }
    if(!this.specialsProductsService.specials[specialId]) {
      await this.router.navigate(['/specials']);
    }
    this.specialsProductsService.specials[this.SPECIAL_ID]?.productsUpdated.subscribe((vals) => {
      this.products = vals;
    });
      if (window.screen.width < 600) { // 768px portrait
      this.mobile = true;
    }
    // const routeParams = this.route.snapshot.paramMap;
    this.types = await this.storage.get('types');

  }

  addOnKeys(product) {
    return Object.keys(product.product_add_on_values);
  }

  getAddOnKeys(item) {
    return Object.keys(item.add_ons);
  }

  hasAddOns(product) {
    if(!product || !product.product_add_on_values) {
      return false;
    }
    return Object.keys(product.product_add_on_values).length > 0;
  }

  selectionKeys(product) {
    console.log(product)
    try {

    if(!product || product.product_selection_values === undefined) {
      return [];
    }
    console.log(Object.keys(product.product_selection_values));
    return Object.keys(product.product_selection_values);
    } catch(e) {
      console.log("SELECTIONS ", e);
    }
  }

  hasSelections(product) {
    if(!product || !product.product_selection_values) {
      return false;
    }
    return Object.keys(product.product_selection_values).length > 0;
  }

  async presentAlertMessage(msg, func = null) {
    const binded = func && func.bind(this);
    const alert = await this.alertController.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        cssClass: 'primary',
        role: 'cancel',
        handler: () => {
          binded && binded();
        }
      }
      ]
    });
    await alert.present();
  }
}
