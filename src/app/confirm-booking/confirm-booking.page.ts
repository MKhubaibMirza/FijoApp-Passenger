import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { AskPaymentWayPage } from '../ask-payment-way/ask-payment-way.page';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.page.html',
  styleUrls: ['./confirm-booking.page.scss'],
})
export class ConfirmBookingPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
    // this.FindDriverObj = JSON.parse(localStorage.getItem('tempFindDriverObj'));
  }
  dismiss(){
    this.modalController.dismiss();
  }
  approxOrMaxValue;
  FindDriverObj = {
    noOfSeating: 0,
    vehicleType: '',
    city: JSON.parse(localStorage.getItem('user')).city,
    currentLat: 0,
    currentLng: 0,
    searchInKM: 15,
    paymentVia: '',
    passengerObj: localStorage.getItem('user'),
    origin: '',
    destination: '',
    estTime: '',
    exactPriceForDriver: 0,
    exactPriceForPassenger: 0,
    totalKM: 0
  }
  // async askPayWay() {
  //   const modal = await this.modalController.create({
  //     component: AskPaymentWayPage,
  //     componentProps: {
  //       FindDriverObj: this.FindDriverObj
  //     },
  //     cssClass: 'askpayway'
  //   });
  //   await modal.present();
  // }
}
