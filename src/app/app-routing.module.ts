import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { platformLayoutGuard } from './guards/platform-layout.guard';
import { suscribedSourcesGuard } from './guards/suscribed-sources.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'web',
    pathMatch: 'full',
  },
  {
    path: 'web',
    canActivate: [platformLayoutGuard],
    loadChildren: () => import('./pages/web/web.module').then( m => m.WebModule)
  },
  
  {
    path: 'mobile',
    canActivate: [platformLayoutGuard, suscribedSourcesGuard],
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
