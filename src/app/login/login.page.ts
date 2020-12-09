import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private passengerService: PassengerService,
    private toastController: ToastController,
    private menucontroller: MenuController,
    private router: Router,
    private loading: LoadingController,
  ) { }

  ngOnInit() { 
  }

  loginData = {
    email: '',
    password: ''
  }

  loginClick() {
    this.presentLoading()
    console.log(this.loginData)
    if ((this.loginData.email && this.loginData.password) !== '') {
      this.passengerService.login(this.loginData).subscribe((resp: any) => {
        console.log(resp)
        this.loading.dismiss(true)
        localStorage.setItem('user', JSON.stringify(resp))
        this.router.navigate(['/home'])
      }, err => {
        console.log(err.error)
        if (err.error) {
          this.loading.dismiss(true)
          this.presentToast('Email or Password may be wrong')
        }
      })
    } else {
      this.presentToast('Please Fill all the Fields!')
    }
  }


  async presentLoading() {
    const loading = await this.loading.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'dots',
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
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
