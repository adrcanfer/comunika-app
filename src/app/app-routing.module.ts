import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { platformLayoutGuard } from './guards/platform-layout.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'web/home',
    pathMatch: 'full',
  },
  {
    path: 'web/home',
    canActivate: [platformLayoutGuard],
    loadChildren: () => import('./pages/web/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'mobile',
    canActivate: [platformLayoutGuard],
    loadChildren: () => import('./pages/mobile/mobile.module').then( m => m.MobileModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
