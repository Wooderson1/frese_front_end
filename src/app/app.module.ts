import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import {CartPage} from './cart/cart.page';
import {DebounceClickDirective} from './helpers/debounce-click.directive';
import {SpecialsProductsService} from './specials-products.service';
import {OrderService} from './services/order.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {InterceptorService} from './services/interceptor.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, CartPage, DebounceClickDirective],
  entryComponents: [CartPage],
  // providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule, LazyLoadImageModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, SpecialsProductsService, OrderService, {
    multi: true,
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService}],
})
export class AppModule {}
