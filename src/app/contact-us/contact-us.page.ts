import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
    public t: TranslateService,
    private loadingController: LoadingController,
  ) {
    t.get("contactUsPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
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
      this.presentToast(this.respFromLanguage.fillPlz)
    } else {
      this.presentLoading()
      this.service.createContactUs(this.contact).subscribe((resp: any) => {
        this.loadingController.dismiss()
        if (resp) {
          this.presentToast(this.respFromLanguage.received);
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
      message: this.respFromLanguage.loading,
      duration: 2000,
      spinner: 'dots'
    });
    await loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode:'ios',
      color: 'medium',
      position: 'top',
    });
    toast.present();
  }
}