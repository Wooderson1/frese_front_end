import {Component, ViewEncapsulation} from '@angular/core';
import * as validateEmail from '../helpers/emailValidator';
import * as validatePhone from '../helpers/phoneValidator';

declare let Stripe;
import {HttpClient} from '@angular/common/http';
import {DataServiceService} from '../services/data-service.service';
import {AlertController, ModalController} from '@ionic/angular';
import {SpinnerService} from '../services/spinner.service';
import {DatePickerPage} from '../date-picker/date-picker.page';
import * as moment from 'moment';
import {error} from 'protractor';
import {OrderService} from '../services/order.service';
import {SpecialsProductsService} from '../specials-products.service';
import {ProductsService} from '../products.service';
import {OrderSuccessPage} from '../order-success/order-success.page';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.page.html',
  styleUrls: ['./pay-now.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayNowPage {
  stripe = Stripe(environment.stripe);
  // stripe = Stripe('pk_live_51KasQqEZvpspKOfSzW7sdVtBJmH1pVuJ7MkqdkFvwMqH1FG2RkSdpI5qDqEzsxeNgUOwODddzocbKqlRu90DAnMA00Y537FNq1');
  // stripe = Stripe('pk_test_51KasQqEZvpspKOfSlXnGLRy8IxkOOIZfo5bSREuWGPiK4HCkRyPaSy3m6TqFll4shlG3czSvOiE6eeUEUBG4Ueat00nSgYii4r');
  card: any;
  customerInfo: any = {};
  coupon;
  order;
  createdOrder;
  orderNotes;
  total;
  elements;
  pickupDate;
  formattedDate;
  availableTimes;
  cart;
  couponApplied = false;
  purchaseInProgress = false;
  clientSecret;
  private paymentIntent: any;
  private paymentElement: any;

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService,
              private alertController: AlertController,
              private modalController: ModalController,
              private orderService: OrderService,
              private specialsProductsService: SpecialsProductsService,
              private productsService: ProductsService,
              private dataService: DataServiceService) {
  }

  async ngOnInit() {
    /*
    1. a special exists with slots
    2. a special exists, no slots
    3. no special exists, use regular hours
     */
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
    if (Object.keys(this.availableTimes).length === 0) {
      this.pickupDate = null;
    } else {
      this.pickupDate = moment(Object.keys(this.availableTimes)[0]).toDate();
    }
  }

  async ngAfterViewInit() {
    console.log(this.order.total);
    this.dataService.getIntent({amount: Math.round(this.order.total * 100)}).subscribe(async (res: any) => {
      this.paymentIntent = res;
      console.log(this.paymentIntent);
      const {client_secret: clientSecret} = this.paymentIntent;
      this.clientSecret = clientSecret;
      await this.setupStripe1(clientSecret);
      document.querySelector('#payment-form').addEventListener('submit', this.handleSubmit.bind(this));

    });

  }

  cancelPayment() {
    this.modalController.dismiss();
  }

  async applyCoupon() {
    const response = await this.dataService.applyCoupon(this.paymentIntent.id, this.order.id, this.coupon).toPromise();
    console.log('RES ', response);
    if (response.error) {
      await this.presentAlertMessage(response.error, null);
      this.coupon = null;
      return;
    } else {
      this.couponApplied = true;
    }
    this.order = response.message;
  }

  formatDate() {
    const d = this.pickupDate;
    if (!this.pickupDate) {
      return 'Unable to accept new orders at this time!';
    }
    const hours = d.getHours() > 12 ? (d.getHours() - 12).toLocaleString('en-US', {minimumIntegerDigits: 2}) : d.getHours();
    const minutes = d.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});
    const AMPM = d.getHours() >= 12 ? 'PM' : 'AM';
    return [d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()].join('/') + ' ' +
      [hours,
        minutes].join(':') + ' ' + AMPM;
  }

  async setPickupTime() {
    if (!this.pickupDate) {
      return;
    }
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
      await this.presentAlertMessage('Please fill out the required fields.');
      return false;
    } else if (!validateEmail(this.customerInfo.email)) {
      await this.presentAlertMessage('Please enter a valid email');
      return false;
    } else if (!validatePhone(this.customerInfo.phone)) {
      await this.presentAlertMessage('Please enter a valid phone number');
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
        amount: this.order.total * 100,
        // cart: this.cart,
        currency: 'usd',
        token: token.id,
        orderId: this.order.id,
        email: this.customerInfo.email,
        phone: this.customerInfo.phone,
        name: this.customerInfo.name,
        pickupTime: this.pickupDate
      }).toPromise();
    } catch (err) {
      if (err.error.message === 'Order already paid for') {
        await this.dataService.updateOrderDetails(this.order.id, {
          notes: this.orderNotes,
          pickupTime: this.pickupDate
        }).toPromise();
        await this.presentAlertMessage('It looks like we processed this order already, please call to confirm your order (518) 756-1000');
        await this.modalController.dismiss({success: false});
        return;
      }
      await this.presentAlertMessage('We had trouble processing your payment. Please try again');
      this.purchaseInProgress = false;
      return;
    }

    if (paymentData.status !== 'succeeded') {
      this.spinnerService.hideSpinner();

      await this.presentAlertMessage('We had trouble processing your payment. Please try again');
      this.purchaseInProgress = false;

      return;
    } else {
      try {
        await this.dataService.updateOrderDetails(this.order.id, {
          notes: this.orderNotes,
          pickupTime: this.pickupDate
        }).toPromise();
      } catch (err) {
        await this.presentAlertMessage('Something went wrong with your order. Please call the bakery at (518) 756-1000');
      }
      await this.modalController.dismiss({success: true});
    }
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.destroy();
    }
  }

  isPurchaseInProgress() {
    return this.purchaseInProgress;
  }

  async Pay() {
    this.purchaseInProgress = true;
    if (!(await this.requiredFieldsCompleted())) {
      this.purchaseInProgress = false;
      return;
    }
    return;
  }

  //   this.stripe.createToken(this.card).then(result => {
  //     if (result.error) {
  //       var errorElement = document.getElementById('card-errors');
  //       errorElement.textContent = result.error.message;
  //       this.purchaseInProgress = false;
  //     } else {
  //       this.makePayment(result.token);
  //     }
  //   });
  // }


  showMessage(messageText) {
    const messageContainer = document.querySelector('#payment-message');

    messageContainer.classList.remove('hidden');
    messageContainer.textContent = messageText;

    setTimeout(function() {
      messageContainer.classList.add('hidden');
      messageContainer.textContent = '';
    }, 4000);
    this.setLoading(false);
  }

