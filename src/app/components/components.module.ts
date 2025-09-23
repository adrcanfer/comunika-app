import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceItemComponent } from './source-item/source-item.component';
import { IonicModule } from '@ionic/angular';
import { EventEntryComponent } from './event-entry/event-entry.component';
import { EventFooterComponent } from './event-footer/event-footer.component';
import { SourceEntryComponent } from './source-entry/source-entry.component';
import { ImgMiniatureComponent } from './img-miniature/img-miniature.component';
import { GalleryComponent } from './gallery/gallery.component';
import { TextDialogComponent } from './text-dialog/text-dialog.component';



@NgModule({
  declarations: [
    SourceItemComponent, 
    EventEntryComponent, 
    EventFooterComponent, 
    SourceEntryComponent, 
    ImgMiniatureComponent, 
    GalleryComponent,
    TextDialogComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [
    SourceItemComponent, 
    EventEntryComponent, 
    EventFooterComponent, 
    SourceEntryComponent, 
    ImgMiniatureComponent, 
    GalleryComponent,
    TextDialogComponent
  ]
})
export class ComponentsModule { }
