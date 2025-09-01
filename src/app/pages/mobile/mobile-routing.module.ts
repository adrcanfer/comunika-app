import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { suscribedSourcesGuard } from "src/app/guards/suscribed-sources.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'select-sources',
    loadChildren: () => import('./select-sources/select-sources.module').then(m => m.SelectSourcesPageModule)
  },
  {
    path: 'sources/:action',
    canActivate: [suscribedSourcesGuard],
    loadChildren: () => import('./sources/sources.module').then( m => m.SourcesPageModule)
  },
  {
    path: 'events/:sourceId',
    loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'event/:eventId',
    loadChildren: () => import('./event/event.module').then( m => m.EventPageModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileRoutingModule { }
