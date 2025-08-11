import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceEntryComponent } from './source-entry/source-entry.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SourceEntryComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [SourceEntryComponent]
})
export class ComponentsModule { }
