import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataServiceService} from "../services/data-service.service";
import {AlertController, isPlatform, ModalController, PopoverController} from "@ionic/angular";
import {PayNowPage} from "../pay-now/pay-now.page";
import {SpinnerService} from "../services/spinner.service";
import {PopoverComponent} from "../popover/popover.component";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-specials',
  templateUrl: './specials.page.html',
  styleUrls: ['./specials.page.scss'],
})
export class SpecialsPage implements OnInit {

  TAX_CONSTANT = .08;
  specialsId;
  cart = {items:[],total:0, subtotal: 0};
  products = [];
  mobile = false;
  menuToggled = false;
  types;
  specialTypeId;
  constructor(public dataService: DataServiceService,
              private spinnerService: SpinnerService,
              private modalController: ModalController,
              private alertController: AlertController,
              private router: Router,
              private storage: Storage,
              private route: ActivatedRoute,
              public popoverController: PopoverController) {
    this.spinnerService.showSpinner().then(() => {});
  }

  disableButton(item) {
    return item.quantity == 0;
  }

  sortBySpecial(products) {
    const specialTypeId = this.types.find(element => {
      return element.name === "Special";
    })
    return products.sort((a,b) => {
      console.log(a.typeId);
      console.log(specialTypeId.id);
      if(a.typeId ===specialTypeId.id) {
        return -1;
      }
      return 1;
    })
  }

  async Pay() {
    if(this.cart.items.length === 0) {
      await this.presentAlertMessage("Oops! looks like your cart is empty.");
      return;
    }
    this.cart.total = this.getTotal();
    this.cart.subtotal = this.getSubtotal();

    const orderRes = await this.dataService.createOrder(this.cart).toPromise();
    if (!orderRes.id) {
      await this.presentAlertMessage("Something went wrong creating your order, please try again");
      return;
    }
    const availableTimes = await this.dataService.getAvailableSpecialSlots(this.specialsId).toPromise();

    const modal = await this.modalController.create({
      component: PayNowPage,
      componentProps: {
        availableTimes,
        // cart: this.cart,
        order: orderRes,
        subtotal: this.cart.subtotal,
      }
    });
    modal.onDidDismiss().then(async (detail: any) => {
      this.spinnerService.hideSpinner();
      if (detail.data && detail.data.success) {
        await this.presentAlertMessage("Thank you for your order! We will email you a receipt.", this.refreshPage);
      }
    });
    await modal.present();
  }

  refreshPage() {
    window.location.reload();
  }
  async goHome() {
    await this.router.navigate(['frese-bakery']);
  }
  checkForSelectionCount(item) {
    return Object.keys(item.product_selection_values).some(key => {
      return !item.product_selection_values[key].selected
    });
  }

  displayTotal() {
    return this.getTotal().toFixed(2);
  }
  getTotal() {
    let subtotal = this.getSubtotal();
    return this.round(subtotal + this.getTax(subtotal));
  }


  displayAmount(amount) {
    return amount.toFixed(2);
  }
  getAddOnValues(item, key) {
    return item.add_ons[key];
  }

