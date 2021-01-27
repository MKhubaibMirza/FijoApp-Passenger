import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PassengerService } from '../services/passenger.service';
import { SocialAuthService } from '../services/social-auth.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  socket = io(environment.baseUrl);
  constructor(
    private passengerService: PassengerService,
    private toastController: ToastController,
    private menucontroller: MenuController,
    private router: Router,
    private loading: LoadingController,
    private socialService: SocialAuthService,
    private alertControler: AlertController,
    private t: TranslateService,
  ) {
    t.get("loginPage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
  }

  ngOnInit() {
  }

  respFromLanguage: any;

  loginData = {
    email: '',
    password: ''
  }
  isRememberMe = false;

  loginClick() {
    if ((this.loginData.email && this.loginData.password) !== '') {
      this.presentLoading()
      this.passengerService.login(this.loginData).subscribe((resp: any) => {
        this.loading.dismiss(true);
        let data = {
          oldDeviceId: resp.oldDeviceId
        }
        this.socket.emit('loging-hopping', data);
        localStorage.setItem('logedInDeviceId', resp.newDeviceId);
        localStorage.setItem('user', JSON.stringify(resp.pessenger));
        if (this.isRememberMe) {
          localStorage.setItem('remember', 'true');
        }
        this.router.navigate(['/home']);
      }, err => {
        this.loading.dismiss(true)
        if (err.error) {
          this.presentToast(this.respFromLanguage.wrong)
        }
      })
    } else {
      this.presentToast(this.respFromLanguage.fillAllFields)
    }
  }

  ionViewWillLeave() {
    this.loginData = {
      email: '',
      password: ''
    }
  }

  googleLogin() {
    this.socialService.gplog()
  }

  async AlreadyLoggedIn() {
    const alert = await this.alertControler.create({
      header: this.respFromLanguage.opps,
      message: this.respFromLanguage.alreadyLogin,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loading.create({
      message: this.respFromLanguage.pleaseWait,
      duration: 2000,
      spinner: 'dots',
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  // toast 
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }
}
