import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-preference',
  templateUrl: './call-preference.page.html',
  styleUrls: ['./call-preference.page.scss'],
})
export class CallPreferencePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  data = [
    { id: 1, text: 'Do not call under any circumstances', checked: false, },
    { id: 2, text: 'Only in case of doubts', checked: false, },
    { id: 3, text: 'When journey is accepted', checked: false, },
    { id: 4, text: 'On arrival at pick point', checked: false, },
    { id: 5, text: 'On accepting journey and on arrival', checked: false, },
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
