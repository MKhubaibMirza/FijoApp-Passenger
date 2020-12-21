import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';
@Component({
  selector: 'app-open-door-preference',
  templateUrl: './open-door-preference.page.html',
  styleUrls: ['./open-door-preference.page.scss'],
})
export class OpenDoorPreferencePage implements OnInit {

  constructor(public passengerService: PassengerService, public modalController: ModalController) { }


  ngOnInit() {
    this.passengerService.getMyPreferences().subscribe((resp: any) => {
      console.log(resp);
      this.data.forEach((element, i) => {
        if (element.text == resp.openDoor) {
          console.log(element, '....');
          this.data[i].checked = true;
          this.selectedItem = element;
        }
      });
    })
  }


  data = [
    { id: 1, text: 'No', checked: false, },
    { id: 2, text: 'At pick-up', checked: false, },
    { id: 3, text: 'At drop Off', checked: false, },
    { id: 4, text: 'At pick up and drop off', checked: false, },
  ]


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
    console.log(this.data)
  }
  save() {
    let data = {
      openDoor: this.selectedItem.text
    }
    console.log(data);
    this.passengerService.update_opendoor(data).subscribe((resp: any) => {
      console.log(resp);
      this.modalController.dismiss();
    })
  }
}
