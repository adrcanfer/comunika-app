import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetrievePasswordPageRoutingModule } from './retrieve-password-routing.module';

import { RetrievePasswordPage } from './retrieve-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetrievePasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RetrievePasswordPage]
})
export class RetrievePasswordPageModule {}
