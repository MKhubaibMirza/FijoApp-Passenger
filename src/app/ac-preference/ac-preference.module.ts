import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcPreferencePageRoutingModule } from './ac-preference-routing.module';

import { AcPreferencePage } from './ac-preference.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AcPreferencePageRoutingModule
  ],
  declarations: [AcPreferencePage]
})
export class AcPreferencePageModule {}
