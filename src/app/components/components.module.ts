import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceEntryComponent } from './source-entry/source-entry.component';
import { IonicModule } from '@ionic/angular';
import { EventEntryComponent } from './event-entry/event-entry.component';
import { EventFooterComponent } from './event-footer/event-footer.component';



@NgModule({
  declarations: [SourceEntryComponent, EventEntryComponent, EventFooterComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [SourceEntryComponent, EventEntryComponent, EventFooterComponent]
})
export class ComponentsModule { }
