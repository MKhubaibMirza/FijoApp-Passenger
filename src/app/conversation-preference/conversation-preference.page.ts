import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerService } from '../services/passenger.service';
@Component({
  selector: 'app-conversation-preference',
  templateUrl: './conversation-preference.page.html',
  styleUrls: ['./conversation-preference.page.scss'],
})
export class ConversationPreferencePage implements OnInit {

  constructor(public passengerService: PassengerService, public modalController: ModalController) { }


  ngOnInit() {
    this.passengerService.getMyPreferences().subscribe((resp: any) => {
      console.log(resp);
      this.data.forEach((element, i) => {
        if (element.text == resp.conversation) {
          console.log(element, '....');
          this.data[i].checked = true;
          this.selectedItem = element;
        }
      });
    })
  }
  data = [
    { id: 1, text: 'I prefer silence', checked: false, },
    { id: 2, text: 'I like to chat', checked: false, },
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
      conversation: this.selectedItem.text
    }
    console.log(data);
    this.passengerService.update_conversation(data).subscribe((resp: any) => {
      console.log(resp);
      this.modalController.dismiss();
    })
  }
}
