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
  entree: Product[] = [
    {
      id: 1,
      title: 'Pizza',
      description: 'Pepperoni Pizza',
      price: 16,
      typeId: 1,
      active: true,
      quantity: -1,
      photoUrl: 'https://www.armourmeats.com/wp-content/uploads/2019/01/Quick-and-Easy-Pepperoni-Pizza-700x700.jpg',
      createdAt: '2021-07-07T02:39:33.000Z',
      updatedAt: '2021-07-07T02:51:28.000Z'
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
      updatedAt: '2021-07-07T02:51:28.000Z'
    }
  ];
cart: Item = {name: 'Mark Woodhall',
             phone: '(909)273-1901',
             email: 'woodhallmark800@gmail.com',
             items: []};
cartMap = new Map();

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

  // Update cart
  updateCart(item) {
    // if item is not in the cart yet
    if (!this.cartMap.has(item.id)) {
      const newProduct: Product = {id: item.id, title: item.title, description: item.description,
                             price: item.price, typeId: item.typeId, active: item.active,
                             quantity: 1, photoUrl: item.photoUrl, createdAt: item.createdAt,
                             updatedAt: item.updatedAt};

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
  checkOut(cart) {

  }

  async ngOnInit() {
    await this.dataService.getFullMenu().subscribe(productResults => { console.log(productResults); });
  }

}
