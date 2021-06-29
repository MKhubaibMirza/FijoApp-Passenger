import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  MapsAPILoader,
} from "@agm/core";
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { DataService } from '../services/data.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ModalController } from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.page.html',
  styleUrls: ['./search-page.page.scss'],
})
export class SearchPagePage {


  constructor(
    private mapsAPILoader: MapsAPILoader,
    public dataservice: DataService,
    public modal: ModalController,
    private geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
  ) { }
  private geoCoder;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @ViewChild("placesRef2") placesRef2: GooglePlaceDirective;
  text = '';
  origin = '';
  destination = '';
  public handleAddressChange(address: Address, isOrigin) {
    if (isOrigin) {
      this.origin = address.formatted_address;
    } else {
      this.destination = address.formatted_address;
    }
  }
  options = {
    types: [],
    componentRestrictions: {
      country: ['ES', 'PK']
    }
  }
  SavedLocations = [];
  OnRouteItemClick(item) {
    this.destination = item.routePath;
  }
  setCurrentlocationAddressInPickup() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      this.geolocation.getCurrentPosition().then((resp: any) => {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 1
        };
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
          .then((result: NativeGeocoderResult[]) => {
            let reverseOrigion = result[0].thoroughfare + ' ' + result[0].subLocality + ' ' + result[0].locality + ' ' + result[0].administrativeArea + ' ' + result[0].countryName;
            this.origin = reverseOrigion;
            this.dataservice.getAlpha2Code(result[0].countryName).subscribe((innerResp: any) => {
              this.options.componentRestrictions = { country: [innerResp[0].alpha2Code] };
            })
          }, err => {
            this.options.componentRestrictions = {
              country: ['ES', 'PK']
            };
            this.getAddress(resp.coords.latitude, resp.coords.longitude);
          })
      })
    });
  }
  ionViewWillEnter() {
    this.dataservice.saved_location_get().subscribe((resp: any) => {
      this.SavedLocations = resp;
    })
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude, } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.origin = results[0].formatted_address;
        }
      }
    });
  }
  done() {
    if (this.destination == "Carretera del Aeropuerto, s/n, 46940 Manises, Valencia, Spain") {
      this.destination = "Aeroport, 46940, Valencia, Spain"
    } else if (this.origin == "Carretera del Aeropuerto, s/n, 46940 Manises, Valencia, Spain") {
      this.origin = "Aeroport, 46940, Valencia, Spain"
    }
    if ((this.origin && this.destination) !== '') {
      this.modal.dismiss({ origin: this.origin, destination: this.destination });
    } else {
      this.modal.dismiss(false);
    }
  }
  closeModal() {
    this.modal.dismiss(false);
  }
}
