import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { PassengerService } from '../services/passenger.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-via-phone',
  templateUrl: './via-phone.page.html',
  styleUrls: ['./via-phone.page.scss'],
})
export class ViaPhonePage implements OnInit {

  constructor(
    private d: DataService,
    public r: Router,
    private toastController: ToastController,
    private passangerService: PassengerService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  windowRef: any;
  verifCode: any;
  async ionViewWillEnter() {
    this.windowRef = await window;
    this.windowRef.recaptchaVerifier = await new firebase.auth.RecaptchaVerifier('recaptcha-container');
    await this.windowRef.recaptchaVerifier.render()
  }

  countryData: any;

  data = {
    phoneNumber: ''
  }





  next() {
    if ((this.data.phoneNumber) == '') {
      this.presentToast('Please Enter Phone Number')
    } else {
      this.presentLoadingWithOptions()
      this.passangerService.checkByPhone(this.data).subscribe((resp: any) => {
        console.log(resp)
        if (resp.isPassengerExist) {

          // send code 
          let a = ''
          if (this.data.phoneNumber.toString().substr(0, 1) == '+') {
            a = this.data.phoneNumber
          } else {
            a = '+' + this.data.phoneNumber
          }
          console.log(a)
          const appVerifier = this.windowRef.recaptchaVerifier;
          firebase.auth().signInWithPhoneNumber(a, appVerifier)
            .then(result => {
              this.loadingController.dismiss(true)
              this.windowRef.confirmationResult = result;
              this.r.navigate(['/otp-verification/byPhone/' + this.data.phoneNumber])
            }).catch(err => {
              this.loadingController.dismiss(true)
              console.log('err1', err)
              this.presentToast('Something Wents Wrong! Try Again Later')
            })
          // send code finish 
        } else {
          this.loadingController.dismiss(true)
          this.presentToast("Phone Number Doesn't Exist!")
          this.presentAlertConfirm()
        }
      })
    }
  }

  getflag() {
    if (this.data.phoneNumber !== null) {
      if (4! > JSON.stringify(this.data.phoneNumber).length) {
        let code_with_2_digits = JSON.stringify(this.data.phoneNumber).substr(0, 2);
        let code_with_3_digits = JSON.stringify(this.data.phoneNumber).substr(0, 3);
        console.log(code_with_2_digits);

        if (JSON.stringify(this.data.phoneNumber).length < 2) {
          // this.presentToast("Invalid Country Code")
          this.d.show_flag(code_with_2_digits).subscribe((resp: any) => {
            console.log(resp);
            if (resp.length > 0) {
              this.countryData = resp[0]
            }
          }, err => {
            console.log('errrr', err);
            this.countryData = [];
            if (JSON.stringify(this.data.phoneNumber).length > 1) {
              // this.presentToast("Invalid Country Code")
            }
          })
        } else {
          console.log(code_with_3_digits, '=================')
          this.d.show_flag(code_with_3_digits).subscribe((resp: any) => {
            if (resp.length > 0) {
              resp.forEach(element => {
                this.countryData = element;
              });
            } else {
              // this.presentToast("Invalid Country Code")
              // its mean no country exsists for country code of 2 or 3 letters you can show error here
            }
          })
        }
      }
    } else {
      this.countryData = [];
    }
  }


  viaEmail() {
    this.r.navigate(['/via-email'])
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

