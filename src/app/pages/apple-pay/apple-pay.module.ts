import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplePayPageRoutingModule } from './apple-pay-routing.module';

import { ApplePayPage } from './apple-pay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplePayPageRoutingModule
  ],
  declarations: [ApplePayPage]
})
export class ApplePayPageModule {}
