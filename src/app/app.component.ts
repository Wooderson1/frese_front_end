import { Component } from '@angular/core';
import { Stripe } from '@capacitor-community/stripe';
import {DataServiceService} from './services/data-service.service';
import { Storage } from '@ionic/storage';
import {OrderService} from './services/order.service';
import {SpecialsProductsService} from './specials-products.service';
import {ProductsService} from './products.service';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataServiceService,
              private orderService: OrderService,
              private specialsProductsService: SpecialsProductsService,
              private productsService: ProductsService,
              private location: Location,
              private storage: Storage) {
    console.log(environment.env);
    Stripe.initialize({
      publishableKey: 'Your Publishable Key',
    });
    this.initStorage();
  }
  async initStorage() {
    await this.storage.create();
  }

}
