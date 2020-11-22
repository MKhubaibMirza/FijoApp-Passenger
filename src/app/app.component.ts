import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController, MenuController, ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { LocationService } from './services/location.service';
import { WelcomeUserPage } from './welcome-user/welcome-user.page';
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
    public modalController: ModalController,
    private menuController: MenuController,

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.locService.checkGPSPermission();
      this.presentUser();
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
    });
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
  async presentUser() {
    const modal = await this.modalController.create({
      component: WelcomeUserPage,
      cssClass: 'welcomeUser'
    });
    return await modal.present();
  }

  navlist = [
    { title: 'My Journeys', icon: 'car', route: '/my-journeys' },
    { title: 'Payment Methods', icon: 'cash', route: '/payment-methods' },
    { title: 'My Account', icon: 'person', route: '/profile' },
    { title: 'Invite Friends', icon: 'person-add', route: '/invite-friends' },
    { title: 'Discount Codes', icon: 'remove-circle', route: '/discount-codes' },
    { title: 'Help', icon: 'help-circle', route: '/help' },
    // { title: 'Logout', icon: 'exit' },
  ]

  route(r) {
    console.log(r)
    this.r.navigate([r])
    this.menuController.close()
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).pessenger.firstName + ' ' + JSON.parse(localStorage.getItem('user')).pessenger.lastName;
  }
  getEmail() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).pessenger.email;
  }
  logOut() {
    localStorage.clear();
    this.r.navigate(['/']);
  }
}
