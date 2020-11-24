import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcPreferencePageRoutingModule } from './ac-preference-routing.module';

import { AcPreferencePage } from './ac-preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcPreferencePageRoutingModule
  ],
  declarations: [AcPreferencePage]
})
export class AcPreferencePageModule {}
