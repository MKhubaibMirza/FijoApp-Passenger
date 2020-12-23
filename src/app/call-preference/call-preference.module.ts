import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallPreferencePageRoutingModule } from './call-preference-routing.module';

import { CallPreferencePage } from './call-preference.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    CallPreferencePageRoutingModule
  ],
  declarations: [CallPreferencePage]
})
export class CallPreferencePageModule {}
