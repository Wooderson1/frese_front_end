import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CateringPageRoutingModule } from './catering-routing.module';

import { CateringPage } from './catering.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CateringPageRoutingModule
  ],
  declarations: [CateringPage]
})
export class CateringPageModule {}
