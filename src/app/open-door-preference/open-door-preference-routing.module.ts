import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenDoorPreferencePage } from './open-door-preference.page';

const routes: Routes = [
  {
    path: '',
    component: OpenDoorPreferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenDoorPreferencePageRoutingModule {}
