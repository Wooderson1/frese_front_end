import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage-angular';
import {CartPage} from "./cart/cart.page";
import {DebounceClickDirective} from "./helpers/debounce-click.directive";

@NgModule({
  declarations: [AppComponent, CartPage, DebounceClickDirective],
  entryComponents: [CartPage],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule],
  // providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
