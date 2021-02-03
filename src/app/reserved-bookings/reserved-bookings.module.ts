import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservedBookingsPageRoutingModule } from './reserved-bookings-routing.module';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule } from '@agm/core';
import { ReservedBookingsPage } from './reserved-bookings.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule,
    TranslateModule,
    AgmDirectionModule,
    ReservedBookingsPageRoutingModule
  ],
  declarations: [ReservedBookingsPage]
})
export class ReservedBookingsPageModule { }
