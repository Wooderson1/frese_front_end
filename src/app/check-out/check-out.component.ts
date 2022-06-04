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
  card = '';
  cardExpiriation = '';
  cardCVC = '';
  payment;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  close() {
    this.popoverController.dismiss();
  }

  done() {





    //window.location.reload();
  }
}
