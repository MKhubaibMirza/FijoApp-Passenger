import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountCodesPage } from './discount-codes.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountCodesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountCodesPageRoutingModule {}
