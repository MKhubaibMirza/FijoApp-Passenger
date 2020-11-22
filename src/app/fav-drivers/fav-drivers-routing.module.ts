import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavDriversPage } from './fav-drivers.page';

const routes: Routes = [
  {
    path: '',
    component: FavDriversPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavDriversPageRoutingModule {}
