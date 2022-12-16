import {Injectable, EventEmitter, SimpleChanges} from '@angular/core';
import {Storage} from "@ionic/storage";
import { ProductsService } from '../products.service';
import { SpecialsProductsService } from '../specials-products.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order = {items: [], total: 0, subtotal: 0};
  specialsId = null;
  specialLoading = true;
  menuLoading = true;
  orderUpdated = new EventEmitter();

  constructor(private storage: Storage,
              private specialsProductsService: SpecialsProductsService,
              private productsService: ProductsService) {
  }
  async ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  checkForSelectionCount(item) {
    return Object.keys(item.product_selection_values).some(key => {
      return !item.product_selection_values[key].selected
    });
  }

  activeSpecial() {
    return this.specialsId;
  }

  getSpecialId() {
    return this.specialsId;
  }

  getSpecialProducts() {
    const specialProductIds = this.specialsProductsService.getProducts().map(p => p.id)
    return this.productsService.products.filter(p => {
      return specialProductIds.includes(p.id);
    });
  }

  async updateCart(item, increment) {
    const match = this.productsService.findMatchingProduct(item.productId);
    const q = match.quantity;
    if(q === 0 && increment > 0) {
      return "Whoops we don't have that many left, we've updated your cart";
    }
    let index = this.order.items.findIndex(cartItem => {
      const cloneCartItem = JSON.parse(JSON.stringify(cartItem));
      const cloneNewItem = JSON.parse(JSON.stringify(item));
      return JSON.stringify(cloneNewItem) === JSON.stringify(cloneCartItem);
    });
    let matchingItem = this.order.items[index];
    this.productsService.updateProductQuantity(matchingItem.productId, increment);
    if (matchingItem.quantity + increment === 0) {
      this.order.items.splice(index, 1);
      return;
    }
    matchingItem.quantity += increment;

  }

  containsSpecialProducts() {
    const specialTypeId = this.productsService.types.find(element => {
      return element.name === "Special";
    })
    return this.order.items.some(item => {
      return item.typeId === specialTypeId.id;
    })
  }

  async loadRegularTimes() {
    await this.productsService.loadAvailableTimes();
  }
  async loadSpecialTimes() {
    await this.specialsProductsService.loadAvailableTimes(this.specialsId);
  }

  async addToCart(newItem) {
    if (newItem.quantity === 0) {
      // await this.presentAlertMessage("Whoops we don't have that many left, we've updated your cart");
      return "Whoops we don't have that many left, we've updated your cart";
    }
    if (this.checkForSelectionCount(newItem)) {
      return "Please make a selection";
    }
    newItem.quantity--;
    let item = this.formatCartItem(newItem);

    this.addItem(item);
  }

  getItemCost(item) {
    if (item.product_size_selected) {
      return item.product_size_selected.cost;
    } else {
      return item.price;
    }
  }

  formatSize(item) {
    if (!item.product_size_selected) {
      return null;
    }
    let id = item.product_size_selected.id;
    item.product_size_selected = item.product_sizes[0];
    return id;
  }

  formatCartItem(item) {
    return {
      price: this.getItemCost(item),
      productId: item.id,
      product_name: item.title,
      quantity: 1,
      product_size_id: this.formatSize(item),
      selections: this.formatSelections(item),
      add_ons: this.formatAddOns(item),
      typeId: item.typeId
    };
  }

  formatAddOns(item) {
    let vals = {};
    Object.keys(item.product_add_on_values).forEach(key => {
      if (item.product_add_on_values[key].selected) {
        vals[key] = item.product_add_on_values[key].selected.map(val => {
          return {
            value: val.value,
            cost: val.cost
          }
        });
        item.product_add_on_values[key].selected = null;
      }
    });
    return vals;
  }

  formatSelections(item) {
    let vals = {};
    Object.keys(item.product_selection_values).forEach(key => {
      if (item.product_selection_values[key].selected) {
        vals[key] = {
          value: item.product_selection_values[key].selected.value,
          cost: item.product_selection_values[key].selected.cost
        };
        item.product_selection_values[key].selected = null;
      }
    });
    return vals;
  }

  addItem(item) {
    let foundIdentical = false;
    this.order.items.forEach(i => {
      let oldQuantity = i.quantity;
      i.quantity = 1;
      if (JSON.stringify(i) == JSON.stringify(item)) {
        i.quantity = oldQuantity + 1;
        foundIdentical = true;
        return;
      } else {
        i.quantity = oldQuantity;
      }
    })
    if (foundIdentical) {
      this.setSpecialId(this.specialsId);
      return;
    }
    this.order.items.push(item);
    this.setSpecialId(this.specialsId);
  }

  setSpecialId(id) {
    this.specialsId = id;
    this.orderUpdated.emit({order: this.order, specialsId: this.specialsId});
  }

  setMenuLoading(x) {
    this.menuLoading = x;
    this.orderUpdated.emit({loading: this.menuLoading})
  }
  setLoading(x) {
    this.specialLoading = x;
    this.orderUpdated.emit({loading: this.specialLoading})
  }
  setOrder(x) {
    this.order = x;
    this.orderUpdated.emit({order: this.order, specialsId: this.specialsId});
  }

  getOrder() {
    return this.order;
  }
}
