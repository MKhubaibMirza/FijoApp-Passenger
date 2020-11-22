import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavDestPage } from './fav-dest.page';

const routes: Routes = [
  {
    path: '',
    component: FavDestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavDestPageRoutingModule {}
