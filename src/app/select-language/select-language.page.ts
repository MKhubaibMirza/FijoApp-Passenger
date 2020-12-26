import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.page.html',
  styleUrls: ['./select-language.page.scss'],
})
export class SelectLanguagePage implements OnInit {

  constructor(
    public r: Router,
    private menuController: MenuController,
    private translateConfigService: TranslateConfigService
  ) { }

  ngOnInit() {
    this.menuController.enable(false);
  }
  selectLang(val) {
    this.translateConfigService.setLanguage(val);
    this.r.navigate(['/welcome-note'])
  }
}
