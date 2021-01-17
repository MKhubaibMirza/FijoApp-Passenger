import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSignupPage } from './new-signup.page';

const routes: Routes = [
  {
    path: '',
    component: NewSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSignupPageRoutingModule {}
