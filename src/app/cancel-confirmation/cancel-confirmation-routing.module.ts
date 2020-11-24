import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelConfirmationPage } from './cancel-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: CancelConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelConfirmationPageRoutingModule {}
