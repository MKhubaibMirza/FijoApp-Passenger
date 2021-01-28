import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReserveBookingConfirmationPageRoutingModule } from './reserve-booking-confirmation-routing.module';

import { ReserveBookingConfirmationPage } from './reserve-booking-confirmation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReserveBookingConfirmationPageRoutingModule
  ],
  declarations: []
})
export class ReserveBookingConfirmationPageModule {}
