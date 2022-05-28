import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplitLayoutPage } from './split-layout.page';

const routes: Routes = [
  {
    path: '',
    component: SplitLayoutPage,
    // children: [ {
    //
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitLayoutPageRoutingModule {}
