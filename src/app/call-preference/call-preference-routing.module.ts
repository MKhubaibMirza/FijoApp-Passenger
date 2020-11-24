import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallPreferencePage } from './call-preference.page';

const routes: Routes = [
  {
    path: '',
    component: CallPreferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallPreferencePageRoutingModule {}
