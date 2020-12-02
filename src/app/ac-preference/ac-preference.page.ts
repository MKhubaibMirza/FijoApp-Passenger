import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ac-preference',
  templateUrl: './ac-preference.page.html',
  styleUrls: ['./ac-preference.page.scss'],
})
export class AcPreferencePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  data = [
    { id: 1, text: 'ON', checked: false, },
    { id: 2, text: 'OFF', checked: false, },
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
