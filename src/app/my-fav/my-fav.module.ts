import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyFavPageRoutingModule } from './my-fav-routing.module';

import { MyFavPage } from './my-fav.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MyFavPageRoutingModule
  ],
  declarations: [MyFavPage]
})
export class MyFavPageModule {}
