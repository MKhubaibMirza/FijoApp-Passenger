import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxiSelectionPageRoutingModule } from './taxi-selection-routing.module';

import { TaxiSelectionPage } from './taxi-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TaxiSelectionPageRoutingModule
  ],
  declarations: [TaxiSelectionPage]
})
export class TaxiSelectionPageModule {}
