import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenDoorPreferencePageRoutingModule } from './open-door-preference-routing.module';

import { OpenDoorPreferencePage } from './open-door-preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenDoorPreferencePageRoutingModule
  ],
  declarations: [OpenDoorPreferencePage]
})
export class OpenDoorPreferencePageModule {}
