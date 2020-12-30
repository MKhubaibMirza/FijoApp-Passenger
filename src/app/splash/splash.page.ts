import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {

  constructor(
    public r: Router,
    public locService: LocationService
  ) { }

  ionViewWillEnter() {
    setTimeout(() => {
      this.locService.checkGPSPermission();
    }, 3000);
  }

}
