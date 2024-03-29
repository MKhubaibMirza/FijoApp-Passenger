import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule } from '@agm/core';
import { AskPaymentWayPage } from './ask-payment-way/ask-payment-way.page';
import { WelcomeUserPage } from './welcome-user/welcome-user.page';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from '../environments/environment';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { CancelConfirmationPage } from './cancel-confirmation/cancel-confirmation.page';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase';
import { Stripe } from '@ionic-native/stripe/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './services/translate-config.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Camera } from '@ionic-native/camera/ngx';
import { SplashPage } from './splash/splash.page';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ConfirmBookingPage } from './confirm-booking/confirm-booking.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ReserveBookingConfirmationPage } from './reserve-booking-confirmation/reserve-booking-confirmation.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
firebase.initializeApp(environment.firebaseConfig);
@NgModule({
  declarations: [AppComponent, AskPaymentWayPage, WelcomeUserPage, CancelConfirmationPage, SplashPage, ConfirmBookingPage, ReserveBookingConfirmationPage],
  entryComponents: [AskPaymentWayPage, WelcomeUserPage, CancelConfirmationPage, SplashPage, ConfirmBookingPage, ReserveBookingConfirmationPage],
  imports: [
    PdfViewerModule,
    BrowserAnimationsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GooglePlaceModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    }),
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDTqB69PYC2D18TqUGMd-yyyMK9a3Qg2g8',
      libraries: ['places']
    }),
    BrowserAnimationsModule,],
  providers: [
    StatusBar,
    SplashScreen,
    Insomnia,
    Geolocation,
    NativeAudio,
    ImagePicker,
    LocalNotifications,
    AndroidPermissions,
    Camera,
    DocumentViewer,
    Facebook,
    CallNumber,
    SocialSharing,
    Stripe,
    GooglePlus,
    File,
    FileTransfer,
    LocationAccuracy,
    OneSignal,
    NativeGeocoder,
    TranslateConfigService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
