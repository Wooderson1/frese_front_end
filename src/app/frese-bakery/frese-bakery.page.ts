import { Component, OnInit } from '@angular/core';
import { Item } from './item.model';
import { Cart } from './item.model';

@Component({
  selector: 'app-frese-bakery',
  templateUrl: './frese-bakery.page.html',
  styleUrls: ['./frese-bakery.page.scss'],
})
export class FreseBakeryPage implements OnInit {

  entree: Item[] = [
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
  cart: Cart[] = [];

  // set total balance to 0 to start
  total = 0;

  constructor() { }

  // Update cart
  updateCart(entree) {
    if (!this.cart[entree.id-1]) {
      const newItem: Cart = {item: entree.description, price: entree.price, quantity: 1};
      this.cart.push(newItem);
    }
    else {
      this.cart[entree.id-1].quantity += 1;
      this.cart[entree.id-1].price += entree.price;
    }
    console.log(this.cart[entree.id-1].item);
    this.total += entree.price;
  }

  ngOnInit() {
  }

}
