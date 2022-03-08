import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'frese-bakery',
    pathMatch: 'full'
  },
  {
    path: 'frese-bakery',
    loadChildren: () => import('./frese-bakery/frese-bakery.module').then( m => m.FreseBakeryPageModule)
  },
  {
    path: 'pay-now',
    loadChildren: () => import('./pages/pay-now/pay-now.module').then( m => m.PayNowPageModule)
  },
];

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
