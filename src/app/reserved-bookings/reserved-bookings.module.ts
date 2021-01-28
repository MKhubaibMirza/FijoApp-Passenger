import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservedBookingsPageRoutingModule } from './reserved-bookings-routing.module';

import { ReservedBookingsPage } from './reserved-bookings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservedBookingsPageRoutingModule
  ],
  declarations: [ReservedBookingsPage]
})
export class ReservedBookingsPageModule {}
