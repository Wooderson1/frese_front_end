import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  apiUrl = environment.baseUrl;
  constructor(public http: HttpClient) { }

  processPaymentAndCreateOrder(data) {
    return this.http.post(`${this.apiUrl}/processOrderAndPay`, data);
  }

  getIntent(data) {
    return this.http.post(`${this.apiUrl}/stripe/intent`, data);
  }
  processPayment(data) {
    const {phone, email, amount, currency, token, orderId, name, pickupTime } = data;
    return this.http.post(`${this.apiUrl}/stripe/charge`, {
      phone, email, amount, currency, token, orderId, name, pickupTime
    });
  }
  processIntent(data) {
    return this.http.post(`${this.apiUrl}/stripe/processIntent`, data);
  }
}
