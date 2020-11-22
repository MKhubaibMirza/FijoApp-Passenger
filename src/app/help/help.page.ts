import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(
    private menuControl: MenuController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuControl.enable(false)
  }
}
