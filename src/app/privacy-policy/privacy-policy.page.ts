import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  pdfSrc = 'assets/FijoTaxi_PassengerPrivacyPolicy_Spanish.pdf';
  pdfSrc2 = 'assets/Fijotaxi_PassengerPrivacyPolicy_English.pdf';
  condition = 'Spanish';
  segmentChanged(event) {
    this.condition = event.detail.value;
  }
}
