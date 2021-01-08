import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmBookingPageRoutingModule } from './confirm-booking-routing.module';

import { ConfirmBookingPage } from './confirm-booking.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ConfirmBookingPageRoutingModule
  ],
  declarations: [ConfirmBookingPage]
})
export class ConfirmBookingPageModule {}
