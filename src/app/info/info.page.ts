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
  getName() {
    if(localStorage.getItem('user'))
    return JSON.parse(localStorage.getItem('user')).pessenger.firstName + ' ' + JSON.parse(localStorage.getItem('user')).pessenger.lastName;
  }
  ionViewWillEnter() {
    // this.menuControl.enable(false)
  }
}
