import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public paymentService: PaymentService,
    public t: TranslateService
  ) {
  }
  respFromLanguage: any;
  ngOnInit() {
  }
  PaymentMethodFound = false;
  card = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    brand: '',
    funding: ''
  }
  savedcards = [];
  ionViewWillEnter() {
    this.paymentService.GetPaymentMethodOfPassenger().subscribe((resp: any) => {
      if (resp.length == 0) {
        this.PaymentMethodFound = false;
      } else {
        this.PaymentMethodFound = true;
        this.savedcards = resp;
      }
    })
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
  getMyName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getBeautifyNumber(number) {
    return number.toString().replace(/\d{4}(?=.)/g, '$& ');
  }
  async deleteCard(item) {
    this.t.get("paymentMethodPage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.respFromLanguage.deletePaymentMethod,
      message: this.respFromLanguage.sure,
      buttons: [
        {
          text: this.respFromLanguage.cancel,
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: this.respFromLanguage.delete,
          handler: () => {
            this.paymentService.deletePaymentMethod(item.id).subscribe((resp: any) => {
              this.presentToast(this.respFromLanguage.deletedSuccessfully);
              this.ionViewWillEnter();
            })
          }
        }
      ]
    });

    await alert.present();
  }
}
