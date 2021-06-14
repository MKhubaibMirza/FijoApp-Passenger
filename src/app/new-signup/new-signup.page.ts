import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-new-signup',
  templateUrl: './new-signup.page.html',
  styleUrls: ['./new-signup.page.scss'],
})
export class NewSignupPage implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Pakistan, CountryISO.Spain];
  phoneForm: FormGroup;
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
    this.phoneForm = new FormGroup({
      phone: new FormControl(undefined, [Validators.required])
    });
    this.phoneForm.valueChanges.subscribe(x => {
      if (this.phoneForm.valid) {
        let pNumber = x.phone.e164Number;
        pNumber = pNumber.substr(1, pNumber.length);
        console.log(pNumber);
        this.signupData.phoneNumber = pNumber;
        this.validPhone = true;
      } else {
        this.validPhone = false;
      }
    })
  }
  validPhone = false;

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
        this.presentLoading()
        let numberData = {
          phoneNumber: this.signupData.phoneNumber
        }
        if (this.validPhone) {
          this.passengerService.checkByPhone(numberData).subscribe((checkNumber: any) => {
            if (!checkNumber.isPassengerExist) {
              let email = {
                email: this.signupData.email
              }
              this.passengerService.checkByEmail(email).subscribe((checkEmail: any) => {
                if (!checkEmail.isPassengerExist) {
                  this.passengerService.sigup(this.signupData).subscribe((resp: any) => {
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
        } else {
          this.presentToast("Invalid Phone Number")
        }
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
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp: any) => {
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
      mode: 'ios',
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
