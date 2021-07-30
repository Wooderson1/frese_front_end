import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreseBakeryPage } from './frese-bakery.page';

const routes: Routes = [
  {
    path: '',
    component: FreseBakeryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreseBakeryPageRoutingModule {}
