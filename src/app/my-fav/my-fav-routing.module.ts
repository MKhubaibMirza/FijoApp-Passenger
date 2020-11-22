import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyFavPage } from './my-fav.page';

const routes: Routes = [
  {
    path: '',
    component: MyFavPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyFavPageRoutingModule {}
