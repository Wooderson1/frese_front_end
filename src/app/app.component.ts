import { Component } from '@angular/core';
import { Stripe } from '@capacitor-community/stripe';
import {DataServiceService} from "./services/data-service.service";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataServiceService,
              private storage: Storage) {
    Stripe.initialize({
      publishableKey: 'Your Publishable Key',
    });
    this.initStorage();
  }
  async initStorage() {
    await this.storage.create();
    const data = await this.dataService.getProductTypes().toPromise();
    await this.storage.set('types', data);
  }
}
