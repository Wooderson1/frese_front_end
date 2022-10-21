import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products;
  productsUpdated = new EventEmitter();

  constructor() {
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
    p.quantity -= increment;
    this.productsUpdated.emit(this.products);
  }
}