// Fetches a payment intent and captures the client secret
  async setupStripe1(clientSecret) {
    const appearance = {
      theme: 'flat',
      labels: 'floating',
      variables: {
        colorPrimary: '#ffb038'
      }
    };
    const options = {
      wallets: 'auto',
      fields: {
        billingDetails: {
          email: 'never'
        }
      }
    };
    this.elements = this.stripe.elements({appearance, clientSecret, paymentMethodCreation: 'manual'});
    this.paymentElement = this.elements.create('payment', options);
    this.paymentElement.mount('#payment-element');
  }

  async handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!(await this.requiredFieldsCompleted())) {
      this.setLoading(false);
      return;
    }
    const {error: submitError} = await this.elements.submit();
    if (submitError) {
      this.showMessage('Error submitting payment');
      return;
    }

    const {error, paymentMethod} = await this.stripe.createPaymentMethod({
      elements: this.elements,
      params: {
        billing_details: {
          name: this.customerInfo.name,
          email: this.customerInfo.email
        }
      }
    });

    if (error) {
      this.showMessage('Payment details incomplete');
      return;
    }


    try {
      let error;
      console.log('ID ', this.paymentIntent.id);
      const resp = await this.dataService.processIntent(
        {
          amount: this.order.total * 100,
          // cart: this.cart,
          currency: 'usd',
          orderId: this.order.id,
          email: this.customerInfo.email,
          phone: this.customerInfo.phone,
          name: this.customerInfo.name,
          pickupTime: this.pickupDate,
          paymentInfo: {
            intent: this.paymentIntent.id,
            payment_method: paymentMethod.id
          }
        }
      ).toPromise();
      console.log('RESP ', resp);
      if (resp.error) {
        error = resp.error.raw;
      } else {
        this.paymentIntent = resp.paymentIntent;
      }

      if (error && (error.type === 'card_error' || error.type === 'validation_error')) {
        this.showMessage(error.message);
      } else if (error && error.type === 'invalid_request_error' && error.message.includes('previously confirmed')) {
        this.showMessage('Order already paid. Please call (518) 756-1000 to verify order');
      } else if (this.paymentIntent && this.paymentIntent.status === 'succeeded' && !error) {
        this.showMessage('Payment successful');
        const {order} = await this.dataService.updateOrderDetails(this.order.id, {
          notes: this.orderNotes,
          pickupTime: this.pickupDate
        }).toPromise();
        this.order = order;
        const modal = await this.modalController.create({
          component: OrderSuccessPage,
          componentProps: {
            order: this.order
            // cart: this.cart,
          }
        });
        modal.onDidDismiss().then(async (detail: any) => {
        });
        await modal.present();
      } else if(this.paymentIntent && this.paymentIntent && this.paymentIntent.next_action.cashapp_handle_redirect_or_display_qr_code){ // CHECK FOR succeeded / failed
        const return_url = `http://localhost:3100/#/order-success?orderId=${this.order.id}`;
        console.log(return_url);
        const response = await this.stripe.confirmCashappPayment(this.clientSecret, {
          payment_method: {
            type: 'cashapp',
          },
          return_url,
        });
    }else {
        console.error(error);
        console.error(error.type);
        console.log(this.paymentIntent.status);
        this.showMessage('Oops something went wrong!');
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      this.showMessage('Something went wrong!');
    }

// Show a spinner on payment submission
    function setLoading(isLoading) {
      if (isLoading) {
        // Disable the button and show a spinner
        ((document.querySelector('#submit')) as any).disabled = true;
        document.querySelector('#spinner').classList.remove('hidden');
        document.querySelector('#button-text').classList.add('hidden');
      } else {
        ((document.querySelector('#submit')) as any).disabled = false;
        document.querySelector('#spinner').classList.add('hidden');
        document.querySelector('#button-text').classList.remove('hidden');
      }
    }
  }
  setLoading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      ((document.querySelector('#submit')) as any).disabled = true;
      document.querySelector('#spinner').classList.remove('hidden');
      document.querySelector('#button-text').classList.add('hidden');
    } else {
      ((document.querySelector('#submit')) as any).disabled = false;
      document.querySelector('#spinner').classList.add('hidden');
      document.querySelector('#button-text').classList.remove('hidden');
    }
  }
// Fetches the payment intent status after payment submission
  async checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    const {paymentIntent} = await this.stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case 'succeeded':
        this.showMessage('Payment succeeded!');
        break;
      case 'processing':
        this.showMessage('Your payment is processing.');
        break;
      case 'requires_payment_method':
        this.showMessage('Your payment was not successful, please try again.');
        break;
      default:
        this.showMessage('Something went wrong.');
        break;
    }
  }


}
