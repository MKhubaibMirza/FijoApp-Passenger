import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  constructor(
    public passengerService: PassengerService,
    public toastController: ToastController,
    public t: TranslateService,
    public alertControler: AlertController,
    public r: Router,
  ) {
    t.get("passwordPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  ngOnInit() {
  }

  ionViewWillEnter() {
    if (localStorage.getItem('TempUser'))
      this.data.email = JSON.parse(localStorage.getItem('TempUser')).email
  }
  data = {
    email: '',
    password: ''
  }
  async AlreadyLoggedIn() {
    const alert = await this.alertControler.create({
      header: this.respFromLanguage.opps,
      message: this.respFromLanguage.alreadyLogin,
      buttons: ['OK']
    });

    await alert.present();
  }
  next() {
    this.passengerService.login(this.data).subscribe((resp: any) => {
      if (resp.message == 'You are already login from another device. Please logput first to login from this device') {
        this.AlreadyLoggedIn();
      } else {
        localStorage.setItem('user', JSON.stringify(resp.pessenger));
        localStorage.removeItem('TempUser');
        this.r.navigate(['/home'])
      }
    }, err => {
      this.presentToast(this.respFromLanguage.inCorrect)
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      mode:'ios',
      color: 'medium'
    });
    toast.present();
  }
}
