import {Component, OnInit} from '@angular/core';
import {Product, Item} from './item.model';
import {DataServiceService} from '../services/data-service.service';

import {AlertController, isPlatform, ModalController, PopoverController} from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {CheckOutComponent} from '../check-out/check-out.component';
import {PayNowPage} from "../pay-now/pay-now.page";
import {SpinnerService} from "../services/spinner.service";
import {OrderService} from "../services/order.service";
import {initData} from "../helpers/image-formatter";

@Component({
  selector: 'app-frese-bakery',
  templateUrl: './frese-bakery.page.html',
  styleUrls: ['./frese-bakery.page.scss'],
})
export class FreseBakeryPage implements OnInit {

  // entrees
  products: Product[] = [];
  product_selections = {};
  product_add_ons = {};
  cart: any = {
    items: []
  };
  cartMap = new Map();
  availableItems;
  productTypes;
  TAX_CONSTANT = .08;
  menuToggled = false;
  titleTest = "TESTICLES";

  orderItem;
  todaysDate = new Date().toISOString();
// set total balance to 0 to start
  total = 0;

  constructor(public dataService: DataServiceService,
              public orderService: OrderService,
              private spinnerService: SpinnerService,
              private modalController: ModalController,
              private alertController: AlertController,
              public popoverController: PopoverController) {
  }


  getTotalQuantity() {
    return this.cart.items.reduce((prev, x) => prev + x.quantity, 0);
  }

  toggleMenu() {
    this.menuToggled = !this.menuToggled;
  }

  onMobile() {
    return isPlatform('mobile');
  }


  increment(cart) {
    cart.price += (cart.price / cart.quantity);
    ++cart.quantity;
    this.total += (cart.price / cart.quantity);
  }

  decrement(cart) {
    if (cart.quantity === 1) {
      this.total -= cart.price;
      for (let x = 0; x < this.cart.items.length; ++x) {
        if (this.cartMap.get(cart.id) === this.cart.items[x].description) {

          this.cart.items.splice(x, 1);
        }
      }
    } else {
      this.total -= (cart.price / cart.quantity);
      cart.price -= (cart.price / cart.quantity);
      --cart.quantity;
    }
  }

  addOnKeys(product) {
    return Object.keys(product.product_add_on_values);
  }

  selectionKeys(product) {
    return Object.keys(product.product_selection_values);
  }

  getAddOns(item, addOnKey) {


  }

  hasSelections(product) {
    return Object.keys(product.product_selection_values).length > 0;
  }

  hasAddOns(product) {
    return Object.keys(product.product_add_on_values).length > 0;
  }

  refreshPage() {
    window.location.reload();
  }

  async presentAlertMessage(msg, func = null) {
    const binded = func && func.bind(this);
    const alert = await this.alertController.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        cssClass: 'primary',
        handler: () => {
          binded && binded();
        }
      }
      ]
    });
    await alert.present();
  }

  async Pay() {
    if (this.cart.items.length === 0) {
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
    const availableTimes = await this.dataService.getAvailableTimeSlots().toPromise();
    if (Object.keys(availableTimes).length <= 0) {
      await this.presentAlertMessage("Sorry it seems like we're too busy to take new orders at this time! Please try again later.", this.refreshPage);
      return;
    }
    const modal = await this.modalController.create({
      component: PayNowPage,
      componentProps: {
        availableTimes,
        orderId: orderRes.id,
        total: this.cart.total,
        subtotal: this.cart.subtotal,
      }
    });
    modal.onDidDismiss().then(async (detail: any) => {
      this.spinnerService.hideSpinner();
      if (detail.data && detail.data.success) {
        await this.presentAlertMessage("Thank you for your order!", this.refreshPage);
      }
    });
    await modal.present();
  }

  getProductsForType(type) {
    if (!this.availableItems) {
      return [];
    }
    return this.availableItems.filter(t => t.typeId === type.id);
  }

  // update price for add on
  addAddOn($event, item) {

    // Reset orignal price, to avoid doubling up on updating price
    for (const x of this.products) {

      if (x.description === item.description) {
        const diff = item.price - x.price;
        this.total -= diff;
        item.price = x.price;
      }
    }


    // update prices for every add on added
    for (const x of $event.target.value) {
      item.price += Number(x) * item.quantity;
      this.total += Number(x) * item.quantity;
    }

    // log the add ons available for the item
    for (const y of this.cart.items) {
      if (y.addOns) {
        for (const option of y.addOns) {

        }
      }
    }
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
    if (!item.product_size_selected) {
      return null;
    }
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

  getAddOnValues(item, key) {
    return item.add_ons[key];
  }

  checkForSelectionCount(item) {
    return Object.keys(item.product_selection_values).some(key => {
      return !item.product_selection_values[key].selected
    });
  }

  deleteItem(index) {

    this.cart.items.splice(index, 1);
  }

  getItemCost(item) {
    if (item.product_size_selected) {
      return item.product_size_selected.cost;
    } else {
      return item.price;
    }
  }

  addItem(item) {
    let foundIdentical = false;
    this.cart.items.forEach(i => {
      let oldQuantity = i.quantity;
      i.quantity = 1;
      if (JSON.stringify(i) == JSON.stringify(item)) {
        i.quantity = oldQuantity + 1;
        foundIdentical = true;
        return;
      } else {
        i.quantity = oldQuantity;
      }
    })
    if (foundIdentical) {
      this.orderService.setOrder(this.cart);
      return;
    }
    this.cart.items.push(item);
    this.orderService.setOrder(this.cart);
  }

  // Update cart
  async updateCart(newItem) {
    if (newItem.quantity === 0) {
      await this.presentAlertMessage("Whoops we don't have that many left, we've updated your cart");
      return;
    }
    if (this.checkForSelectionCount(newItem)) {


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

  // check out logic goes here
  async checkOut(final) {


    if (final.items) {
      for (const x of final.items) {

      }
    }

    const popover = await this.popoverController.create({
      component: CheckOutComponent,
      componentProps: {value: final}
    });
    popover.style.cssText = '--min-width: 50%;';
    return await popover.present();
  }

  async openPopover(event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
    });
    return await popover.present();
  }

  formatAOV(val) {
    let keys = Object.keys(val);
    keys.forEach(k => {
      val[k].forEach(v => v["selected"] = false);
    });
    return val;
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

  ngOnInit() {
    this.dataService.getProductTypes().subscribe(types => {

      this.productTypes = types;
    });

    this.dataService.getActiveMenu().subscribe(productResults => {
      this.availableItems = this.formatMenu(productResults);

    });
  }

  round(value: number, digits = 2) {
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value;
  }

  displayTotal() {
    return this.getTotal().toFixed(2);
  }

  displaySubtotal() {
    return this.getSubtotal().toFixed(2);
  }

  ssdisplayAmount(amount) {

    return amount.toFixed(2);
  }

  displayAmount(amount) {
    return amount.toFixed(2);
  }


  getTotal() {
    let subtotal = this.getSubtotal();
    return this.round(subtotal + this.getTax(subtotal));
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

  getTax(total) {
    return this.round(total * this.TAX_CONSTANT);
  }

  getSelectionKeys(item) {
    return Object.keys(item.selections);
  }

  getAddOnKeys(item) {
    return Object.keys(item.add_ons);
  }
}
