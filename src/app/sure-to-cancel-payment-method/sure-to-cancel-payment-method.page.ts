import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-sure-to-cancel-payment-method',
  templateUrl: './sure-to-cancel-payment-method.page.html',
  styleUrls: ['./sure-to-cancel-payment-method.page.scss'],
})
export class SureToCancelPaymentMethodPage implements OnInit {

  constructor(public modal: ModalController, public nav: NavController) { }

  ngOnInit() {
  }
  leave() {
    this.modal.dismiss();
    this.nav.back();
  }
  cancel() {
    this.modal.dismiss();
  }
}
