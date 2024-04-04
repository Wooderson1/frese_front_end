import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectOrderTimePage } from './select-order-time.page';

const routes: Routes = [
  {
    path: '',
    component: SelectOrderTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectOrderTimePageRoutingModule {}
