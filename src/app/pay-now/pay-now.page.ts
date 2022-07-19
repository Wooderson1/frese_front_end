import {Component, ViewEncapsulation} from '@angular/core';
import * as validateEmail from '../helpers/emailValidator';
import * as validatePhone from '../helpers/phoneValidator';

declare var Stripe;
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../services/data-service.service";
import {AlertController, ModalController} from "@ionic/angular";
import {SpinnerService} from "../services/spinner.service";
import {DatePickerPage} from "../date-picker/date-picker.page";
import * as moment from "moment";
import {error} from "protractor";

@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.page.html',
  styleUrls: ['./pay-now.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayNowPage {
  stripe = Stripe('pk_live_51KasQqEZvpspKOfSzW7sdVtBJmH1pVuJ7MkqdkFvwMqH1FG2RkSdpI5qDqEzsxeNgUOwODddzocbKqlRu90DAnMA00Y537FNq1');
  // stripe = Stripe('pk_test_51KasQqEZvpspKOfSlXnGLRy8IxkOOIZfo5bSREuWGPiK4HCkRyPaSy3m6TqFll4shlG3czSvOiE6eeUEUBG4Ueat00nSgYii4r');
  card: any;
  customerInfo: any = {};
  orderId;
  createdOrder;
  orderNotes;
  total;
  pickupDate;
  formattedDate;
  availableTimes;
  cart;
  purchaseInProgress = false;

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService,
              private alertController: AlertController,
              private modalController: ModalController,
              private dataService: DataServiceService) {
  }

  async ngOnInit() {
    this.pickupDate = moment(Object.keys(this.availableTimes)[0]).toDate();
  }

  async ngAfterViewInit() {
    this.setupStripe();
    // this.availableTimes = await this.dataService.getAvailableSpecialSlots().toPromise();
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

      if (detail.data === undefined) {
        return;
      }
      this.pickupDate = detail.data.pickupTime;
    });
    await m.present();
  }

  async requiredFieldsCompleted() {

    if (!this.customerInfo.name || !this.customerInfo.email || !this.customerInfo.phone) {
      await this.presentAlertMessage("Please fill out the required fields.");
      return false;
    } else if (!validateEmail(this.customerInfo.email)) {
      await this.presentAlertMessage("Please enter a valid email");
      return false;
    } else if (!validatePhone(this.customerInfo.phone)) {
      await this.presentAlertMessage("Please enter a valid phone number");
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
    this.cart.email = this.customerInfo.email;
    this.cart.phone = this.customerInfo.phone;
    this.cart.name = this.customerInfo.name;
    this.cart.pickupTime = this.pickupDate;
    this.cart.notes = this.orderNotes;
    try {
      paymentData = await this.dataService.processPaymentAndCreateOrder({
        amount: this.total * 100,
        cart: this.cart,
        currency: 'usd',
        token: token.id,
      }).toPromise();
    } catch (err) {
      await this.presentAlertMessage("We had trouble processing your payment. Please try again");
      this.purchaseInProgress = false;
      return;
    }

    if (paymentData.status !== "succeeded") {
      this.spinnerService.hideSpinner();

      await this.presentAlertMessage("We had trouble processing your payment. Please try again");
      this.purchaseInProgress = false;

      return;
    }
    this.modalController.dismiss({success: true});
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.destroy();
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
    form.addEventListener('submit', async event => {
      event.preventDefault();


      if (!(await this.requiredFieldsCompleted())) {
        return;
      }

      this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {

          this.makePayment(result.token);
        }
      });
    });
  }

  async Pay() {
    this.purchaseInProgress = true;
    if (!(await this.requiredFieldsCompleted())) {
      this.purchaseInProgress = false;
      return;
    }

    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
        this.purchaseInProgress = false;
      } else {
        this.makePayment(result.token);
      }
    });
  }
}
