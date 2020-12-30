import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
    public loadingController: LoadingController,
    public alertController: AlertController,
    public paymentService: PaymentService,
    public nav: NavController,
    public t: TranslateService
  ) {
    t.get("addPaymentCardPage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.respFromLanguage.loading,
      duration: 9000
    });
    await loading.present();
  }
  async presentAlert(head, message, val) {
    const alert = await this.alertController.create({
      header: head,
      message: message,
      backdropDismiss: false,
      buttons: [{
        text: this.respFromLanguage.ok,
        handler: () => {
          if (val) {
            this.nav.back();
          }
        }
      }]
    });

    await alert.present();
  }
  ngOnInit() {
  }
  card = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    brand: '',
    funding: ''
  }
  date = '';
  save() {
    if (this.date !== '') {
      this.card.expYear = this.date.substr(0, 4);
      this.card.expMonth = this.date.substr(5, 2);
    }
    if ((this.card.number && this.card.expMonth && this.card.expYear && this.card.cvc) !== '') {
      this.presentLoading();
      this.paymentService.checkCard(this.card)
        .then(token => {
          let fname = JSON.parse(localStorage.getItem('user')).firstName;
          let lname = JSON.parse(localStorage.getItem('user')).lastName;
          this.card.brand = token.card.brand;
          this.card.funding = token.card.funding;
          this.paymentService.addPaymentMethodOfPassenger(this.card).subscribe((resp: any) => {
            this.presentAlert(this.respFromLanguage.successfullySaved, this.respFromLanguage.dear + ' ' + fname + ' ' + lname + ' ' + this.respFromLanguage.your + ' ' + token.card.brand + ' ' + token.card.funding + ' ' + token.type + ' ' + this.respFromLanguage.storedsecurely, true)
            this.loadingController.dismiss();
          })
        })
        .catch(error => {
          this.loadingController.dismiss();
          this.presentAlert(this.respFromLanguage.error, error, false)
        });
    } else {
      this.presentToast(this.respFromLanguage.fillPlz);
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
