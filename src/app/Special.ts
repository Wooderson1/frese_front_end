import {Component, EventEmitter, Injectable} from '@angular/core';
import {DataServiceService} from './services/data-service.service';

export default class Special {
  availableTimes;
  products;
  productsUpdated = new EventEmitter();
  types;
  id;
  name;

  constructor(private json: any = null, private dataService: DataServiceService) {
    const { products, timeslots, id, name } = json;
    this.products = products;
    this.id = id;
    this.name = name;
    this.availableTimes = timeslots;
  }


  async sortBySpecial(products) {
    this.types = await this.dataService.getProductTypes().toPromise();
    const specialTypeId = this.types.find(element => element.name === 'Special');
    return products.sort((a, b) => {
      if (a.typeId === specialTypeId.id) {
        return -1;
      }
      return 1;
    });
  }
  getAvailableTimes() {
    return this.availableTimes;
  }
  getAvailableTimesCount() {
    if(!this.availableTimes) { return 0; }
    return Object.keys(this.availableTimes).length;
  }
  async formatMenu() {
    const t = this.initializeSelectedSizes(this.products);
    this.products = await this.sortBySpecial(t);
  }
  initializeSelectedSizes(menu) {
    console.log('M ', menu);
    menu.forEach((item) => {
      if (item.product_sizes && item.product_sizes.length > 0) {
        item.product_size_selected = item.product_sizes[0];
      }
    });
    return menu;
  }
  setProducts(p) {
    this.products = p;
  }

  getProducts() {
    return this.products;
  }
  findMatchingProduct(p) {
    return this.products.find(product => product.id === p);
  }

  updateProductQuantity(itemId, increment) {
    const p = this.findMatchingProduct(itemId);
    if (p.quantity === -1) {
      return;
    }
    p.quantity -= increment;
    this.productsUpdated.emit(this.products);

  }
}
