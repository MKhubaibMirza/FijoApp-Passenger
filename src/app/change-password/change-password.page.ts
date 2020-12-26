import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor(
    private passengerService: PassengerService,
    private modal: ModalController,
    private loading: LoadingController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  password = {
    old: '',
    new: '',
    confirm: '',
  }

  onChangePasswordClick() {
    if ((this.password.new && this.password.old && this.password.confirm) == '') {
      this.presentToast('Please Fill all the Fields!')
    } else {
      if (this.password.new == this.password.confirm) {
        let id = JSON.parse(localStorage.getItem('user')).id
        let data = {
          oldpassword: this.password.old,
          newpassword: this.password.new
        }
        this.presentLoading()
        this.passengerService.changePasswrod(id, data).subscribe((resp: any) => {
          this.loading.dismiss()
          if (resp.message == 'Password updated successfully') {
            this.presentToast(resp.message)
            this.modal.dismiss()
          } else if (resp.message == "Oops Password not updated") {
            this.presentToast('You current password does not matched');
          }
        })
      } else {
        this.presentToast('Both Password not Match!')
      }
    }
  }

  // loading loading loading
  async presentLoading() {
    const loading = await this.loading.create({
      duration: 8000,
      message: 'Please wait...',
    });
    await loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'medium'
    });
    toast.present();
  }
  closeModal() {
    this.modal.dismiss()
  }
}