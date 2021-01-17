import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSignupPageRoutingModule } from './new-signup-routing.module';

import { NewSignupPage } from './new-signup.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NewSignupPageRoutingModule
  ],
  declarations: [NewSignupPage]
})
export class NewSignupPageModule {}
