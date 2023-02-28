import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {OrderService} from "../../services/order.service";
import {ModalController} from "@ionic/angular";
import { CartPage } from 'src/app/cart/cart.page';
import { SpecialsProductsService } from "../../specials-products.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input()titleTest: string;
  @ViewChild('productbtn', {read: ElementRef })productbtn: ElementRef
  orderBody: any;
  specialsId;
  menuToggled = false;
  items = 3;
  cart = {
    items: []
  }
  dropdown =false;
  specialsItems = [
  ];
  isModalOpen = false;

  constructor(public orderService: OrderService, private cartController: ModalController, private specialsService: SpecialsProductsService) {
    this.cart = {
      items: []
    }
    this.specialsService.getSpecials().then(specials => {
      specials.forEach(special => {
        this.specialsItems.unshift({
          title: special.name,
          icon: 'star',
          url: `/specials/${special.id}`,
          id: special.id,
          special
        })
      })
    });
  }

  hideDropdown(event) {
    const xTouch = (event.clientX).toFixed(2);
    const yTouch = (event.clientY).toFixed(2);
    const rect = this.productbtn.nativeElement.getBoundingClientRect();
    const topBoundary = (rect.top+2).toFixed(2);
    const leftBoundary = (rect.left+2).toFixed(2);
    const rightBoundary = (rect.right).toFixed(2);
    if(xTouch < leftBoundary || xTouch > rightBoundary || yTouch < topBoundary) {
      this.dropdown = false;
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  getItems() {
    if(!this.cart || !this.cart.items) { return []; }
    return this.cart.items;
  }

  ngOnInit() {
    this.cart = {
      items: []
    };
    this.cart.items = [];
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
    if(!this.cart) {
      return 0;
    }
    return this.cart.items.reduce((prev , x) => prev + x.quantity, 0);
  }
  ngOnChanges(changes: SimpleChanges) {
  }
}
