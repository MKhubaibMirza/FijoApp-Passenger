import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(
    private toastController: ToastController,
    public r: Router,
    private service: DataService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  contact = {
    passengerId: JSON.parse(localStorage.getItem('user')).id,
    driverId: null,
    subject: '',
    message: '',
  }

  submit() {
    if ((this.contact.subject && this.contact.message) == '') {
      this.presentToast('Please fill both the fields')
    } else {
      this.presentLoading()
      this.service.createContactUs(this.contact).subscribe((resp: any) => {
        this.loadingController.dismiss()
        if (resp) {
          this.presentToast('Message Recieved! Thank you for using FIJO');
          this.r.navigate(['/home']);
          this.contact = {
            message: '',
            subject: '',
            passengerId: JSON.parse(localStorage.getItem('user')).id,
            driverId: null,
          }
        }
      })
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'dots'
    });
    await loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'medium',
      position: 'top',
    });
    toast.present();
  }
}