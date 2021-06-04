import { Route } from '@angular/compiler/src/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { PassengerService } from '../services/passenger.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private menucontroller: MenuController,
    private toastController: ToastController,
    private d: DataService,
    private passengerService: PassengerService,
    private r: Router,
    private alertController: AlertController,
    private loading: LoadingController,
    public t: TranslateService

  ) {
    t.get("signUp").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getLocation()

    this.slide1 = true;
    this.slide2 = false;
    this.slide3 = false;
    this.slide4 = false;
    this.slide5 = false;
    this.slide6 = false;
  }

  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    phoneNumber: '',
    profilePhoto: '',
    // from location 
    address: '',
    postalCode: '',
    city: '',
  }

  password = {
    new: '',
    confirm: '',
  }

  slide1 = true;
  slide2 = false;
  slide3 = false;
  slide4 = false;
  slide5 = false;
  slide6 = false;

  countryData: any;


  getLocation() {
    let currentlatitude = 0
    let currentlongitude = 0
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp: any) => {
      currentlatitude = resp.coords.latitude;
      currentlongitude = resp.coords.longitude;
    }).catch((error) => {
    })
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(currentlatitude, currentlongitude)
      .then((result: NativeGeocoderResult[]) => {
        this.signupData.city = result[0].locality;
        this.signupData.address = result[0].subLocality + ' ' + result[0].thoroughfare;
        this.signupData.postalCode = result[0].postalCode;
        this.d.getContryCodeAndFlag(result[0].countryName).subscribe((resp: any) => {
          this.signupData.phoneNumber = resp[0].callingCodes[0];
          this.countryData.flag = resp[0].flag;
        })
      })
  }

  toSlide1() {
    this.slide1 = true;
    this.slide2 = false;
    this.slide3 = false;
    this.slide4 = false;
    this.slide5 = false;
    this.slide6 = false;
  }

  // first name last name
  toSlide2() {
    if ((this.signupData.firstName && this.signupData.lastName) == '') {
      this.presentToast(this.respFromLanguage.namePlz)
    } else {
      this.slide1 = false;
      this.slide2 = true;
      this.slide3 = false;
      this.slide4 = false;
      this.slide5 = false;
      this.slide6 = false;
    }

  }

  // email
  toSlide3() {
    if (this.signupData.email == '') {
      this.presentToast(this.respFromLanguage.emailPlz)
    } else {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = true;
      this.slide4 = false;
      this.slide5 = false;
      this.slide6 = false;
    }
  }

  // phone number 
  toSlide4() {
    if (this.signupData.phoneNumber == '') {
      this.presentToast(this.respFromLanguage.phonePlz)
    } else {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = false;
      this.slide4 = true;
      this.slide5 = false;
      this.slide6 = false;
    }
  }

  // password 
  toSlide5() {
    if ((this.password.new && this.password.confirm) == '') {
      this.presentToast(this.respFromLanguage.bothPlz)
    } else {
      if (this.password.confirm == this.password.new) {
        this.slide1 = false;
        this.slide2 = false;
        this.slide3 = false;
        this.slide4 = false;
        this.slide5 = true;
        this.slide6 = false;

        this.signupData.password = this.password.new
      } else {
        this.presentToast(this.respFromLanguage.noMatch)
      }
    }
  }

  // gender
  toSlide6() {
    if (this.signupData.gender == '') {
      this.presentToast(this.respFromLanguage.genderPlz)
    } else {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = false;
      this.slide4 = false;
      this.slide5 = false;
      this.slide6 = true;
    }
  }
  slidechnge(val) { }
  onSignupClick() {
    this.presentLoading();
    this.passengerService.sigup(this.signupData).subscribe((resp: any) => {
      this.loading.dismiss(true)
      localStorage.setItem("user", JSON.stringify(resp.passenger));
      this.r.navigate(["/home"]);
    }, err => {
      if (err.error) {
        this.loading.dismiss(true)
        this.presentToast(err.error)
      }
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode: 'ios',
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }

  getflag() {
    if (this.signupData.phoneNumber !== null) {
      if (true) {

        let code_with_2_digits = JSON.stringify(this.signupData.phoneNumber).substr(0, 2);
        let code_with_3_digits = JSON.stringify(this.signupData.phoneNumber).substr(0, 3);

        if (JSON.stringify(this.signupData.phoneNumber).length < 2) {
          // this.presentToast("Invalid Country Code")
          this.d.show_flag(code_with_2_digits).subscribe((resp: any) => {
            if (resp.length > 0) {
              this.countryData = resp[0]
            }
          }, err => {
            this.countryData = [];
            if (JSON.stringify(this.signupData.phoneNumber).length > 1) {
              // this.presentToast("Invalid Country Code")
            }
          })
        } else {
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

  async presentLoading() {
    const loading = await this.loading.create({
      message: this.respFromLanguage.loading,
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present();
  }
}
