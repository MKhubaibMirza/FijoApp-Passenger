import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskPaymentWayPageRoutingModule } from './ask-payment-way-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AskPaymentWayPageRoutingModule
  ],
  declarations: []
})
export class AskPaymentWayPageModule {}
