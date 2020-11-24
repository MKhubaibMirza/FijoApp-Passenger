import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallPreferencePageRoutingModule } from './call-preference-routing.module';

import { CallPreferencePage } from './call-preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallPreferencePageRoutingModule
  ],
  declarations: [CallPreferencePage]
})
export class CallPreferencePageModule {}
