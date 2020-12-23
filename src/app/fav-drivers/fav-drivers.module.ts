import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavDriversPageRoutingModule } from './fav-drivers-routing.module';

import { FavDriversPage } from './fav-drivers.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    FavDriversPageRoutingModule
  ],
  declarations: [FavDriversPage]
})
export class FavDriversPageModule {}
