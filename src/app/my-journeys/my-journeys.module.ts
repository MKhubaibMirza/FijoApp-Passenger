import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyJourneysPageRoutingModule } from './my-journeys-routing.module';

import { MyJourneysPage } from './my-journeys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyJourneysPageRoutingModule
  ],
  declarations: [MyJourneysPage]
})
export class MyJourneysPageModule {}
