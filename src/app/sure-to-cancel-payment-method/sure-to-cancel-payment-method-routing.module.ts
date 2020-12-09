import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SureToCancelPaymentMethodPage } from './sure-to-cancel-payment-method.page';

const routes: Routes = [
  {
    path: '',
    component: SureToCancelPaymentMethodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SureToCancelPaymentMethodPageRoutingModule {}
