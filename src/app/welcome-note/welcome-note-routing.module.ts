import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeNotePage } from './welcome-note.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeNotePageRoutingModule {}
