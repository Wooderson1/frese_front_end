import {EventEmitter, Injectable} from '@angular/core';
import {DataServiceService} from './services/data-service.service';
import Special from './Special';

@Injectable({
  providedIn: 'root'
})
export class SpecialsProductsService {

  specials: {};
  specialLoading = true;
  SLEEP_COUNT = 100;
  constructor(private dataService: DataServiceService) {
    this.init().then(() => {
    });
    this.specials = {};
  }
  async waitForSpecials() {
    let i = 0;
    while(this.specialLoading && i < this.SLEEP_COUNT) {
      console.log('.');
      await this.sleep(100);
      i++;
    }
    return this.specials;
  }
  getTimesForSpecials(specials) {
    const times = {};
    specials.forEach(specialId =>{
      const special = this.specials[specialId];
      if(special.getAvailableTimesCount() > 0) {
        Object.keys(special.availableTimes).forEach(key => {
          times[key] = special.availableTimes[key];
        });
      }
      });
    return times;
  }
  getSpecialIdsContainingProductId(productId) {
    const specialIds = [];
    Object.keys(this.specials).forEach(specialId => {
      const { id, products } = this.specials[specialId];
      const prodIds = products.map(v => v.id);
      if(prodIds.includes(productId)) {
        specialIds.push(id);
      }
    });
    return specialIds;
  }
  getFirstSpecial() {
    const keys = Object.keys(this.specials);
    return this.specials[keys[0]];
  }

  async init() {
    try {
    const res = await this.dataService.getActiveSpecials().toPromise();
    if (!res || res.length === 0) { // we removed a check for end time being > now
      this.specialLoading = false;
      return;
    }
    for (const special of res) {
      const s = new Special(special, this.dataService);
      console.log('SS', s);
      await s.formatMenu();
      this.specials[s.id]=s;
    }
    this.specialLoading = false;
    } catch(err) {
      this.specialLoading = false;
    }
  }
  activeSpecial() {
    return Object.keys(this.specials).length > 0;
  }
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async getSpecials() {
    let i = 0;
    while(this.specialLoading && i < this.SLEEP_COUNT) {
      await this.sleep(100);
      i++;
    }
    return Object.keys(this.specials).map(v => this.specials[v]);
  }
}
