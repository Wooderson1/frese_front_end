import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FreseBakeryPageRoutingModule } from './frese-bakery-routing.module';

import { FreseBakeryPage } from './frese-bakery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FreseBakeryPageRoutingModule
  ],
  declarations: [FreseBakeryPage]
})
export class FreseBakeryPageModule {}
