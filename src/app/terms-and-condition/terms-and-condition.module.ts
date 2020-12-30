import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsAndConditionPageRoutingModule } from './terms-and-condition-routing.module';

import { TermsAndConditionPage } from './terms-and-condition.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    IonicModule,
    TermsAndConditionPageRoutingModule
  ],
  declarations: [TermsAndConditionPage]
})
export class TermsAndConditionPageModule {}
