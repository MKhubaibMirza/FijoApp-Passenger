import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-note',
  templateUrl: './welcome-note.page.html',
  styleUrls: ['./welcome-note.page.scss'],
})
export class WelcomeNotePage implements OnInit {

  constructor(public r: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.r.navigate(['/via-phone'])
    }, 1500);
  }

}
