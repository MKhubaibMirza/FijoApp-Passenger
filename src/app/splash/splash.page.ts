import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    public r: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.r.navigate(['/select-language'])
    }, 3000);
  }

}
