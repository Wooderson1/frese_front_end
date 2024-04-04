import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectOrderTimePageRoutingModule } from './select-order-time-routing.module';

import { SelectOrderTimePage } from './select-order-time.page';

import {DebounceClickDirective} from '../helpers/debounce-click.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectOrderTimePageRoutingModule
  ],
  declarations: [SelectOrderTimePage]
})
export class SelectOrderTimePageModule {}
