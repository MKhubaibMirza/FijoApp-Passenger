import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeNotePageRoutingModule } from './welcome-note-routing.module';

import { WelcomeNotePage } from './welcome-note.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WelcomeNotePageRoutingModule
  ],
  declarations: [WelcomeNotePage]
})
export class WelcomeNotePageModule {}
