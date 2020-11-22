import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeUserPageRoutingModule } from './welcome-user-routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeUserPageRoutingModule
  ],
  declarations: []
})
export class WelcomeUserPageModule {}
