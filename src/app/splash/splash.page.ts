import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {

  constructor(
    public r: Router
  ) { }

  ionViewWillEnter() {
    setTimeout(() => {
      this.r.navigate(['/select-language'])
    }, 3500);
  }

}