  getTax(total) {
    return this.round(total * this.TAX_CONSTANT);
  }

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
    for (const item of this.cart.items) {
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
  deleteItem(index) {
    const item = this.cart.items[index];
    this.products.forEach(p => {
      if(p.id === item.productId) {
        p.quantity += item.quantity;
      }
    })
    this.cart.items.splice(index, 1);
  }
  getSelectionKeys(item) {
    return Object.keys(item.selections);
  }
  addItem(item) {
    let foundIdentical = false;
    this.cart.items.forEach(i => {
      let oldQuantity = i.quantity;
      i.quantity = 1;
      if(JSON.stringify(i) == JSON.stringify(item)) {
        i.quantity = oldQuantity +1;
        foundIdentical = true;
        return;
      } else {
        i.quantity = oldQuantity;
      }
    })
    if(foundIdentical) { return; }
    this.cart.items.push(item);
  }
  // Update cart
  async updateCart(newItem) {
    if(newItem.quantity === 0) {
      await this.presentAlertMessage("Whoops we don't have that many left, we've updated your cart");
      return;
    }
    newItem.quantity--;
    if(this.checkForSelectionCount(newItem)) {
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
    let item = this.formatCartItem(newItem);

    this.addItem(item);
  }
  formatSelections(item) {
    let vals = {};
    Object.keys(item.product_selection_values).forEach(key => {
      if (item.product_selection_values[key].selected) {
        vals[key] = {
          value: item.product_selection_values[key].selected.value,
          cost: item.product_selection_values[key].selected.cost
        };
        item.product_selection_values[key].selected = null;
      }
    });
    return vals;
  }
  formatAddOns(item) {
    let vals = {};
    Object.keys(item.product_add_on_values).forEach(key => {
      if (item.product_add_on_values[key].selected) {
        vals[key] = item.product_add_on_values[key].selected.map(val => {
          return {
            value: val.value,
            cost: val.cost
          }
        });
        item.product_add_on_values[key].selected = null;
      }
    });
    return vals;
  }
  formatSize(item) {
    if(!item.product_size_selected) { return null; }
    let id = item.product_size_selected.id;
    item.product_size_selected = item.product_sizes[0];
    return id;
  }

  formatCartItem(item) {
    return {
      price: this.getItemCost(item),
      productId: item.id,
      product_name: item.title,
      quantity: 1,
      product_size_id: this.formatSize(item),
      selections: this.formatSelections(item),
      add_ons: this.formatAddOns(item),
    };
  }

  getTotalQuantity() {
    return this.cart.items.reduce((prev , x) => prev + x.quantity, 0);
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
      if(item.product_sizes && item.product_sizes.length > 0) {
        item.product_size_selected = item.product_sizes[0];
      }
    });
    return menu;
  }
  async validateSpecial() {
    try {
      let res;
      if(this.specialsId === 0) {
        res = await this.dataService.getActiveSpecial().toPromise();
        this.specialsId = res.id;
      } else {
        res = await this.dataService.getSpecialById(this.specialsId).toPromise();
      }
      console.log(res);
      let endDate = new Date(res.end);
      if(endDate < new Date()) {
        await this.spinnerService.hideSpinner();
        await this.presentAlertMessage("That special is not currently active, please check out our full menu here!", this.goHome);
      }
      this.products = this.formatMenu(res.products);
      this.products = this.sortBySpecial(this.products);
      await this.spinnerService.hideSpinner();

    } catch(err) {
      if(err !== "overlay does not exist") {
        console.log(err);
        // await this.spinnerService.hideSpinner();
        await this.presentAlertMessage("That special is not currently active, please check out our full menu here!", this.goHome);
      }
    }
  }
  async ionViewWillEnter() {
    await this.validateSpecial();
  }
  async ngOnInit() {
    console.log("INIT")
    if (window.screen.width < 600) { // 768px portrait
      this.mobile = true;
    }
    const routeParams = this.route.snapshot.paramMap;
    this.specialsId = Number(routeParams.get('specialsId'));
    this.types = await this.storage.get('types');
    console.log(this.types);

  }
  addOnKeys(product) {
    return Object.keys(product.product_add_on_values);
  }
  getAddOnKeys(item) {
    return Object.keys(item.add_ons);
  }
  hasAddOns(product) {
    return Object.keys(product.product_add_on_values).length > 0;
  }

  selectionKeys(product) {
    return Object.keys(product.product_selection_values);
  }
  hasSelections(product) {
    return Object.keys(product.product_selection_values).length > 0;
  }
  getItemCost(item) {
    if(item.product_size_selected) {
      return item.product_size_selected.cost;
    } else {
      return item.price;
    }
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
