import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AcPreferencePage } from '../ac-preference/ac-preference.page';
import { CallPreferencePage } from '../call-preference/call-preference.page';
import { ConversationPreferencePage } from '../conversation-preference/conversation-preference.page';
import { OpenDoorPreferencePage } from '../open-door-preference/open-door-preference.page';

@Component({
  selector: 'app-my-preferences',
  templateUrl: './my-preferences.page.html',
  styleUrls: ['./my-preferences.page.scss'],
})
export class MyPreferencesPage implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }


  items = [
    { name: "Call", icon: "call-outline", route: 'call' },
    { name: "Air conditioning", icon: "thermometer", route: 'ac' },
    { name: "Open Door", icon: "car", route: 'open-door' },
    { name: "Conversation", icon: "chatbox-ellipses", route: 'conversation' },
  ]

  click(item) {
    console.log(item)
    if (item == 'call') {
      this.callPreference()
    } else if (item == 'ac') {
      this.acPreference()
    } else if (item == 'open-door') {
      this.openDoorPreference()
    } else if (item == 'conversation') {
      this.conversationPreference()
    } else {
      alert('No Navigation')
    }
  }

  async callPreference() {
    const modal = await this.modalController.create({
      component: CallPreferencePage,
      cssClass: 'call'
    });
    return await modal.present();
  }
  async acPreference() {
    const modal = await this.modalController.create({
      component: AcPreferencePage,
      cssClass: 'ac'
    });
    return await modal.present();
  }
  async openDoorPreference() {
    const modal = await this.modalController.create({
      component: OpenDoorPreferencePage,
      cssClass: 'opendoor'
    });
    return await modal.present();
  }
  async conversationPreference() {
    const modal = await this.modalController.create({
      component: ConversationPreferencePage,
      cssClass: 'conversation'
    });
    return await modal.present();
  }


}
