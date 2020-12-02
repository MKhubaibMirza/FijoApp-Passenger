import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-open-door-preference',
  templateUrl: './open-door-preference.page.html',
  styleUrls: ['./open-door-preference.page.scss'],
})
export class OpenDoorPreferencePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  data = [
    { id: 1, text: 'NO', checked: false, },
    { id: 2, text: 'At pick-up', checked: false, },
    { id: 3, text: 'At drop Off', checked: false, },
    { id: 4, text: 'At pick up and drop off', checked: false, },
  ]

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
}
