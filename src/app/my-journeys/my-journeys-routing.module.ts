import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyJourneysPage } from './my-journeys.page';

const routes: Routes = [
  {
    path: '',
    component: MyJourneysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJourneysPageRoutingModule {}
