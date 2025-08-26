import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceItemComponent } from './source-item/source-item.component';
import { IonicModule } from '@ionic/angular';
import { EventEntryComponent } from './event-entry/event-entry.component';
import { EventFooterComponent } from './event-footer/event-footer.component';
import { SourceEntryComponent } from './source-entry/source-entry.component';
import { ImgMiniatureComponent } from './img-miniature/img-miniature.component';



@NgModule({
  declarations: [SourceItemComponent, EventEntryComponent, EventFooterComponent, SourceEntryComponent, ImgMiniatureComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [SourceItemComponent, EventEntryComponent, EventFooterComponent, SourceEntryComponent, ImgMiniatureComponent]
})
export class ComponentsModule { }
