import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fav-drivers',
  templateUrl: './fav-drivers.page.html',
  styleUrls: ['./fav-drivers.page.scss'],
})
export class FavDriversPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  drivers = [
    { name: "John King", },
    { name: "King George", },
    { name: "Juan Carlos", },
  ]
}
