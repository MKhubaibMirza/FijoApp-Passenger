import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPreferencesPageRoutingModule } from './my-preferences-routing.module';

import { MyPreferencesPage } from './my-preferences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPreferencesPageRoutingModule
  ],
  declarations: [MyPreferencesPage]
})
export class MyPreferencesPageModule {}
