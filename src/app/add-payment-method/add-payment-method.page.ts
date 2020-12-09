import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SureToCancelPaymentMethodPage } from '../sure-to-cancel-payment-method/sure-to-cancel-payment-method.page';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.page.html',
  styleUrls: ['./add-payment-method.page.scss'],
})
export class AddPaymentMethodPage implements OnInit {

  constructor(public modal: ModalController) { }

  ngOnInit() {
  }
  card = {
    number: '',
    date: '',
    cvv: ''
  }
  save() {
    console.log(this.card);
  }
  async backBtn() {
    const modal = await this.modal.create({
      component: SureToCancelPaymentMethodPage,
      cssClass: 'sureToCancelPaymentMethod'
    });
    return await modal.present();
  }
}
