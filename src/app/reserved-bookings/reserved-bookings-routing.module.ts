import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservedBookingsPage } from './reserved-bookings.page';

const routes: Routes = [
  {
    path: '',
    component: ReservedBookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservedBookingsPageRoutingModule {}
