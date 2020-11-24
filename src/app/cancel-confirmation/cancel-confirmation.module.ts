import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelConfirmationPageRoutingModule } from './cancel-confirmation-routing.module';

import { CancelConfirmationPage } from './cancel-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelConfirmationPageRoutingModule
  ],
  declarations: []
})
export class CancelConfirmationPageModule {}
