import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-signup',
  templateUrl: './new-signup.page.html',
  styleUrls: ['./new-signup.page.scss'],
})
export class NewSignupPage implements OnInit {

  constructor(
    private menuControl: MenuController,
    private r: Router,
    private passengerService: PassengerService,
    private toastController: ToastController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private loading: LoadingController,
    public t: TranslateService
  ) {
    t.get("signup").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  ngOnInit() {
  }
  respFromLanguage: any;
  ionViewWillEnter() {
    this.getLocation()
    this.menuControl.enable(false)
  }

  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'male',
    city: '',
    address: '',
    postalCode: '',
    currentLat: 0,
    currentLng: 0,
  }

  password = {
    new: '',
    confirm: '',
  }

  gender(ev) {
    this.signupData.gender = ev.target.value
  }

  signupClick() {
    if (this.password.new == this.password.confirm) {
      this.signupData.password = this.password.new
      if ((this.signupData.firstName && this.signupData.lastName && this.signupData.email && this.signupData.password && this.signupData.phoneNumber && this.signupData.gender) !== '') {
        let a = ''
        if (this.signupData.phoneNumber.toString().substr(0, 1) == '+') {
          a = this.signupData.phoneNumber
        } else {
          a = '+' + this.signupData.phoneNumber
        }
        this.presentLoading()
        let numberData = {
          phoneNumber: this.signupData.phoneNumber
        }
        this.passengerService.checkByPhone(numberData).subscribe((checkNumber: any) => {
          console.log(checkNumber)
          if (!checkNumber.isPassengerExist) {
            let email = {
              email: this.signupData.email
            }
            this.passengerService.checkByEmail(email).subscribe((checkEmail: any) => {
              console.log(checkEmail)
              if (!checkEmail.isPassengerExist) {
                this.passengerService.sigup(this.signupData).subscribe((resp: any) => {
                  console.log(resp)
                  if (resp.message == "Passenger is Created Successfully") {
                    this.presentToast(this.respFromLanguage.registerSuccessfully)
                    this.loading.dismiss();
                    localStorage.setItem('logedInDeviceId', resp.newDeviceId);
                    localStorage.setItem('user', JSON.stringify(resp.passenger))
                    setTimeout(() => {
                      this.r.navigate(['/home'])
                    }, 2000);
                  } else {
                    this.loading.dismiss()
                    this.presentToast(resp.error)
                  }
                })
              } else {
                this.loading.dismiss()
                this.presentToast(this.respFromLanguage.emailExist)
              }
            })
          } else {
            this.loading.dismiss()
            this.presentToast(this.respFromLanguage.phoneNumberExist)
          }
        })
        // localStorage.setItem('signupData', JSON.stringify(this.signupData))
      } else {
        this.presentToast(this.respFromLanguage.fillAllFields)
      }
    } else {
      this.presentToast(this.respFromLanguage.passwordNotMatch)
    }
  }

  getLocation() {
    let currentlatitude;
    let currentlongitude;
    this.geolocation.getCurrentPosition().then((resp: any) => {
      currentlatitude = resp.coords.latitude;
      currentlongitude = resp.coords.longitude;
      this.signupData.currentLat = resp.coords.latitude;
      this.signupData.currentLng = resp.coords.longitude;
      let opt: NativeGeocoderOptions = {
        useLocale: false,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(currentlatitude, currentlongitude, opt)
        .then((result: NativeGeocoderResult[]) => {
          this.signupData.city = result[0].locality;
          this.signupData.address = result[0].subLocality + ' ' + result[0].thoroughfare;
          this.signupData.postalCode = result[0].postalCode;
          this.passengerService.getContryCodeAndFlag(result[0].countryName).subscribe((resp: any) => {
            console.log(resp[0].flag);
            this.signupData.phoneNumber = resp[0].callingCodes[0];
          })
        }).catch((error) => {
        })
    }).catch((error) => {
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'primary'
    });
    toast.present();
  }


  async presentLoading() {
    const loading = await this.loading.create({
      message: this.respFromLanguage.pleaseWait,
      duration: 5000,
      spinner: 'dots',
    });
    await loading.present();
  }
}
