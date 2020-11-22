import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViaPhonePage } from './via-phone.page';

const routes: Routes = [
  {
    path: '',
    component: ViaPhonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViaPhonePageRoutingModule {}
