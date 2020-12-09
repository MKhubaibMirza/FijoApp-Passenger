import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ask-payment-way',
  templateUrl: './ask-payment-way.page.html',
  styleUrls: ['./ask-payment-way.page.scss'],
})
export class AskPaymentWayPage implements OnInit {

  constructor(public modal: ModalController, public r: Router) { }

  ngOnInit() {
  }
  IsSaving = false;
  onSelect() {
    this.IsSaving = true;
    setTimeout(() => {
      this.r.navigate(['/tracking'])
      this.modal.dismiss();
    }, 1500);
  }
  addpaymentmethod() {
    this.r.navigate(['/add-payment-method'])
    this.modal.dismiss();
  }
}
