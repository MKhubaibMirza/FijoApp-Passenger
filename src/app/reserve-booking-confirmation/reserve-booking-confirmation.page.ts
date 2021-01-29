import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-reserve-booking-confirmation',
  templateUrl: './reserve-booking-confirmation.page.html',
  styleUrls: ['./reserve-booking-confirmation.page.scss'],
})
export class ReserveBookingConfirmationPage implements OnInit {

  constructor(
    public modal: ModalController,
    public translateservice: TranslateConfigService,
    public toastController: ToastController
  ) { }
  async presentToast(mes) {
    const toast = await this.toastController.create({
      message: mes,
      mode:'ios',
      position: 'bottom',
      color: 'primary',
      duration: 2000
    });
    toast.present();
  }

  close() {
    this.modal.dismiss(false);
  }
  allowedDays = [];
  ngOnInit() { }
  ionViewWillEnter() {
    this.allowedDays = [new Date().getDate()];
    var actualDate = new Date();
    var newDate;
    for (var i = 1; i <= 4; i++) {
      newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + i);
      this.allowedDays.push(new Date(newDate).getDate())
    }
  }
  selectedCard = '';
  selectedDate = '';
  selectedTime = '';
  selectCard(val) {
    this.selectedCard = val;
  }
  valueOfDateAndTime(e) {
    this.selectedCard = '';
    this.selectedDate = new Date(e.detail.value).toLocaleDateString();
    this.selectedTime = new Date(e.detail.value).toLocaleTimeString();
  }
  saveNow() {
    if (this.selectedCard !== '') {
      if (this.selectedCard == 'now') {
        this.modal.dismiss({ date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
      } else if (this.selectedCard == '30') {
        var addMinutes = new Date();
        let finalDateTime = addMinutes.setMinutes(addMinutes.getMinutes() + 30);
        this.modal.dismiss({ date: new Date(finalDateTime).toLocaleDateString(), time: new Date(finalDateTime).toLocaleTimeString() })
      } else if (this.selectedCard == '60') {
        var addMinutes = new Date();
        let finalDateTime = addMinutes.setMinutes(addMinutes.getMinutes() + 60);
        this.modal.dismiss({ date: new Date(finalDateTime).toLocaleDateString(), time: new Date(finalDateTime).toLocaleTimeString() })
      }
    } else if ((this.selectedDate && this.selectedTime) !== '') {
      this.modal.dismiss({ date: this.selectedDate, time: this.selectedTime })
    } else {
      if (this.translateservice.selectedLanguage() == 'en') {
        this.presentToast('Please Select Date Time');
      } else {
        this.presentToast('Seleccione Fecha Hora');
      }
    }
  }
}
