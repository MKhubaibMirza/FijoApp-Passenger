import { Route } from '@angular/compiler/src/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { PassengerService } from '../services/passenger.service';

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
    private loading: LoadingController
  ) { }

  ngOnInit() {
    this.menucontroller.enable(false)
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
    phone: '',

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
    let currentlongitute = 0

    // geolocation geolocation geolocation geolocation 
    this.geolocation.getCurrentPosition().then((resp: any) => {
      console.log(resp.coords.latitude, resp.coords.longitude)
      currentlatitude = resp.coords.latitude
      currentlongitute = resp.coords.longitute
    }).catch((error) => {
      console.log('Error getting location', error);
    })
    // end geolocation end geolocation end geolocation end geolocation 

    // reverse geolocation reverse geolocation reverse geolocation 
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(currentlongitute, currentlongitute)
      .then((result: NativeGeocoderResult[]) => {
        console.log(result[0]);
        this.signupData.city = result[0].locality;
        this.signupData.address = result[0].subLocality + ' ' + result[0].thoroughfare;
        this.signupData.postalCode = result[0].postalCode;
      })
    // end reverse geolocation end reverse geolocation end reverse geolocation 


    // forword geolocation forword geolocation forword geolocation 
    this.nativeGeocoder.forwardGeocode('Berlin', options)
      .then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
      .catch((error: any) => console.log(error));
    // end forword geolocation end forword geolocation end forword geolocation 
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
      this.presentToast('Please Enter Your Full Name')
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
      this.presentToast('Please Enter Your Email')
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
    if (this.signupData.phone == '') {
      this.presentToast('Please Enter Your Phone Number')
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
      this.presentToast('Please Fill Both Fields')
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
        this.presentToast('Password Not Matched!')
      }
    }
  }

  // gender
  toSlide6() {
    if (this.signupData.gender == '') {
      this.presentToast('Please Select Your Gender')
    } else {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = false;
      this.slide4 = false;
      this.slide5 = false;
      this.slide6 = true;
    }
  }
  slidechnge(val){}
  onSignupClick() {
    this.presentLoading()
    console.log(this.signupData)

    this.passengerService.sigup(this.signupData).subscribe((resp: any) => {
      console.log(resp)
      this.loading.dismiss(true)
      this.presentAlert()
      this.r.navigate(['/'])
    }, err => {
      console.log(err.error)
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
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }

  getflag() {
    console.log(this.signupData.phone)
    if (this.signupData.phone !== null) {
      if (true) {

        let code_with_2_digits = JSON.stringify(this.signupData.phone).substr(0, 2);
        let code_with_3_digits = JSON.stringify(this.signupData.phone).substr(0, 3);
        console.log(code_with_2_digits);

        if (JSON.stringify(this.signupData.phone).length < 2) {
          // this.presentToast("Invalid Country Code")
          this.d.show_flag(code_with_2_digits).subscribe((resp: any) => {
            console.log(resp);
            if (resp.length > 0) {
              this.countryData = resp[0]
            }
          }, err => {
            console.log('errrr', err);
            this.countryData = [];
            if (JSON.stringify(this.signupData.phone).length > 1) {
              this.presentToast("Invalid Country Code")
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
              this.presentToast("Invalid Country Code")
              // its mean no country exsists for country code of 2 or 3 letters you can show error here
            }
          })
        }
      }
    } else {
      this.countryData = [];
    }
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Register Successfully',
      message: 'Please Login to continue',
      buttons: ['OK']
    });

    await alert.present();
  }



  async presentLoading() {
    const loading = await this.loading.create({
      message: 'Please wait',
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present(); 
  }
}
