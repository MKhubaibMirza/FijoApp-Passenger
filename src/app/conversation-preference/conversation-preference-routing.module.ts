import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConversationPreferencePage } from './conversation-preference.page';

const routes: Routes = [
  {
    path: '',
    component: ConversationPreferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationPreferencePageRoutingModule {}
