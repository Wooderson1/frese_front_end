import {Component} from '@angular/core';

declare var Stripe;
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../services/data-service.service";
import {AlertController, ModalController} from "@ionic/angular";
import {SpinnerService} from "../services/spinner.service";
import {DatePickerPage} from "../date-picker/date-picker.page";
import * as moment from "moment";

@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.page.html',
  styleUrls: ['./pay-now.page.scss'],
})
export class PayNowPage {
  stripe = Stripe('pk_test_51KasQqEZvpspKOfSlXnGLRy8IxkOOIZfo5bSREuWGPiK4HCkRyPaSy3m6TqFll4shlG3czSvOiE6eeUEUBG4Ueat00nSgYii4r');
  card: any;
  customerInfo: any = {};
  orderId;
  createdOrder;
  orderNotes;
  total;
  pickupDate;
  formattedDate;
  availableTimes;

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService,
              private alertController: AlertController,
              private modalController: ModalController,
              private dataService: DataServiceService) {
  }

  async ngOnInit() {
    this.setupStripe();
    this.availableTimes = await this.dataService.getAvailableTimeSlots().toPromise();
    this.pickupDate = moment(Object.keys(this.availableTimes)[0]).toDate();
  }

  cancelPayment() {
    this.modalController.dismiss();
  }

  formatDate() {
    const d = this.pickupDate;
    const hours = d.getHours() > 12 ? (d.getHours() - 12).toLocaleString('en-US', {minimumIntegerDigits: 2}) : d.getHours();
    const minutes = d.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});
    const AMPM = d.getHours() >= 12 ? 'PM' : 'AM';
    return [d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()].join('/') + ' ' +
      [hours,
        minutes].join(':') + " " + AMPM;
  }

  async setPickupTime() {
    const m = await this.modalController.create({
      component: DatePickerPage,
      componentProps: {
        pickupTime: this.pickupDate,
        availableTimes: this.availableTimes
      }
    });
    m.onDidDismiss().then(async (detail: any) => {
      console.log(detail);
      if (detail.data === undefined) {
        return;
      }
      this.pickupDate = detail.data.pickupTime;
    });
    await m.present();
  }

  async requiredFieldsCompleted() {
    console.log(this.customerInfo);
    if (!this.customerInfo.name || !this.customerInfo.email || !this.customerInfo.phone) {
      await this.presentAlertMessage("Please fill out the required fields.");
      return false;
    }
    return true;
  }

  async presentAlertMessage(msg, func = null) {
    const binded = func && func.bind(this);
    const alert = await this.alertController.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        cssClass: 'primary',
        handler: () => {
          binded && binded();
        }
      }
      ]
    });
    await alert.present();
  }

  displayAmount(amount) {
    return amount.toFixed(2);
  }

  async makePayment(token) {
    this.spinnerService.showSpinner();
    let paymentData;
    try {
      paymentData = await this.dataService.processPayment({
        amount: 100,
        currency: 'usd',
        token: token.id,
        orderId: this.orderId,
        email: this.customerInfo.email,
        phone: this.customerInfo.phone,
        name: this.customerInfo.name
      }).toPromise();
    } catch (err) {
      console.log("ERR");
      await this.presentAlertMessage("We had trouble processing your payment. Please try again");
      return;
    }
    console.log("PAYMENT ", paymentData);
    try {

      if (paymentData.status !== "succeeded") {
        this.spinnerService.hideSpinner();
        console.log("payment failed ", paymentData);
        await this.presentAlertMessage("We had trouble processing your payment. Please try again");
        return;
      } else {
        await this.dataService.updateOrderDetails(this.orderId, {
          notes: this.orderNotes,
          pickupTime: this.pickupDate
        }).toPromise();
        this.modalController.dismiss({success: true});
      }
    } catch (err) {
      this.dataService.updateOrderDetails(this.orderId, {
        notes: this.orderNotes,
        pickupTime: this.pickupDate
      }).toPromise();
      this.modalController.dismiss({success: true});

    }
  }

  setupStripe() {
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', {style: style});
    console.log(this.card);
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submssit', async event => {
      event.preventDefault();
      console.log(event)

      if (!(await this.requiredFieldsCompleted())) {
        return;
      }

        this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log("R ", result);
          this.makePayment(result.token);
        }
      });
    });
  }

  async Pay() {
    if (!(await this.requiredFieldsCompleted())) {
      return;
    }

    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        console.log("R ", result);
        this.makePayment(result.token);
      }
    });
  }
}
