import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  constructor(
    private menuControl: MenuController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuControl.enable(false)
  }
}
