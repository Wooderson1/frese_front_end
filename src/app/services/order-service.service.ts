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
    return this.http.get(`${this.apiUrl}/activeProductsAndSizes`);
  }
  createOrder(o) {
    o.status = "pending";
    return this.http.post(`${this.apiUrl}/orders`, o)
  }

  getSpecialById(id) {
    return this.http.get(`${this.apiUrl}/specials/${id}`)
  }

  updateOrderDetails(orderId, body) {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/updateOrderDetails`, body);
  }
  getAvailableTimeSlots() {
    return this.http.get(`${this.apiUrl}/orders/availableTimes`);
  }
  getAvailableSpecialSlots(id) {
    return this.http.get(`${this.apiUrl}/orders/availableSpecialTimes/${id}`);
  }
}
