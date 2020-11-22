import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViaEmailPageRoutingModule } from './via-email-routing.module';

import { ViaEmailPage } from './via-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViaEmailPageRoutingModule
  ],
  declarations: [ViaEmailPage]
})
export class ViaEmailPageModule {}
