import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(
    private menuControl: MenuController,
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
}
