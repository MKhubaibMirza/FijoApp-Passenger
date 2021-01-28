import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReserveBookingConfirmationPage } from './reserve-booking-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: ReserveBookingConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveBookingConfirmationPageRoutingModule {}
