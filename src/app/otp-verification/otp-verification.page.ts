import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {

  constructor(
    public r: Router,
    public activerouter: ActivatedRoute,
    public passengerService: PassengerService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public t: TranslateService
  ) {
    t.get("otpPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  ngOnInit() {
  }

  windowRef: any;
  verifCode: any;
  onCodeCompleted(event) {
    this.verifCode = event;
    this.submitVerif()
  }
  text = ''
  by = ''
  code = ''
  numberData = {
    phoneNumber: ''
  }
  emailData = {
    email: ''
  }
  async ionViewWillEnter() {
    this.activerouter.params.subscribe((resp: any) => {
      this.by = resp.by
      if (resp.by == 'byPhone') {
        this.numberData.phoneNumber = resp.data
        this.text = 'your Phone Number'
      } else {
        this.emailData.email = resp.by
        this.code = resp.data
        this.text = resp.by
      }

    })
    this.windowRef = await window;
    this.windowRef.recaptchaVerifier = await new firebase.auth.RecaptchaVerifier('recaptcha-container');
    await this.windowRef.recaptchaVerifier.render()
  }

  submitVerif() {

    if (this.verifCode) {
      this.presentLoadingWithOptions()
      if (this.by == 'byPhone') {
        this.windowRef.confirmationResult.confirm(this.verifCode)
          .then(async result => {
            this.passengerService.checkByPhone(this.numberData).subscribe((resp: any) => {
              if (resp.isPassengerExist) {
                localStorage.setItem('TempUser', JSON.stringify(resp.passenger))
                this.loadingController.dismiss(true)
                this.r.navigate(['/password'])
              } else {
                this.loadingController.dismiss(true)
                this.r.navigate(['/signup'])
              }
            })

          })
          .catch(err => {
            this.loadingController.dismiss(true)
            // alert('ERROR')
            alert(err)

          });
      } else {
        if (this.code == this.verifCode) {
          this.passengerService.checkByEmail(this.emailData).subscribe((resp: any) => {
            if (resp.isPassengerExist) {
              localStorage.setItem('TempUser', JSON.stringify(resp.passenger))
              this.loadingController.dismiss(true)
              this.r.navigate(['/password'])
            } else {
              this.loadingController.dismiss(true)
              this.r.navigate(['/signup'])
            }
          })
        } else {
          this.loadingController.dismiss(true)
          this.presentToast(this.respFromLanguage.noCorrect)
        }

      }
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      mode:'ios',
      color: 'medium'
    });
    toast.present();
  }


  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      duration: 9000,
      message: this.respFromLanguage.loading,
      translucent: true,
      cssClass: 'loading-class',
    });
    await loading.present();
  }

}
