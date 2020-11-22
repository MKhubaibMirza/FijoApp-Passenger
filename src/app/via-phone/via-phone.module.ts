import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViaPhonePageRoutingModule } from './via-phone-routing.module';

import { ViaPhonePage } from './via-phone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViaPhonePageRoutingModule
  ],
  declarations: [ViaPhonePage]
})
export class ViaPhonePageModule {}
