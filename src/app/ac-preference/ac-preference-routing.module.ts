import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcPreferencePage } from './ac-preference.page';

const routes: Routes = [
  {
    path: '',
    component: AcPreferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcPreferencePageRoutingModule {}
