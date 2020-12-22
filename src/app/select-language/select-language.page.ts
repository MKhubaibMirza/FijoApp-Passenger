import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.page.html',
  styleUrls: ['./select-language.page.scss'],
})
export class SelectLanguagePage implements OnInit {

  constructor(
    public r: Router,
    private translateConfigService: TranslateConfigService
  ) { }

  ngOnInit() {
  }
  selectLang(val) {
    this.translateConfigService.setLanguage(val);
    console.log(this.translateConfigService.selectedLanguage())
    this.r.navigate(['/welcome-note'])
  }
}
