import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "src/app/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'retrieve-password',
    loadChildren: () => import('./retrieve-password/retrieve-password.module').then( m => m.RetrievePasswordPageModule)
  },
  {
    path: 'my-events',
    canActivate: [authGuard],
    loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebRoutingModule { }
