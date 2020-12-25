import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { LocationService } from './services/location.service';
import { environment } from 'src/environments/environment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PassengerService } from './services/passenger.service';
import { TranslateConfigService } from './services/translate-config.service';
import { SocialAuthService } from './services/social-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public locService: LocationService,
    private r: Router,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public modalController: ModalController,
    private menuController: MenuController,
    public passengerService: PassengerService,
    public translateService: TranslateConfigService,
    public socialService: SocialAuthService,
    public nav: NavController
  ) {
    this.closeApp();
    this.initializeApp();
  }
  url = environment.baseUrl;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.locService.checkGPSPermission();
      if (this.translateService.selectedLanguage() == undefined) {
        this.translateService.setLanguage('en');
      }
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
    });
    if (localStorage.getItem('user')) {
      this.passengerService.getAvailabilityStatus().subscribe((resp: any) => {
        if (resp.isPassengerAvailable) {
          localStorage.removeItem('findDriverObj');
          localStorage.removeItem('tracking');
          localStorage.removeItem('tripEnded');
          localStorage.removeItem('tripStarted');
          localStorage.removeItem('paymentMethods');
          localStorage.removeItem('paid');
        } else {
          if (localStorage.getItem('tracking')) {
            this.r.navigate(['/tracking']);
          }
        }
      })
      this.menuController.enable(true);
    } else {
      console.log('enable  == false')
      this.menuController.enable(false);
    }
  }
  closeApp() {
    this.platform.backButton.subscribeWithPriority(999999, () => {
      if (this.r.url == '/home') {
        navigator['app'].exitApp();
      } else if (this.r.url == '/tracking') {
        // Nothing to do here
      } else if (this.r.url == '/add-payment-method') {
        // Nothing to do here
      } else {
        this.nav.back();
      }
    })
    console.log('back btn pressed', this.r.url);
  }
  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('ad85c5e9-cbf4-48c8-9ce1-6f4d9eed4b8a', '817702789445');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      this.showAlert(title, msg);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;
      // this.showAlert('Notification opened', 'You already read this before' );
    });

    this.oneSignal.endInit();
  }
  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    })
    alert.present();
  }
  getCurrentLanguage(){
    return this.translateService.selectedLanguage();
  }
  navlist = [
    { title: 'Home', icon: 'home', route: '/home', },
    { title: 'My Journeys', icon: 'car', route: '/my-journeys', },
    { title: 'Payment Methods', icon: 'cash', route: '/payment-methods', },
    { title: 'My Account', icon: 'person', route: '/profile', },
    { title: 'Change Language', icon: 'language', route: '/lang', },
    { title: 'Invite Friends', icon: 'person-add', route: '/inviteFakePath', },
    { title: 'Help', icon: 'help-circle', route: '/help', },
  ]

  route(r) {
    this.menuController.close();
    console.log(r)
    if (r == '/inviteFakePath') {
      this.sendInvitation();
    } else if (r == '/lang') {
      this.changeLanguage();
    } else {
      this.r.navigate([r])
    }
  }
  async changeLanguage() {
    let selectedLang = this.translateService.selectedLanguage();
    let isEn = false;
    let isSp = false;
    if (selectedLang == 'en') {
      isEn = true;
    } else {
      isSp = true;
    }
    const alert = await this.alertCtrl.create({
      header: 'Change Language',
      inputs: [
        {
          name: 'english',
          type: 'radio',
          label: 'English',
          value: 'en',
          checked: isEn
        },
        {
          name: 'spanish',
          type: 'radio',
          label: 'Spanish',
          value: 'sp',
          checked: isSp
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (val) => {
            this.translateService.setLanguage(val);
            console.log(val, 'Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getEmail() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).email;
  }
  getMyImg() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).profilePhoto;
  }
  logOut() {
    this.socialService.logOut();
  }
  sendInvitation() {
    let url = 'https://play.google.com/store/apps/details?id=com.fijotaxi.passenger';
    let message = this.getName() + ' has invited you to join FIJO TAXI App.';
    console.log(url);
    console.log(message);
    this.socialSharing.share(message, 'Fijo Taxi', null, url).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }
}
