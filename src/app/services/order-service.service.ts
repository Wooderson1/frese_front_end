import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
const config = require('../config.json');

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  apiUrl = config.App.baseUrl;
  constructor(public http: HttpClient) { }

  getProductTypes() {
    return this.http.get(`${this.apiUrl}/products/types`);
  }
  getFullMenu() {
    return this.http.get(`${this.apiUrl}/productsAndSizes`);
  }
  getActiveMenu() {
    return this.http.get(`${this.apiUrl}/activeProductsAndSizesIncludingSpecials`);
  }
  applyCoupon(orderId, coupon) {
    return this.http.post(`${this.apiUrl}/orders/${orderId}/coupon/${coupon}/apply`, {});
  }
  createOrder(o) {
    o.status = "pending";
    return this.http.post(`${this.apiUrl}/orders`, o)
  }

  getActiveSpecial() {
    return this.http.get(`${this.apiUrl}/activeSpecial`);
  }
  getActiveSpecials() {
    return this.http.get(`${this.apiUrl}/activeSpecials`);
  }
  getSpecialById(id) {
    return this.http.get(`${this.apiUrl}/specials/${id}`)
  }

  unsubscribe(email) {
    return this.http.patch(`${this.apiUrl}/users`, {
      email
    });
  }
  updateOrderDetails(orderId, body) {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/updateOrderDetails`, body);
  }
  getAvailableTimeSlots() {
    return this.http.get(`${this.apiUrl}/orders/availableTimes/6`);
  }
  getAvailableSpecialSlots(id) {
    return this.http.get(`${this.apiUrl}/orders/availableSpecialTimes/${id}`);
  }
}
