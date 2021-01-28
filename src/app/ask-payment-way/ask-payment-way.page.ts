import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AddPaymentMethodPage } from '../add-payment-method/add-payment-method.page';
import { PaymentService } from '../services/payment.service';

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
    totalKM: 0,
    isReserved: false,
    date: '',
    time: ''
  }
  isReserved;
  ReserveDate;
  ReserveTime;
  paymentMethodsLength = 0;
  paymentMethods = '';
  IsSaving = false;
  constructor(
    public modal: ModalController,
    public toastController: ToastController,
    public r: Router,
    public paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.paymentService.GetPaymentMethodOfPassenger().subscribe((resp: any) => {
      this.paymentMethodsLength = resp.length;
      this.paymentMethods = JSON.stringify(resp);
    });
    this.FindDriverObj.isReserved = this.isReserved;
    if (this.isReserved) {
      this.FindDriverObj.date = this.ReserveDate;
      this.FindDriverObj.time = this.ReserveTime;
    }
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'medium',
      position: 'top',
      mode:'ios',
      duration: 2000
    });
    toast.present();
  }

  onSelect(i) {
    if (i == 1) {
      this.FindDriverObj.paymentVia = 'card';
      if (this.paymentMethodsLength == 0) {
        this.presentToast("Opps! You don't have any payment method yet.");
      } else {
        localStorage.setItem('paymentMethods', this.paymentMethods);
        this.IsSaving = true;
        localStorage.setItem('findDriverObj', JSON.stringify(this.FindDriverObj));
        setTimeout(() => {
          this.r.navigate(['/tracking'])
          this.modal.dismiss();
        }, 1500);
      }
    } else if (i == 3) {
      this.r.navigate(['/add-payment-method'])
      this.modal.dismiss();
    } else {
      this.FindDriverObj.paymentVia = 'cash';
      this.IsSaving = true;
      localStorage.setItem('findDriverObj', JSON.stringify(this.FindDriverObj));
      setTimeout(() => {
        this.r.navigate(['/tracking'])
        this.modal.dismiss();
      }, 1500);
    }
  }
}
