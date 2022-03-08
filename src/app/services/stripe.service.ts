import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
const config = require('../config.json');

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  apiUrl = config.App.baseUrl;
  constructor(public http: HttpClient) { }

  processPayment(data) {
    return this.http.post(`${this.apiUrl}/stripe/charge`, {
      amount: data.amount,
      currency: data.currency,
      token: data.token
    })
  }
}
