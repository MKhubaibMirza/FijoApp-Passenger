import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.page.html',
  styleUrls: ['./terms-and-condition.page.scss'],
})
export class TermsAndConditionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  pdfSrc = 'assets/FijoTaxi_Términos_y_Condiciones_Generales_para_Pasajeros_-_España_Spanish.pdf';
  pdfSrc2 = 'assets/FijoTaxiGeneral_Terms_and_Conditions_for_Passengers_-_Spain-English.pdf';
  condition = 'Spanish';
  segmentChanged(event) {
    this.condition = event.detail.value;
  }
}
