import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-preferences',
  templateUrl: './my-preferences.page.html',
  styleUrls: ['./my-preferences.page.scss'],
})
export class MyPreferencesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  items = [
    { name: "call", icon: "call-outline" },
    { name: "Air conditioning", icon: "thermometer" },
    { name: "Open Door", icon: "car" },
    { name: "Conversation", icon: "chatbox-ellipses" },
  ]
}
