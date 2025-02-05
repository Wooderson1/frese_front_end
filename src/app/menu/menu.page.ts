import {Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {MenuController, Platform} from "@ionic/angular";
import {OrderService} from "../services/order.service";
import {SpecialsProductsService} from "../specials-products.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  titleTest = '';
  menuItems = [
    {
      title: 'Order Now',
      icon: 'home',
      url: '/frese-bakery',
    },
    {
      title: 'Menu',
      icon: 'pizza',
      url: '/food-menu',
    }
  ]
  specialItems = []
  constructor(private menuController: MenuController, private plt: Platform, public orderService: OrderService, public specialsService: SpecialsProductsService) {
    this.specialsService.getSpecials().then(specials => {
      specials.forEach(special => {
        this.menuItems.push({
          title: special.name,
          icon: 'star',
          url: `/specials/${special.id}`,
        })
        this.specialItems.push({
          special,
          title: special.name,
          icon: 'star',
          url: `/specials/${special.id}`,
        })
      })
        console.log(this.specialItems)
    });
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  updateTitle(title: string) {
    console.log("HERE ", title);
    this.titleTest = this.menuItems.filter(item => item.url == title)[0].title;
  }
  ngOnInit() {
    const width = this.plt.width();
    this.toggleMenu(width);
  }
  toggleMenu(width) {
    if (width > 768) {
      this.menuController.enable(false, 'myMenu');
    } else {
      this.menuController.enable(true, 'myMenu');
    }
  }
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
      const newWidth = event.target.innerWidth;
      this.toggleMenu(newWidth);
  }

}
