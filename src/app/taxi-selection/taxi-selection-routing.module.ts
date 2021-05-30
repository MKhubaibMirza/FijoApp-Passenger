import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxiSelectionPage } from './taxi-selection.page';

const routes: Routes = [
  {
    path: '',
    component: TaxiSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxiSelectionPageRoutingModule {}
