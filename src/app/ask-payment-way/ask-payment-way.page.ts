import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ask-payment-way',
  templateUrl: './ask-payment-way.page.html',
  styleUrls: ['./ask-payment-way.page.scss'],
})
export class AskPaymentWayPage implements OnInit {
  FindDriverObj = {
    noOfSeating: '',
    vehicleType: '',
    city: JSON.parse(localStorage.getItem('user')).city,
    currentLat: 0,
    currentLng: 0,
    searchInKM: 7,
    paymentVia: '',
    passengerObj: localStorage.getItem('user'),
    origin: '',
    destination: '',
    estTime: '',
    totalKM: 0
  }
  constructor(public modal: ModalController, public r: Router) { }

  ngOnInit() {
  }
  IsSaving = false;
  onSelect(i) {
    if (i == 1) {
      this.FindDriverObj.paymentVia = 'card';
    } else {
      this.FindDriverObj.paymentVia = 'cash';
    }
    console.log(i, this.FindDriverObj);
    this.IsSaving = true;
    localStorage.setItem('findDriverObj', JSON.stringify(this.FindDriverObj));
    setTimeout(() => {
      this.r.navigate(['/tracking'])
      this.modal.dismiss();
    }, 1500);
  }
  addpaymentmethod(i) {
    this.r.navigate(['/add-payment-method'])
    this.modal.dismiss();
  }
}
