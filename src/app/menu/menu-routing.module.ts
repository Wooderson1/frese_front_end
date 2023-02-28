import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {MenuPage} from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'frese-bakery',
        loadChildren: () => import('../frese-bakery/frese-bakery.module').then(m => m.FreseBakeryPageModule)
      },
      {
        path: 'pay-now',
        loadChildren: () => import('../pay-now/pay-now.module').then(m => m.PayNowPageModule)
      },
      {
        path: 'date-picker',
        loadChildren: () => import('../date-picker/date-picker.module').then(m => m.DatePickerPageModule)
      },
      {
        path: 'specials',
        loadChildren: () => import('../specials/specials.module').then(m => m.SpecialsPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'food-menu',
        loadChildren: () => import('../pages/food-menu/food-menu.module').then(m => m.FoodMenuPageModule)
      },
      {
        path: 'specials',
        redirectTo: 'specials/'
      },
      {
        path: 'unsubscribe/:email',
        loadChildren: () => import('../unsubscribe/unsubscribe.module').then(m => m.UnsubscribePageModule)
      },
      {
        path: 'specials/:specialsId',
        loadChildren: () => import('../specials/specials.module').then( m => m.SpecialsPageModule)
      },
      {
        path: '**',
        redirectTo: 'specials'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {
}
