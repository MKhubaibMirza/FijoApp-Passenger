import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';

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
        // console.log(resp)
        if (resp.passenger) {
          console.log(resp.passenger, resp.verificationCode)
          this.r.navigate(['/otp-verification/' + this.data.email + '/' + resp.verificationCode])
          this.loadingController.dismiss(true)
        }
        if (resp.message == 'Email does not exit') {
          this.presentAlertConfirm()
        }
      })
      // this.passangerService.checkByEmail(this.data).subscribe((resp: any) => {
      //   console.log(resp)
      //   if (resp.isPassengerExist) {
      //     console.log(resp.passenger)
      //     this.loadingController.dismiss(true)

      //     this.r.navigate(['/otp-verification/byEmail/' + this.data.email])
      //   } else {
      //     this.loadingController.dismiss(true)
      //     this.presentToast("Email Doesn't Exist!")
      //     this.presentAlertConfirm()
      //   }
      // })
    }
  }

  gplog() {
    let data = {
      pessenger: {
        name: 'Dummy Name',
        email: 'DummyEmail@fijo.com',
      }
    }
    localStorage.setItem('user', JSON.stringify(data))
    this.r.navigate(['/home'])
  }
  fblog() {
    let data = {
      pessenger: {
        name: 'Dummy Name',
        email: 'DummyEmail@fijo.com',
      }
    }
    localStorage.setItem('user', JSON.stringify(data))
    this.r.navigate(['/home'])
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
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

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);

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

