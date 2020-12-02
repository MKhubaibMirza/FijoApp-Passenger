import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
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
  ) { }

  ngOnInit() {
  }

  windowRef: any;
  verifCode: any;
  onCodeCompleted(event) {
    console.log(event)
    this.verifCode = event
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
      console.log(resp)
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
              console.log(resp)
              if (resp.isPassengerExist) {
                localStorage.setItem('user', JSON.stringify(resp.passenger))
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
            alert('ERROR')
            alert(err)
          });
      } else {
        console.log(this.code, this.verifCode)
        if (this.code == this.verifCode) {
          this.passengerService.checkByEmail(this.emailData).subscribe((resp: any) => {
            console.log(resp)
            if (resp.isPassengerExist) {
              localStorage.setItem('user', JSON.stringify(resp.passenger))
              this.loadingController.dismiss(true)
              this.r.navigate(['/password'])
            } else {
              this.loadingController.dismiss(true)
              this.r.navigate(['/signup'])
            }
          })
        } else {
          this.loadingController.dismiss(true)
          this.presentToast('The Given code is not Correct!')
        }

      }
    }
    //If the result is successful...
  }

  continue() {
    let data = {
      pessenger: {
        firstName: 'Dummy',
        lastName: 'User',
        email: 'DummyEmail@fijo.com',
      }
    }
    localStorage.setItem('user', JSON.stringify(data))
    this.r.navigate(['/home'])
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


  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      duration: 5000,
      message: 'Loading Please Wait...',
      translucent: true,
      cssClass: 'loading-class',
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);

  }

}
