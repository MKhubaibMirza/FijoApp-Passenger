import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
    public r: Router,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (localStorage.getItem('user'))
      this.data.email = JSON.parse(localStorage.getItem('user')).email
  }
  data = {
    email: '',
    password: ''
  }

  next() {
    this.passengerService.login(this.data).subscribe((resp: any) => {
      console.log(resp)
      this.r.navigate(['/home'])
    }, err => {
      this.presentToast('Opps! Incorrect Password!')
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'medium'
    });
    toast.present();
  }
}
