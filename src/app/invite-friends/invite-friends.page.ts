import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.page.html',
  styleUrls: ['./invite-friends.page.scss'],
})
export class InviteFriendsPage implements OnInit {

  
  constructor(
    private menuControl: MenuController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuControl.enable(false)
  }

}
