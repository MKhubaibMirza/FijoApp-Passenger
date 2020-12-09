import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SureToCancelPaymentMethodPageRoutingModule } from './sure-to-cancel-payment-method-routing.module';

import { SureToCancelPaymentMethodPage } from './sure-to-cancel-payment-method.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SureToCancelPaymentMethodPageRoutingModule
  ],
  declarations: [SureToCancelPaymentMethodPage]
})
export class SureToCancelPaymentMethodPageModule {}
