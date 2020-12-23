import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountCodesPageRoutingModule } from './discount-codes-routing.module';

import { DiscountCodesPage } from './discount-codes.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DiscountCodesPageRoutingModule
  ],
  declarations: [DiscountCodesPage]
})
export class DiscountCodesPageModule {}
