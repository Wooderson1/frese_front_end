import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'frese-bakery',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'food-menu',
    loadChildren: () => import('./pages/food-menu/food-menu.module').then( m => m.FoodMenuPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  // {
  //   path: 'frese-bakery',
  //   loadChildren: () => import('./frese-bakery/frese-bakery.module').then( m => m.FreseBakeryPageModule)
  // },
  // {
  //   path: 'pay-now',
  //   loadChildren: () => import('./pay-now/pay-now.module').then( m => m.PayNowPageModule)
  // },
  // {
  //   path: 'date-picker',
  //   loadChildren: () => import('./date-picker/date-picker.module').then( m => m.DatePickerPageModule)
  // },
  // {
  //   path: 'specials/:specialsId',
  //   loadChildren: () => import('./specials/specials.module').then( m => m.SpecialsPageModule)
  // },
  // {
  //   path: 'specials',
  //   redirectTo: 'specials/'
  // },
  // {
  //   path: 'unsubscribe/:email',
  //   loadChildren: () => import('./unsubscribe/unsubscribe.module').then( m => m.UnsubscribePageModule)
  // },
  // {
  //   path: '**',
  //   redirectTo: 'frese-bakery'
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})

  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }
