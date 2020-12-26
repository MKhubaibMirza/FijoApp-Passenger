import { Component, OnInit } from '@angular/core';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(
    private document: DocumentViewer,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }
  openPrivacyPolicy() {
    // const options: DocumentViewerOptions = {
    //   title: 'Privacy Policy'
    // }
    // this.document.viewDocument('assets/Fijotaxi_PassengerPrivacyPolicy_English.pdf', 'application/pdf', options)
  }
  openTermsAndCondition() {
    // const options: DocumentViewerOptions = {
    //   title: 'Terms And Condition'
    // }
    // this.document.viewDocument('assets/Fijotaxi_PassengerPrivacyPolicy_English.pdf', 'application/pdf', options)
  }
}
