import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountCodesPageRoutingModule } from './discount-codes-routing.module';

import { DiscountCodesPage } from './discount-codes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscountCodesPageRoutingModule
  ],
  declarations: [DiscountCodesPage]
})
export class DiscountCodesPageModule {}
