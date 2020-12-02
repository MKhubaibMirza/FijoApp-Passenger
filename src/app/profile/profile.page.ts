import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

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

  profile = ''
  ionViewWillEnter() {
    this.menuControl.enable(false)
    this.profile = JSON.parse(localStorage.getItem('user')).profilePhoto
  }
}
