import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPreferencesPageRoutingModule } from './my-preferences-routing.module';

import { MyPreferencesPage } from './my-preferences.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MyPreferencesPageRoutingModule
  ],
  declarations: [MyPreferencesPage]
})
export class MyPreferencesPageModule {}
