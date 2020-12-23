import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelConfirmationPageRoutingModule } from './cancel-confirmation-routing.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    CancelConfirmationPageRoutingModule
  ],
  declarations: []
})
export class CancelConfirmationPageModule {}
