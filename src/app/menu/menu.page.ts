import {Component, HostListener, OnInit} from '@angular/core';
import {MenuController, Platform} from "@ionic/angular";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  menuItems = [
    {
      title: 'Order Now',
      icon: 'home',
      url: '/'
    },
    {
      title: 'Special',
      icon: 'list',
      url: '/specials'
    },
    {
      title: 'Menu',
      icon: 'information',
      url: '/menu'
    }
  ]
  title: 'Home';
  constructor(private menuController: MenuController, private plt: Platform) { }

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
