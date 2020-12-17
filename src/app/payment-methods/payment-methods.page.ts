import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  constructor(
    public toastController: ToastController,
    public paymentService: PaymentService
  ) { }

  ngOnInit() {
  }
  PaymentMethodFound = false;

  card = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  }
  ionViewWillEnter() {
    // Call Api that check if have payment then PaymentMethodFound == true else PaymentMethodFound == false;
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
