import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
      this.data.forEach((element, i) => {
        if (element.text == resp.call) {
          this.data[i].checked = true;
          this.selectedItem = element;
        }
      });
    })
  }
  selectedItem = { id: 1, text: '', checked: false, };
  click(item) {
    this.data.forEach(element => {
      if (item.id == element.id) {
        element.checked = true
        item.checked = true
        this.selectedItem = element;
      } else {
        element.checked = false
      }
    });
  }
  save() {
    let data = {
      call: this.selectedItem.text
    }
    this.passengerService.update_passenger_preference_call(data).subscribe((resp: any) => {
      this.modalController.dismiss();
    })
  }
}
