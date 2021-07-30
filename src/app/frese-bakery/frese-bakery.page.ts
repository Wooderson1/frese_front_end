import { Component, OnInit } from '@angular/core';
import { Entree } from './entree.model';

@Component({
  selector: 'app-frese-bakery',
  templateUrl: './frese-bakery.page.html',
  styleUrls: ['./frese-bakery.page.scss'],
})
export class FreseBakeryPage implements OnInit {

  entree: Entree[] = [
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
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
