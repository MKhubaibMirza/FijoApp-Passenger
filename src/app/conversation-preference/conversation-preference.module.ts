import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationPreferencePageRoutingModule } from './conversation-preference-routing.module';

import { ConversationPreferencePage } from './conversation-preference.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ConversationPreferencePageRoutingModule
  ],
  declarations: [ConversationPreferencePage]
})
export class ConversationPreferencePageModule {}
