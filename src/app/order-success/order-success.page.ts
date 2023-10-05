import { Component, OnInit } from '@angular/core';
import dateFormat from 'dateformat';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.page.html',
  styleUrls: ['./order-success.page.scss'],
})
export class OrderSuccessPage implements OnInit {
  order;
  constructor() { }

  ngOnInit() {
    this.order.items = this.formatOrderItems(this.order);
    console.log(this.order.items);
  }

  getTotal() {
    return this.order.total;
  }
  refreshPage() {
    window.location.reload();
  }
  formatPickupTime(pickupTime) {
    const pt = new Date(pickupTime);
    if(this.isToday(pt)) {
      return dateFormat(pt, 'h:MM TT' );
    } else {
      return dateFormat(pt, 'mm/dd h:MM TT' );
    }
  }
  getSubTotal(): number {
    return this.order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getEstimatedTax(): number {
    return this.order.total - this.getSubTotal();
  }
  displayAmount(amount) {
    return amount.toFixed(2);
  }

  getSelectionKeys(item) {
    console.log('SEL ', item.selections);
    return Object.keys(item.selections);
  }

  getAddOnKeys(item) {
    return Object.keys(item.add_ons);
  }

  getSizeName(item) {
    const productSize = item.product.product_sizes.find(ps => ps.id === item.product_size_id);
    console.log('PS ', productSize);
    return productSize ? productSize.size: null;
  }
  getAddOnValues(item, key) {
    return item.add_ons[key];
  }

  displayTotal() {
    return this.getTotal().toFixed(2);
  }
  formatOrderItems(order) {
    const itemMap = {};
    order.items.forEach(item => {
      let entry = JSON.parse(JSON.stringify(item));
      delete entry.created_at;
      delete entry.updated_at;
      delete entry.id;
      if (item.selections) {
        const parsed = JSON.parse(item.selections);
        entry.selections = [];
        for (const [k, _] of Object.entries(parsed)) {
          entry.selections.push(`${k}: ${parsed[k].value}`);
        }
      }
      if (item.add_ons) {
        const parsed = JSON.parse(item.add_ons);
        entry.add_ons = [];
        for (const [k, _] of Object.entries(parsed)) {
          // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-shadow
          const add_on_res = parsed[k].map(item => item.value).join(', ');
          entry.add_ons.push(`${k}: ${add_on_res}`);
        }
      }
      if (item.product_size) {
        entry.product_size = item.product_size.size;
      }
      entry = JSON.stringify(entry);
      if (itemMap[entry]) {
        itemMap[entry] += 1;
      } else {
        itemMap[entry] = 1;
      }
    });


    return Object.keys(itemMap).map(val => {
      const p = JSON.parse(val);
      p.quantity = itemMap[val];
      return p;
    });
  }
  round(value: number, digits = 2) {
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value;
  }
  isToday(someDate) {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear();
  }
}
