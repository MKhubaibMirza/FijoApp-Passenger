import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CancelReasonPage } from '../cancel-reason/cancel-reason.page';

@Component({
  selector: 'app-cancel-confirmation',
  templateUrl: './cancel-confirmation.page.html',
  styleUrls: ['./cancel-confirmation.page.scss'],
})
export class CancelConfirmationPage implements OnInit {

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }
  async cancelReasonModal() {
    this.modalController.dismiss()
    const modal = await this.modalController.create({
      component: CancelReasonPage,
      cssClass: 'cancelreason'
    });
    return await modal.present();
  }
  close(){
    this.modalController.dismiss();
  }
}
