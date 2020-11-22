import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeNotePageRoutingModule } from './welcome-note-routing.module';

import { WelcomeNotePage } from './welcome-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeNotePageRoutingModule
  ],
  declarations: [WelcomeNotePage]
})
export class WelcomeNotePageModule {}
