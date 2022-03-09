import {Component, OnInit} from '@angular/core';

declare var Stripe;
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../services/data-service.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.page.html',
  styleUrls: ['./pay-now.page.scss'],
})
export class PayNowPage {
  stripe = Stripe('pk_test_51KasQqEZvpspKOfSlXnGLRy8IxkOOIZfo5bSREuWGPiK4HCkRyPaSy3m6TqFll4shlG3czSvOiE6eeUEUBG4Ueat00nSgYii4r');
  card: any;
  cart;

  constructor(private http: HttpClient,
              private modalController: ModalController,
              private dataService: DataServiceService) {
  }

  ngOnInit() {
    console.log("CART ", this.cart);
    this.setupStripe();
  }

  cancelPayment() {
    this.modalController.dismiss();
  }

  makePayment(token) {

    // do we do a new status for pending? or is open the same?
    this.dataService.createOrder(this.cart).subscribe(orderRes => {
      if(orderRes.statusCode !== 201) { return; } // Throw error here w/ alert
      this.dataService.processPayment({
        amount: 100,
        currency: 'usd',
        token: token.id
      }).subscribe(data => {
        console.log("RES ", data);
      })
    })
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
    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log(event)

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

}
