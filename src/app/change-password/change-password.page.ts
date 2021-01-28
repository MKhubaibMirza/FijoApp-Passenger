import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
    public t: TranslateService,
    private toastController: ToastController,
  ) {
    t.get("changePasswordModal").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  ngOnInit() {
  }

  password = {
    old: '',
    new: '',
    confirm: '',
  }

  onChangePasswordClick() {
    if ((this.password.new && this.password.old && this.password.confirm) == '') {
      this.presentToast(this.respFromLanguage.fillPlz)
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
            this.presentToast(this.respFromLanguage.updatedSuccessfully)
            this.modal.dismiss()
          } else if (resp.message == "Oops Password not updated") {
            this.presentToast(this.respFromLanguage.noMatchedCurrent);
          }
        })
      } else {
        this.presentToast(this.respFromLanguage.noMatched)
      }
    }
  }

  // loading loading loading
  async presentLoading() {
    const loading = await this.loading.create({
      duration: 8000,
      message: this.respFromLanguage.loading,
    });
    await loading.present();
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
  closeModal() {
    this.modal.dismiss()
  }
}