import {Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {MenuController, Platform} from "@ionic/angular";
import {OrderService} from "../services/order.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  titleTest = '';
  menuItems = [
    // {
    //   title: 'Order Now',
    //   icon: 'home',
    //   url: '/'
    // },
    // {
    //   title: 'Home',
    //   icon: 'home',
    //   url: '/home'
    // },
    {
      title: 'Special',
      icon: 'star',
      url: '/specials',
    },
    {
      title: 'Menu',
      icon: 'pizza',
      url: '/food-menu',
    }
  ]
  constructor(private menuController: MenuController, private plt: Platform) { }
  ngOnChanges(changes: SimpleChanges) {
    console.log("C ", changes);
  }
  updateTitle(title: string) {
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
