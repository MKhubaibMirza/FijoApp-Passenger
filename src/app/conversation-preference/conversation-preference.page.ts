import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversation-preference',
  templateUrl: './conversation-preference.page.html',
  styleUrls: ['./conversation-preference.page.scss'],
})
export class ConversationPreferencePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  data = [
    { id: 1, text: 'I prefer silence', checked: false, },
    { id: 2, text: 'I like to chat', checked: false, },
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
