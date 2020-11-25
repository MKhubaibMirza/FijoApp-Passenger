import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelReasonPage } from './cancel-reason.page';

const routes: Routes = [
  {
    path: '',
    component: CancelReasonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelReasonPageRoutingModule {}
