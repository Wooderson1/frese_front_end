import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplePayPage } from './apple-pay.page';

const routes: Routes = [
  {
    path: '',
    component: ApplePayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplePayPageRoutingModule {}
