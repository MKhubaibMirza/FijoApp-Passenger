import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.page.html',
  styleUrls: ['./select-language.page.scss'],
})
export class SelectLanguagePage implements OnInit {

  constructor(public r:Router) { }

  ngOnInit() {
  }
  selectLang(val){ 
    this.r.navigate(['/welcome-note'])
  }
}
