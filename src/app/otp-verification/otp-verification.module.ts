import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpVerificationPageRoutingModule } from './otp-verification-routing.module';

import { OtpVerificationPage } from './otp-verification.page';
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  imports: [
    CommonModule,
    CodeInputModule,
    FormsModule,
    IonicModule,
    OtpVerificationPageRoutingModule
  ],
  declarations: [OtpVerificationPage]
})
export class OtpVerificationPageModule { }
