import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-fav-dest',
  templateUrl: './fav-dest.page.html',
  styleUrls: ['./fav-dest.page.scss'],
})
export class FavDestPage implements OnInit {

  constructor(
    private mapsAPILoader: MapsAPILoader,
    public alertController: AlertController,
    public d: DataService,
    private ngZone: NgZone,
    public nativeGeocoder: NativeGeocoder,
    public geolocation: Geolocation,
    public dataservice: DataService,
    public t: TranslateService
  ) {
    t.get("myFavDestinationPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  destination = '';
  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geolocation.getCurrentPosition().then((resp: any) => {
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
          .then((result: NativeGeocoderResult[]) => {
            this.dataservice.getContryCodeAndFlag(result[0].countryName).subscribe((resp: any) => {
              let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
              autocomplete.setComponentRestrictions({
                country: [resp[0].alpha2Code],
              });
              autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  if (place.geometry === undefined || place.geometry === null) {
                    return;
                  }
                  this.presentAlertConfirm(place.formatted_address)
                });
              });
            }, err => {
              let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
              autocomplete.setComponentRestrictions({
                country: ["ES", "PK"],
              });
              autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  if (place.geometry === undefined || place.geometry === null) {
                    return;
                  }
                  this.presentAlertConfirm(place.formatted_address)
                });
              });
            })
          })
      })
    });
  }
  ionViewWillEnter() {
    this.d.saved_location_get().subscribe((resp: any) => {
      this.dest = resp;
    })
  }
  dest = [];
  async presentAlertConfirm(destination) {
    const alert = await this.alertController.create({
      header: this.respFromLanguage.favouriteDestinations,
      message: this.respFromLanguage.sure,
      inputs: [{
        name: 'title',
        type: 'text',
        placeholder: this.respFromLanguage.AlrtTitle
      }],
      buttons: [
        {
          text: this.respFromLanguage.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.respFromLanguage.okay,
          handler: (value) => {
            if (value.title == '') {
              return false;
            } else {
              let data = {
                routePath: destination,
                routeTitle: value.title,
                passengerId: JSON.parse(localStorage.getItem('user')).id
              }
              this.d.saved_location_create(data).subscribe((resp: any) => {
                this.destination = '';
                this.ionViewWillEnter();
              })
            }
          }
        }
      ]
    });
    await alert.present();
  }
  removeLocation(item) {
    this.d.saved_location_delete(item.id).subscribe((resp: any) => {
      this.ionViewWillEnter();
    })
  }
}
