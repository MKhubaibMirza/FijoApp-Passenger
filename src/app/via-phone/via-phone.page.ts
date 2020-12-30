import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { PassengerService } from '../services/passenger.service';
import * as firebase from 'firebase';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

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
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public t: TranslateService
  ) {
    t.get("viaPhonePage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });

  }
  respFromLanguage: any;
  private geoCoder;

  async ngOnInit() {
    this.windowRef = await window;
    this.windowRef.recaptchaVerifier = await new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
      }
    });
    await this.windowRef.recaptchaVerifier.render();
  }

  windowRef: any;
  verifCode: any;
  async ionViewWillEnter() {
    this.geolocation.getCurrentPosition().then((resp: any) => {
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result: NativeGeocoderResult[]) => {
          this.d.getContryCodeAndFlag(result[0].countryName).subscribe((resp: any) => {
            console.log(resp[0].flag);
            this.data.phoneNumber = resp[0].callingCodes[0];
            this.countryData.flag = resp[0].flag;
          })
        })
    })

  }

  countryData = { flag: '' };

  data = {
    phoneNumber: ''
  }





  next() {
    if ((this.data.phoneNumber) == '') {
      this.presentToast(this.respFromLanguage.enterPhone)
    } else {
      this.presentLoadingWithOptions()
      this.passangerService.checkByPhone(this.data).subscribe((resp: any) => {
        if (resp.isPassengerExist) {

          // send code 
          let a = ''
          if (this.data.phoneNumber.toString().substr(0, 1) == '+') {
            a = this.data.phoneNumber
          } else {
            a = '+' + this.data.phoneNumber
          }
          const appVerifier = this.windowRef.recaptchaVerifier;
          firebase.auth().signInWithPhoneNumber(a, appVerifier)
            .then(result => {
              this.loadingController.dismiss(true)
              this.windowRef.confirmationResult = result;
              this.r.navigate(['/otp-verification/byPhone/' + this.data.phoneNumber])
            }).catch(err => {
              this.loadingController.dismiss(true)
              this.presentToast(this.respFromLanguage.somethingWrong)
            })
          // send code finish 
        } else {
          this.loadingController.dismiss(true)
          this.presentToast(this.respFromLanguage.noExist)
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

        if (JSON.stringify(this.data.phoneNumber).length < 2) {
          // this.presentToast("Invalid Country Code")
          this.d.show_flag(code_with_2_digits).subscribe((resp: any) => {
            if (resp.length > 0) {
              this.countryData = resp[0]
            }
          }, err => {
            this.countryData = { flag: '' };
            if (JSON.stringify(this.data.phoneNumber).length > 1) {
            }
          })
        } else {
          this.d.show_flag(code_with_3_digits).subscribe((resp: any) => {
            if (resp.length > 0) {
              resp.forEach(element => {
                this.countryData = element;
              });
            }
          })
        }
      }
    } else {
      this.countryData = { flag: '' };
    }
  }


  viaEmail() {
    this.r.navigate(['/via-email'])
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
      translucent: true,
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
}

