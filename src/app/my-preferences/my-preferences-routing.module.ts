import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPreferencesPage } from './my-preferences.page';

const routes: Routes = [
  {
    path: '',
    component: MyPreferencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPreferencesPageRoutingModule {}
