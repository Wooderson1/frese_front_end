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
    loadChildren: () => import('./pay-now/pay-now.module').then( m => m.PayNowPageModule)
  },
  {
    path: 'date-picker',
    loadChildren: () => import('./date-picker/date-picker.module').then( m => m.DatePickerPageModule)
  },
  {
    path: 'specials/:specialsId',
    loadChildren: () => import('./specials/specials.module').then( m => m.SpecialsPageModule)
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
