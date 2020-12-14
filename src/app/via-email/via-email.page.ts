import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
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
    private socialAuth: SocialAuthService
  ) { }

  ngOnInit() {
  }

  data = {
    email: ''
  }

  next() {
    if ((this.data.email) == '') {
      this.presentToast('Please Enter Email Address')
      this.loadingController.dismiss(true)
    } else {
      this.presentLoadingWithOptions()
      this.passangerService.forgotPassword(this.data).subscribe((resp: any) => {
        console.log(resp)
        if (resp.passenger) {
          console.log(resp.passenger, resp.verificationCode)
          this.r.navigate(['/otp-verification/' + this.data.email + '/' + resp.verificationCode])
          this.loadingController.dismiss(true)
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
      message: 'Loading Please Wait...',
      translucent: true,
      cssClass: 'loading-class',
    });
    await loading.present();

  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Not Found!',
      message: 'You have no Register in Fijo Taxi yet!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Register Now',
          cssClass: 'primary',
          handler: () => {
            this.r.navigate(['/signup'])
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}

