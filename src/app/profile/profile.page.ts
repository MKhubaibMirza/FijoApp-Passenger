import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private menuControl: MenuController,
  ) { }

  ngOnInit() {
  }
  url = environment.baseUrl;
  ionViewWillEnter() {
  }
  getName() {
    return JSON.parse(localStorage.getItem('user')).firstName + '' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getMyImg() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).profilePhoto;
  }
}
