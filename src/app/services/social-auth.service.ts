import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PassengerService } from './passenger.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {
  user: any;
  isLoggedIn: boolean = false;
  url = environment.baseUrl;
  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    phoneNumber: '',
    profilePhoto: '',
    address: '',
    postalCode: '',
    city: '',
  }
  constructor(
    private googlePlus: GooglePlus,
    public transfer: FileTransfer,
    public toastController: ToastController,
    public menuController: MenuController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public file: File,
    public r: Router,
    public loadingController: LoadingController,
    private fb: Facebook,
    public passenger: PassengerService,
    public alertController: AlertController
  ) {
    fb.getLoginStatus()
      .then(res => {
        if (res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
    this.getLocation();
  }
  // facebook login
  getUserDetail(userid) {
    this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender,mobile_phone", ["public_profile"])
      .then(res => {
        localStorage.setItem('facebook', JSON.stringify(res));
        return true;
      })
      .catch(e => {
      });
  }
  fblog() {
    this.fb.login(['public_profile', 'email', 'mobile_phone'])
      .then(res => {
        if (res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
          // this.rot.navigate(['/tabs/tabs/tab1']);
          // localStorage.setItem('fbdatamilgia','milgia data');
          // localStorage.setItem('cond','true');
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => { });
    return 0;
  }

  // google login
  gplog() {
    this.googlePlus.login({})
      .then(res => {
        if (res.accessToken) {
          localStorage.setItem('google', JSON.stringify(res));
          this.passenger.checkByEmail({ email: res.email }).subscribe((resp: any) => {
            if (resp.isPassengerExist) {
              // If Found
              localStorage.setItem("user", JSON.stringify(resp.passenger));
              this.r.navigate(["/home"]);
            } else {
              // If Not Found
              this.signupData.firstName = res.givenName;
              this.signupData.lastName = res.familyName;
              this.signupData.email = res.email;
              this.signupData.gender = 'male';
              this.presentLoading();
              this.uploadFile(res.imageUrl);
            }
          })
        }
      })
      .catch(err => console.error(err));
    return 0;
  }
  // Upload Code
  uploadFile(link) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      httpMethod: 'POST'
    };
    fileTransfer.download(link, this.file.dataDirectory + 'mandalMaksal.png').then((entry: any) => {
      fileTransfer.upload(entry.toURL(), this.url + 'imageUpload', options)
        .then((data) => {
          let fileName = data.response.replace('"', '');
          fileName = fileName.replace('"', '');
          this.signupData.profilePhoto = fileName;
          this.loadingController.dismiss();
          this.registerNow();
        }, (err) => {
        });
    })
  }
  getLocation() {
    let currentlatitude;
    let currentlongitude;
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp: any) => {
      currentlatitude = resp.coords.latitude;
      currentlongitude = resp.coords.longitude;
      let opt: NativeGeocoderOptions = {
        useLocale: false,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(currentlatitude, currentlongitude, opt)
        .then((result: NativeGeocoderResult[]) => {
          this.signupData.city = result[0].locality;
          this.signupData.address = result[0].subLocality + ' ' + result[0].thoroughfare;
          this.signupData.postalCode = result[0].postalCode;
        })
    })
  }
  async registerNow() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Setup Your Password',
      backdropDismiss: false,
      inputs: [
        {
          name: 'pass',
          type: 'password',
          placeholder: 'Enter Password'
        },
        {
          name: 'confpass',
          type: 'password',
          placeholder: 'Enter Confirm Password'
        }
      ],
      buttons: [{
        text: 'Ok',
        handler: (resp) => {
          if ((resp.confpass && resp.pass) !== '') {
            if (resp.confpass == resp.pass) {
              this.signupData.password = resp.pass;
              this.presentLoading();
              this.passenger.sigup(this.signupData).subscribe((resp: any) => {
                this.loadingController.dismiss();
                localStorage.setItem("user", JSON.stringify(resp.passenger));
                this.r.navigate(["/home"]);
              })
            } else {
              this.presentToast('Password and Confirm Password does not matched.');
              return false;
            }
          } else {
            this.presentToast('Please fill both fields.');
            return false;
          }
        }
      }]
    });

    await alert.present()
  }
  async presentToast(mes) {
    const toast = await this.toastController.create({
      message: mes,
      mode:'ios',
      color: 'medium',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading-class',
      message: 'Please wait...',
      duration: 9000
    });
    await loading.present();
  }
  logOut() {
    this.menuController.close();
    this.menuController.enable(false);
    if (localStorage.getItem('google')) {
      this.googlePlus.logout();
    } else if (localStorage.getItem('facebook')) {
      this.fb.logout();
    }
    this.passenger.logoutPassenger(JSON.parse(localStorage.getItem('user')).id).subscribe((respo => {
      localStorage.clear();
      this.r.navigate(['/login']);
    }));
  }
}