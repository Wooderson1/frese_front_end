import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FreseBakeryPageRoutingModule } from './frese-bakery-routing.module';
import { FreseBakeryPage } from './frese-bakery.page';
import { PopoverComponent } from '../popover/popover.component';
import { CheckOutComponent } from '../check-out/check-out.component';
import {DebounceClickDirective} from "../helpers/debounce-click.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FreseBakeryPageRoutingModule
  ],
  entryComponents: [PopoverComponent, CheckOutComponent],
  declarations: [FreseBakeryPage, PopoverComponent, CheckOutComponent]
})
export class FreseBakeryPageModule {}
