import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';
import { SureToCancelPaymentMethodPage } from '../sure-to-cancel-payment-method/sure-to-cancel-payment-method.page';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.page.html',
  styleUrls: ['./add-payment-method.page.scss'],
})
export class AddPaymentMethodPage implements OnInit {

  constructor(
    public modal: ModalController,
    public toastController: ToastController,
    public paymentService: PaymentService
  ) { }

  ngOnInit() {
  }
  card = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  }
  date = '';
  save() {
    if (this.date !== '') {
      this.card.expMonth = this.date.substr(0, 4);
      this.card.expYear = this.date.substr(5, 2);
    }
    if ((this.card.number && this.card.expMonth && this.card.expYear && this.card.cvc) !== '') {
      let data = this.paymentService.checkCard(this.card);
      console.log(data);
    } else {
      this.presentToast('Please Fill All The Fields.');
    }
  }

  async backBtn() {
    const modal = await this.modal.create({
      component: SureToCancelPaymentMethodPage,
      cssClass: 'sureToCancelPaymentMethod'
    });
    return await modal.present();
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'medium',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
