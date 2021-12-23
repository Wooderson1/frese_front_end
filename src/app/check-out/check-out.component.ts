import { Component, Input, NgModule, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})

export class CheckOutComponent implements OnInit {

  @Input() value;
  todaysDate = new Date().toISOString();
  email = '';
  phone = '';
  payment;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  close() {
    this.popoverController.dismiss();
  }

  done() {
    console.log('Email: ' + this.email);
    console.log('Phone number: ' + this.phone);
    console.log('Date/Time of Pickup' + this.todaysDate);
    console.log('Card or in sotre payment: ' + this.payment);
    console.log(this.value);
    //window.location.reload();
  }
}
