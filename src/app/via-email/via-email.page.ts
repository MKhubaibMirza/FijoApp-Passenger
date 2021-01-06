import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PassengerService } from '../services/passenger.service';
import { SocialAuthService } from '../services/social-auth.service';

@Component({
  selector: 'app-via-email',
  templateUrl: './via-email.page.html',
  styleUrls: ['./via-email.page.scss'],
})
export class ViaEmailPage implements OnInit {

  constructor(
    public r: Router,
    private toastController: ToastController,
    private passangerService: PassengerService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public t: TranslateService,
    private socialAuth: SocialAuthService
  ) {
    t.get("viaEmail").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  ngOnInit() {
  }

  data = {
    email: ''
  }

  next() {
    if ((this.data.email) == '') {
      this.presentToast(this.respFromLanguage.enterEmailAddress)
      this.loadingController.dismiss(true)
    } else {
      this.presentLoadingWithOptions()
      this.passangerService.forgotPassword(this.data).subscribe((resp: any) => {
        this.loadingController.dismiss();
        if (resp.passenger) {
          this.r.navigate(['/otp-verification/' + this.data.email + '/' + resp.verificationCode])
        }
        if (resp.message == 'Email does not exit') {
          this.presentAlertConfirm()
        }
      })
    }
  }

  gplog() {
    this.socialAuth.gplog();
  }
  fblog() {
    this.socialAuth.fblog();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'medium'
    });
    toast.present();
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      duration: 5000,
      message: this.respFromLanguage.loading,
      cssClass: 'loading-class',
    });
    await loading.present();

  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: this.respFromLanguage.noFound,
      message: this.respFromLanguage.noReg,
      buttons: [
        {
          text: this.respFromLanguage.cancel,
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: this.respFromLanguage.regNow,
          cssClass: 'primary',
          handler: () => {
            this.r.navigate(['/signup'])
          }
        }
      ]
    });

    await alert.present();
  }
  hideEmailLine = false;
  conditionForRemoveingEmailDiv(value) {
    if (value == 'focus') {
      this.hideEmailLine = true;
    } else {
      this.hideEmailLine = false;
    }
  }
}

