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
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule } from '@agm/core';
import { AskPaymentWayPage } from './ask-payment-way/ask-payment-way.page';
import { WelcomeUserPage } from './welcome-user/welcome-user.page';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from '../environments/environment'
import { CancelConfirmationPage } from './cancel-confirmation/cancel-confirmation.page';
import * as firebase from 'firebase';
firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent, AskPaymentWayPage, WelcomeUserPage, CancelConfirmationPage],
  entryComponents: [AskPaymentWayPage, WelcomeUserPage, CancelConfirmationPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDTqB69PYC2D18TqUGMd-yyyMK9a3Qg2g8',
      libraries: ['places']
    }),],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AndroidPermissions,
    LocationAccuracy,
    OneSignal,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
