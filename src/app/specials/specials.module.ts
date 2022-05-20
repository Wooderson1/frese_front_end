import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialsPageRoutingModule } from './specials-routing.module';

import { SpecialsPage } from './specials.page';
import {DebounceClickDirective} from "../helpers/debounce-click.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialsPageRoutingModule
  ],
  declarations: [SpecialsPage, DebounceClickDirective]
})
export class SpecialsPageModule {}
