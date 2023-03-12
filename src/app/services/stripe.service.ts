import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
const config = require('../config.json');

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  apiUrl = config.App.baseUrl;
  constructor(public http: HttpClient) { }

  processPaymentAndCreateOrder(data) {
    return this.http.post(`${this.apiUrl}/processOrderAndPay`, data)
  }
  processPayment(data) {
    const {phone, email, amount, currency, token, orderId, name, pickupTime } = data;
    return this.http.post(`${this.apiUrl}/stripe/charge`, {
      phone, email, amount, currency, token, orderId, name, pickupTime
    })
  }
}
