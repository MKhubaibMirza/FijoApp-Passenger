import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.page.html',
  styleUrls: ['./my-journeys.page.scss'],
})
export class MyJourneysPage implements OnInit {

  constructor(
    private menuControl: MenuController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuControl.enable(false)
  }
}
