import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSourcesPageRoutingModule } from './select-sources-routing.module';

import { SelectSourcesPage } from './select-sources.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSourcesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SelectSourcesPage]
})
export class SelectSourcesPageModule {}
