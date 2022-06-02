import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayNowPageRoutingModule } from './pay-now-routing.module';

import { PayNowPage } from './pay-now.page';
import {DebounceClickDirective} from "../helpers/debounce-click.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayNowPageRoutingModule
  ],
  declarations: [PayNowPage, DebounceClickDirective]
})
export class PayNowPageModule {}
