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
import { TranslateService } from '@ngx-translate/core';
import { SplashPage } from './splash/splash.page';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { DataService } from './services/data.service';
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
    private insomnia: Insomnia,
    private socialSharing: SocialSharing,
    public modalController: ModalController,
    private menuController: MenuController,
    public passengerService: PassengerService,
    public translateConfigService: TranslateConfigService,
    public socialService: SocialAuthService,
    public dataservice: DataService,
    public t: TranslateService,
    public nav: NavController
  ) {
    this.presentSplashScreen();
    this.closeApp();
    this.initializeApp();
  }
  url = environment.baseUrl;
  async presentSplashScreen() {
    const modal = await this.modalController.create({
      component: SplashPage,
    });
    return await modal.present();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      if (this.translateConfigService.selectedLanguage() == undefined) {
        this.translateConfigService.setLanguage('sp');
      }
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
      this.insomnia.keepAwake()
    });
    this.platform.resume.subscribe(() => {
      if (localStorage.getItem('user')) {
        if (!localStorage.getItem('tracking')) {
          if (!localStorage.getItem('remember')) {
            let id = JSON.parse(localStorage.getItem('user')).id;
            this.passengerService.logoutPassenger(id).subscribe((resp: any) => {
              if (this.getCurrentLanguage() == 'en') {
                this.showAlert('Session Expired', 'Please log in to continue.');
              } else {
                this.showAlert('Sesión Expirada', 'Por favor inicie sesión para continuar.');
              }
              localStorage.clear()
              this.r.navigate(['/login'])
            });
          }
        }
        this.dataservice.idDeviceIdMatched().subscribe((resp: any) => {
          if (resp.message == 'Device Id is not matched') {
            if (this.translateConfigService.selectedLanguage() == 'en') {
              this.showAlert('Session Expire', 'Your account is logged in from a different device.');
            } else {
              this.showAlert('Sesión Expirada', 'Su cuenta está conectada desde un dispositivo diferente.');
            }
            localStorage.clear();
            this.r.navigate(['/login']);
          }
        })
        if (!localStorage.getItem('tracking')) {
          this.dataservice.isAnyReserveBookingStarted().subscribe((resp: any) => {
            if (resp) {
              let data = {
                findDriverObj: resp,
                tracking: {
                  driverObj: resp.driver,
                  vehicleObj: resp.driver.vehicles[0]
                },
              }
              localStorage.setItem('tracking', JSON.stringify(data));
              this.r.navigate(['/tracking']);
            }
          })
        }
      }
    });

    if (localStorage.getItem('user')) {
      this.dataservice.idDeviceIdMatched().subscribe((resp: any) => {
        if (resp.message == 'Device Id is not matched') {
          if (this.translateConfigService.selectedLanguage() == 'en') {
            this.showAlert('Session Expire', 'Your account is logged in from a different device.');
          } else {
            this.showAlert('Sesión Expirada', 'Su cuenta está conectada desde un dispositivo diferente.');
          }
          localStorage.clear();
          this.r.navigate(['/login']);
        }
      })
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
      if (!localStorage.getItem('tracking')) {
        this.dataservice.isAnyReserveBookingStarted().subscribe((resp: any) => {
          if (resp) {
            let data = {
              findDriverObj: resp,
              tracking: {
                driverObj: resp.driver,
                passengerId: JSON.parse(localStorage.getItem('user')).id,
                vehicleObj: resp.driver.vehicles[0]
              },
            }
            console.log(data);
            localStorage.setItem('findDriverObj', JSON.stringify(data.findDriverObj));
            localStorage.setItem('tracking', JSON.stringify(data.tracking));
            this.r.navigate(['/tracking']);
          }
        })
      }
    }
  }
  closeApp() {
    this.platform.backButton.subscribeWithPriority(999999, () => {
      this.modalController.getTop().then(resp => {
        if (resp == undefined) {
          if (this.r.url == '/home') {
            navigator['app'].exitApp();
          } else if (this.r.url == '/tracking') {
            // Nothing to do here
          } else if (this.r.url == '/add-payment-method') {
            // Nothing to do here
          } else if (this.r.url == '/') {
            // Nothing to do here
          } else {
            this.nav.back();
          }
        } else {
          this.modalController.dismiss();
        }
      })
    })
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
  getCurrentLanguage() {
    return this.translateConfigService.selectedLanguage();
  }
  navlist = [
    // { title: 'home', icon: 'home', route: '/home', },
    { title: 'myJourney', icon: 'car', route: '/my-journeys', },
    // { title: 'paymentMethods', icon: 'cash', route: '/payment-methods', },
    { title: 'myAccount', icon: 'person', route: '/profile', },
    { title: 'changeLanguage', icon: 'language', route: '/lang', },
    { title: 'inviteFriends', icon: 'person-add', route: '/inviteFakePath', },
    { title: 'Help', icon: 'help-circle', route: '/help', }
  ]

  route(r) {
    this.menuController.close();
    if (r == '/inviteFakePath') {
      this.sendInvitation();
    } else if (r == '/lang') {
      this.changeLanguage();
    } else {
      this.r.navigate([r])
    }
  }
  async changeLanguage() {
    let respFromLanguage;
    let selectedLang = this.translateConfigService.selectedLanguage();
    this.t.get("sideMenu").subscribe((resp: any) => {
      respFromLanguage = resp;
    });
    let isEn = false;
    let isSp = false;
    if (selectedLang == 'en') {
      isEn = true;
    } else {
      isSp = true;
    }
    const alert = await this.alertCtrl.create({
      header: respFromLanguage.changeLanguage,
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
          text: respFromLanguage.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: respFromLanguage.okay,
          handler: (val) => {
            this.translateConfigService.setLanguage(val);
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
    let respFromLanguage;
    this.t.get("sideMenu").subscribe((resp: any) => {
      respFromLanguage = resp;
    });
    let url = 'https://play.google.com/store/apps/details?id=com.fijotaxi.passenger';
    let message = this.getName() + respFromLanguage.invite;
    this.socialSharing.share(message, 'Fijo Taxi', null, url).then(res => {
    }).catch(err => {
    })
  }
}
