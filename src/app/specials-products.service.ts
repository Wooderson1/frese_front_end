import {EventEmitter, Injectable} from '@angular/core';
import {DataServiceService} from "./services/data-service.service";

@Injectable({
  providedIn: 'root'
})
export class SpecialsProductsService {

  products;
  productsUpdated = new EventEmitter();
  availableTimes;
  constructor(private dataService: DataServiceService) {
  }

  async loadAvailableTimes(specialId) {
    this.availableTimes = await this.dataService.getAvailableSpecialSlots(specialId).toPromise();
  }
  getAvailableTimes() {
    return this.availableTimes;
  }
  getAvailableTimesCount() {
    if(!this.availableTimes) { return 0; }
    return Object.keys(this.availableTimes).length;
  }

  setProducts(p) {
    this.products = p;
  }

  getProducts() {
    return this.products;
  }

  findMatchingProduct(p) {
    return this.products.find(product => product.id === p)
  }

  updateProductQuantity(itemId, increment) {
    const p = this.findMatchingProduct(itemId);
    if(p.quantity === -1){ return; }
    p.quantity -= increment;
    this.productsUpdated.emit(this.products);
  }
}
