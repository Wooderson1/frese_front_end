import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input()title: string;
  menuToggled = false;
  items = 3;
  cart = {
    items: [1,2,3]
  }

  constructor() { }

  ngOnInit() {
    // this.cart.items = [1,2,3];
  }
  toggleMenu() {
    console.log("TOGGLE");
    this.menuToggled = !this.menuToggled;
  }

  getTotalQuantity() {
    return 3;
  }
}
