import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-call-preference',
  templateUrl: './call-preference.page.html',
  styleUrls: ['./call-preference.page.scss'],
})
export class CallPreferencePage implements OnInit {

  constructor(public passengerService: PassengerService, public modalController: ModalController) { }
  data = [
    { id: 1, text: 'Do not call under any circumstances', checked: false, },
    { id: 2, text: 'Only in case of doubts', checked: false, },
    { id: 3, text: 'When journey is accepted', checked: false, },
    { id: 4, text: 'On arrival at pick point', checked: false, },
    { id: 5, text: 'On accepting journey and on arrival', checked: false, },
  ];
  ngOnInit() {
    this.passengerService.getMyPreferences().subscribe((resp: any) => {
      console.log(resp);
      this.data.forEach((element, i) => {
        if (element.text == resp.call) {
          console.log(element, '....');
          this.data[i].checked = true;
        }
      });
    })
  }
  preferenceId = 0;
  selectedItem = { id: 1, text: 'Do not call under any circumstances', checked: false, };
  click(item) {
    this.data.forEach(element => {
      if (item.id == element.id) {
        element.checked = true
        item.checked = true
      } else {
        element.checked = false
      }
    });
    console.log(this.data)
  }
  save() {
    let data = {
      call: this.selectedItem.text
    }
    console.log(data);
    // this.passengerService.update_passenger_preference_call(data, this.preferenceId).subscribe((resp: any) => {
    //   console.log(resp);
    // })
  }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
      cssClass: 'changepassword',
    });
    await modal.present();
  }
}
