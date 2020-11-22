import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-via-phone',
  templateUrl: './via-phone.page.html',
  styleUrls: ['./via-phone.page.scss'],
})
export class ViaPhonePage implements OnInit {

  constructor(
    private d: DataService,
    public r: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  countryData: any;
  phone = ''

  getflag() {
    console.log(this.phone)
    if (this.phone !== null) {
      if (true) {

        let code_with_2_digits = JSON.stringify(this.phone).substr(0, 2);
        let code_with_3_digits = JSON.stringify(this.phone).substr(0, 3);
        console.log(code_with_2_digits);

        if (JSON.stringify(this.phone).length < 2) {
          // this.presentToast("Invalid Country Code")
          this.d.show_flag(code_with_2_digits).subscribe((resp: any) => {
            console.log(resp);
            if (resp.length > 0) {
              this.countryData = resp[0]
            }
          }, err => {
            console.log('errrr', err);
            this.countryData = [];
            if (JSON.stringify(this.phone).length > 1) {
              // this.presentToast("Invalid Country Code")
            }
          })
        } else {
          console.log(code_with_3_digits, '=================')
          this.d.show_flag(code_with_3_digits).subscribe((resp: any) => {
            if (resp.length > 0) {
              resp.forEach(element => {
                this.countryData = element;
              });
            } else {
              // this.presentToast("Invalid Country Code")
              // its mean no country exsists for country code of 2 or 3 letters you can show error here
            }
          })
        }
      }
    } else {
      this.countryData = [];
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }
  next() { 
    this.r.navigate(['/otp-verification'])
  }
  viaEmail(){
    this.r.navigate(['/via-email'])
  }
}
