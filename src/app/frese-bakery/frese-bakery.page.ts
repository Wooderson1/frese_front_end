import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';
import {Component, OnInit} from '@angular/core';
import {Product, Item} from './item.model';
import {DataServiceService} from '../services/data-service.service';

import {AlertController, PopoverController} from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {CheckOutComponent} from '../check-out/check-out.component';

@Component({
  selector: 'app-frese-bakery',
  templateUrl: './frese-bakery.page.html',
  styleUrls: ['./frese-bakery.page.scss'],
})
export class FreseBakeryPage implements OnInit {

  // entrees
  products: Product[] = [
    {
      id: 1,
      title: 'Pizza',
      description: 'Cheese Pizza',
      price: 16,
      typeId: 1,
      active: true,
      quantity: -1,
      photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUFdG_GWYyNQwkncDqLEZqmFdXCysA6_MSXw&usqp=CAU',
      createdAt: '2021-07-07T02:39:33.000Z',
      updatedAt: '2021-07-07T02:51:28.000Z',
      addOns: [{value: 'Pepperoni', cost: 2},
        {value: 'Mushroom', cost: 3}]
    },
    {
      id: 2,
      title: 'sandwich',
      description: 'Reuben Sandwich',
      price: 10,
      typeId: 1,
      active: true,
      quantity: -1,
      // eslint-disable-next-line max-len
      photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMWYdg4XRgclhhNNOfIAzkQPRfUMUQ14aNYgY0e0lRzVsuYt1eT6D5Hs1IIcl-ixgpD8&usqp=CAU',
      createdAt: '2021-07-07T02:39:33.000Z',
      updatedAt: '2021-07-07T02:51:28.000Z',
      addOns: null
    },
    {
      id: 3,
      title: 'cake',
      description: 'Chocolate Cake',
      price: 5,
      typeId: 2,
      active: true,
      quantity: -1,
      // eslint-disable-next-line max-len
      photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_M2Olw8zrmIr7FhqI9iBAFnXIuSkAgPr-_g&usqp=CAU',
      createdAt: '2021-07-07T02:39:33.000Z',
      updatedAt: '2021-07-07T02:51:28.000Z',
      addOns: null
    },
    {
      id: 4,
      title: 'mozz stick',
      description: 'Mozzarella Sticks',
      price: 7,
      typeId: 3,
      active: true,
      quantity: -1,
      // eslint-disable-next-line max-len
      photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpAT7FjKcL1e6HmNrzrOpQEjsOSENKSkcplg&usqp=CAU',
      createdAt: '2021-07-07T02:39:33.000Z',
      updatedAt: '2021-07-07T02:51:28.000Z',
      addOns: null
    }
  ];
  product_selections = {};
  product_add_ons = {};
  cart: Item = {
    name: 'Mark Woodhall',
    phone: '(909)273-1901',
    email: 'woodhallmark800@gmail.com',
    items: []
  };
  cartMap = new Map();
  availableItems;
  productTypes;
  TAX_CONSTANT = .08;

  orderItem;
  todaysDate = new Date().toISOString();
// set total balance to 0 to start
  total = 0;

  constructor(public dataService: DataServiceService,
              private alertController: AlertController,
              public popoverController: PopoverController) {
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
          console.log('deleted: ' + this.cartMap.delete(cart.id));
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
    console.log("ITEM ", item);
    console.log("KEY ", addOnKey);
  }

  hasSelections(product) {
    return Object.keys(product.product_selection_values).length > 0;
  }
  hasAddOns(product) {
    return Object.keys(product.product_add_on_values).length > 0;
  }

  getProductsForType(type) {
    if (!this.availableItems) {
      return;
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

    console.log('event:' + $event.target.value);
    console.log('item: ' + item.description);

    // update prices for every add on added
    for (const x of $event.target.value) {
      item.price += Number(x) * item.quantity;
      this.total += Number(x) * item.quantity;
    }

    // log the add ons available for the item
    for (const y of this.cart.items) {
      if (y.addOns) {
        for (const option of y.addOns) {
          console.log('addOns: ' + option.value);
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
    let id = item.product_size_selected.id;
    item.product_size_selected = item.product_sizes[0];
    return id;
  }

  formatCartItem(item) {
    return {
      price: item.price,
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
  getItemCost(item) {
    if(item.product_size_selected) {
      return item.product_size_selected.cost;
    } else {
      return item.price;
    }
  }
  // Update cart
  async updateCart(newItem) {
    if(this.checkForSelectionCount(newItem)) {
      console.log("Have not selected all of the required selections");

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
    console.log("ITEM ", item);
    this.cart.items.push(item);
  }

  // check out logic goes here
  async checkOut(final) {

    console.log('Checkout with: ');
    if (final.items) {
      for (const x of final.items) {
        console.log(x.description);
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
      if(item.product_sizes && item.product_sizes.length > 0) {
        item.product_size_selected = item.product_sizes[0];
      }
    });
    return menu;
  }

  ngOnInit() {
    this.dataService.getProductTypes().subscribe(types => {
      console.log(types);
      this.productTypes = types;
    });

    this.dataService.getActiveMenu().subscribe(productResults => {
      this.availableItems = this.formatMenu(productResults);
      console.log(this.availableItems);
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
