import {Component, OnInit} from '@angular/core';
import {ModalController, PickerController} from '@ionic/angular';
import {DataServiceService} from '../services/data-service.service';
import * as moment from 'moment';
import {OrderService} from '../services/order.service';
import {ProductsService} from '../products.service';
import {HelperService} from '../services/helper.service';
import {SpinnerService} from '../services/spinner.service';
import {PayNowPage} from '../pay-now/pay-now.page';

@Component({
  selector: 'app-select-order-time',
  templateUrl: './select-order-time.page.html',
  styleUrls: ['./select-order-time.page.scss'],
})
export class SelectOrderTimePage implements OnInit {
  selectedDate;
  selectedTime;
  dateFormattedForSelection;
  availableTimes;

  constructor(public modalController: ModalController,
              public dataService: DataServiceService,
              private orderService: OrderService,
              private helperService: HelperService,
              private productService: ProductsService,
              private spinnerService: SpinnerService,
              public pickerController: PickerController) {
  }

  async ngOnInit(): Promise<void> {

  }

  async ionViewWillEnter() {
    await this.spinnerService.showSpinner();
    await this.productService.loadAvailableTimes();
    this.availableTimes = await this.orderService.getTimesForCart();
    this.availableTimes = Object.keys(this.availableTimes).sort((a, b) => {
      const aDate = new Date(a);
      const bDate = new Date(b);
      return aDate.getTime() < bDate.getTime() ? -1 : 1;
    }).reduce(
      (obj, key) => {
        obj[key] = this.availableTimes[key];
        return obj;
      },
      {}
    );
    this.initializeFormattedObject();
    this.selectedDate = this.formatDates()[0];
    await this.spinnerService.hideSpinner();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  formatArrForPicker(arr) {
    return arr.map(val => ({
      text: val,
      value: val
    }));

  }
  initializeFormattedObject() {
    // Convert the original object to the desired format
    this.dateFormattedForSelection = Object.keys(this.availableTimes).reduce((result, dateString) => {
      const date = new Date(dateString);
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getDate();
      const formattedDate = `${month} ${day}`;

      // Add the formatted date and times to the result
      if(!result[formattedDate]) {
        result[formattedDate] = [];
      }
      const hour1s = date.getHours() > 12 ? (date.getHours() - 12).toLocaleString('en-US', {minimumIntegerDigits: 2}) : date.getHours();
      const minute1s = date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});
      const AMPM = date.getHours() >= 12 ? 'PM' : 'AM';

      // Concatenate hours and minutes with a colon
      const formattedTime = `${hour1s}:${minute1s} ${AMPM}`;
      result[formattedDate].push(formattedTime);
      return result;
    }, {});
  }

  selectDate(date) {
    this.selectedDate = date;
  }
  clearTime() {
    this.selectedTime = null;
  }
  segmentChanged(event) {
    this.selectedDate = event.data;
  }
  selectTime(time) {
    this.selectedTime = time;
  }

  getHoursForTimes() {
    const vals = this.dateFormattedForSelection[this.selectedDate].map(v => v.split(':')[0]);
    return new Set([...vals]);
  }
  getTimesForSelectedDateAndHour(hour) {
    const times = this.dateFormattedForSelection[this.selectedDate];
    return times.filter(t => t.split(':')[0] === hour);
  }

  displayMonths() {
  }

  formatMonth(index) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[index];
  }

  formatDates() {
    return Object.keys(this.dateFormattedForSelection);
  }
  getMonthValues() {
    const months = Object.keys(this.availableTimes || []).map(date => {
      const d = new Date(date);
      return (d.getMonth()).toString();
    });
    return [...new Set(months)];
  }

  getFormattedMonths() {
    return this.getMonthValues().map(val => this.formatMonth(val));
  }

  formatHour(hours) {
    const suffix = hours < 12 ? '' : '';
    return ((hours + 11) % 12 + 1) + suffix;
  }

  getMonthIndex(month: string): number {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(month);
  }
  getDateFromSelections(selectedDate, selectedTime) {
    // Parse selectedDate
    const dateParts = selectedDate.split(' ');
    const month = dateParts[0];
    const day = parseInt(dateParts[1], 10);

    // Parse selectedTime
    const timeParts = selectedTime.split(/:|\s/);
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const meridian = timeParts[2];

    // Adjust hours for PM times
    if (meridian === 'PM') {
      hours += 12;
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Construct the Date object
    const dateObject = new Date(currentYear, this.getMonthIndex(month), day, hours, minutes);

    return dateObject;
  }
  async submitAndContinue() {
    const date = this.getDateFromSelections(this.selectedDate, this.selectedTime);
    this.orderService.setPickupTime(date);
    // const order = this.orderService.getOrder();
    // let orderRes;
    // try {
    //   console.log('CREATING ORDER ', order);
    //   orderRes = await this.dataService.createOrder(order).toPromise();
    //   console.log('ORDER RES ', orderRes);
    // } catch (e) {
    //   console.log(e);
    //   await this.helperService.presentAlertMessage(JSON.stringify(e));
    // }
    // if (!orderRes.id) {
    //   await this.helperService.presentAlertMessage('Something went wrong creating your order, please try again');
    //   return;
    // }

    // this.orderService.setOrder(orderRes);
    const modal = await this.modalController.create({
      component: PayNowPage,
      componentProps: {
        // order: orderRes,
        // subtotal: orderRes.subtotal,
      }
    });
    // modal.onDidDismiss().then(async (detail: any) => {
    //   this.spinnerService.hideSpinner();
    //   if (detail.data && detail.data.success) {
    //     await this.helperService.presentAlertMessage('Thank you for your order! We will email you a receipt.',
    //       this.helperService.refreshPage);
    //   }
    // });
    await modal.present();
  }
}
