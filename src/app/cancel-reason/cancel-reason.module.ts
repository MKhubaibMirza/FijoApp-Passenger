import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelReasonPageRoutingModule } from './cancel-reason-routing.module';

import { CancelReasonPage } from './cancel-reason.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    CancelReasonPageRoutingModule
  ],
  declarations: [CancelReasonPage]
})
export class CancelReasonPageModule {}
