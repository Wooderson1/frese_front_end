import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {OrderService} from "../../services/order.service";
import {ModalController} from "@ionic/angular";
import {PayNowPage} from "../../pay-now/pay-now.page";
import { CartPage } from 'src/app/cart/cart.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input()titleTest: string;
  orderBody: any;
  specialsId;
  menuToggled = false;
  items = 3;
  cart = {
    items: []
  }
  isModalOpen = false;

  constructor(public orderService: OrderService, private cartController: ModalController) { }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.orderService.orderUpdated.subscribe((vals) => {
      const {order, specialsId} = vals;
      this.cart = order;
      this.specialsId = specialsId;
    })
    // this.cart.items = [1,2,3];
  }
  async toggleMenu() {
    this.menuToggled = !this.menuToggled;
    const modal = await this.cartController.create({
      component: CartPage,
      componentProps: {
        cart: this.cart,
        specialsId: this.specialsId
      }
    });
    modal.onDidDismiss().then(async (detail: any) => {
    });
    await modal.present();
  }

  getTotalQuantity() {
    return this.cart.items.reduce((prev , x) => prev + x.quantity, 0);
  }
  ngOnChanges(changes: SimpleChanges) {
  }
}
