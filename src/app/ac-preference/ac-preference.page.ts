import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-ac-preference',
  templateUrl: './ac-preference.page.html',
  styleUrls: ['./ac-preference.page.scss'],
})
export class AcPreferencePage implements OnInit {
  constructor(public passengerService: PassengerService, public modalController: ModalController) { }


  ngOnInit() {
    this.passengerService.getMyPreferences().subscribe((resp: any) => {
      console.log(resp);
      this.data.forEach((element, i) => {
        if (element.text == resp.airCondition) {
          console.log(element, '....');
          this.data[i].checked = true;
          this.selectedItem = element;
        }
      });
    })
  }

  data = [
    { id: 1, text: 'On', checked: false, },
    { id: 2, text: 'Off', checked: false, },
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
      airCondition: this.selectedItem.text
    }
    console.log(data);
    this.passengerService.update_aircondition(data).subscribe((resp: any) => {
      console.log(resp);
      this.modalController.dismiss();
    })
  }

}
