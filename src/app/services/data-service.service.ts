import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderServiceService } from './order-service.service';
import { Observable } from 'rxjs';
import {StripeService} from "./stripe.service";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient,
              private stripeService: StripeService,
              private orderService: OrderServiceService) { }

  getProductTypes(): Observable<any> {
    return this.orderService.getProductTypes();
  }
  getFullMenu(): Observable<any> {
    return this.orderService.getFullMenu();
  }
  getActiveMenu(): Observable<any> {
    return this.orderService.getActiveMenu();
  }

  createOrder(o): Observable<any> {
    return this.orderService.createOrder(o);
  }

  updateOrderDetails(orderId, body): Observable<any> {
    return this.orderService.updateOrderDetails(orderId, body);
  }

  getAvailableTimeSlots(): Observable<any> {
    return this.orderService.getAvailableTimeSlots();
  }
  getAvailableSpecialSlots(id): Observable<any> {
    return this.orderService.getAvailableSpecialSlots(id);
  }

  getActiveSpecial() : Observable<any> {
    return this.orderService.getActiveSpecial();
  }
  getSpecialById(id) : Observable<any> {
    return this.orderService.getSpecialById(id)
  }

  // Stripe

  processPayment(data): Observable<any> {
    return this.stripeService.processPayment(data);
  }
  processPaymentAndCreateOrder(data): Observable<any> {
    return this.stripeService.processPaymentAndCreateOrder(data);
  }
}
