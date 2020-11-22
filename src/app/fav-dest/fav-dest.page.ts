import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fav-dest',
  templateUrl: './fav-dest.page.html',
  styleUrls: ['./fav-dest.page.scss'],
})
export class FavDestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  dest = [
    { name: "Office", desctination: "", },
    { name: "Mum's House", desctination: "", },
    { name: "Baby's School", desctination: "", },
  ]
}
