import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventEditorPageRoutingModule } from './event-editor-routing.module';

import { EventEditorPage } from './event-editor.page';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventEditorPageRoutingModule,
    ReactiveFormsModule,
    EditorComponent,
    ComponentsModule
  ],
  declarations: [EventEditorPage],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class EventEditorPageModule {}
