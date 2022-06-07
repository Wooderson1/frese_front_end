import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

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
  {
    path: 'specials',
    redirectTo: 'specials/'
  },
  {
    path: '**',
    redirectTo: 'frese-bakery'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})

  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }
