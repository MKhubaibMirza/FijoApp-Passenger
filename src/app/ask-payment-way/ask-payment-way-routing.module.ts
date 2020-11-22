import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AskPaymentWayPage } from './ask-payment-way.page';

const routes: Routes = [
  {
    path: '',
    component: AskPaymentWayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskPaymentWayPageRoutingModule {}
