import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSourcesPage } from './select-sources.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSourcesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSourcesPageRoutingModule {}
