import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationPreferencePageRoutingModule } from './conversation-preference-routing.module';

import { ConversationPreferencePage } from './conversation-preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationPreferencePageRoutingModule
  ],
  declarations: [ConversationPreferencePage]
})
export class ConversationPreferencePageModule {}
