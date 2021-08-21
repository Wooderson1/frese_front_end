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
    return this.http.get(`${this.apiUrl}/products`);
  }
}
