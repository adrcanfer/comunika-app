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
  {
    path: 'events/:sourceId',
    loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'event-editor',
    canActivate: [authGuard],
    loadChildren: () => import('./event-editor/event-editor.module').then( m => m.EventEditorPageModule)
  },
  {
    path: 'event-editor/:eventId',
    canActivate: [authGuard],
    loadChildren: () => import('./event-editor/event-editor.module').then( m => m.EventEditorPageModule)
  },
  {
    path: 'event/:eventId',
    loadChildren: () => import('./event/event.module').then( m => m.EventPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebRoutingModule { }
