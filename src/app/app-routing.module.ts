import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
