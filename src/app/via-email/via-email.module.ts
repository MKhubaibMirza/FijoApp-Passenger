import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViaEmailPageRoutingModule } from './via-email-routing.module';

import { ViaEmailPage } from './via-email.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViaEmailPageRoutingModule
  ],
  declarations: [ViaEmailPage]
})
export class ViaEmailPageModule {}
