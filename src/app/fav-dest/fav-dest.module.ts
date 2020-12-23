import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavDestPageRoutingModule } from './fav-dest-routing.module';

import { FavDestPage } from './fav-dest.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FavDestPageRoutingModule
  ],
  declarations: [FavDestPage]
})
export class FavDestPageModule {}
