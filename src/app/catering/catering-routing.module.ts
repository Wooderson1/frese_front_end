import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CateringPage } from './catering.page';

const routes: Routes = [
  {
    path: '',
    component: CateringPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CateringPageRoutingModule {}
