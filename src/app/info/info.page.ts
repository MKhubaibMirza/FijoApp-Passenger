import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { ChangePasswordPage } from '../change-password/change-password.page';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(
    private menuControl: MenuController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuControl.enable(false)
    if (localStorage.getItem('user'))
      this.data = JSON.parse(localStorage.getItem('user'))
  }

  data = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    profilePhoto: '',
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getFirstName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName
  }
  getLastName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).lastName;
  }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
      cssClass: 'changepassword',
    });
    await modal.present();
  }
}
