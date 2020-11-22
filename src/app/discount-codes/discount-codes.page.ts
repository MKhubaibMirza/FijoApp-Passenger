import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discount-codes',
  templateUrl: './discount-codes.page.html',
  styleUrls: ['./discount-codes.page.scss'],
})
export class DiscountCodesPage implements OnInit {

  constructor(
    private menuControl: MenuController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuControl.enable(false)
  }

}
