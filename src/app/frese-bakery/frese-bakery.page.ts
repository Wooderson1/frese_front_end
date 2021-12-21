import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Product, Item } from './item.model';
import {DataServiceService} from '../services/data-service.service';

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
      addOns: [{ value: 'Pepperoni', cost: 2 },
               { value: 'Mushroom', cost: 3 }]
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
    }
  ];
cart: Item = {name: 'Mark Woodhall',
             phone: '(909)273-1901',
             email: 'woodhallmark800@gmail.com',
             items: []};
cartMap = new Map();
availableItems;
todaysDate = new Date();
// set total balance to 0 to start
total = 0;

  constructor( public dataService: DataServiceService) { }

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
    }
    else {
      this.total -= (cart.price / cart.quantity);
      cart.price -= (cart.price / cart.quantity);
      --cart.quantity;
    }
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

  // Update cart
  updateCart(item) {
    // if item is not in the cart yet
    if (!this.cartMap.has(item.id)) {
      const newProduct: Product = {id: item.id, title: item.title, description: item.description,
                             price: item.price, typeId: item.typeId, active: item.active,
                             quantity: 1, photoUrl: item.photoUrl, createdAt: item.createdAt,
                             updatedAt: item.updatedAt, selections: item.selections, addOns: item.addOns};

      this.cart.items.push(newProduct);
      this.cartMap.set(item.id, item.description);
    }
    // if it is in the cart already, update values
    else {
      for (let x = 0; x < this.cart.items.length; ++x) {
        if (this.cartMap.get(item.id) === this.cart.items[x].description) {
          this.cart.items[x].quantity += 1;
          this.cart.items[x].price += item.price;
          console.log('cart updated at array index: ' + x);
        }
      }
    }
    // update cart total
    this.total += item.price;
  }

  // check out logic goes here
  checkOut(final) {

    console.log('Checkout with: ');
    if (final.items) {
       for (const x of final.items){
        console.log(x.description);
      }
    }
  }

  ngOnInit() {
    this.dataService.getFullMenu().subscribe(productResults => {
      console.log(productResults);
      this.availableItems = productResults;
    });
  }
}
