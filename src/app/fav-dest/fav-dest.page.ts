import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  ) { }
  @ViewChild('search')
  public searchElementRef: ElementRef;
  destination = '';
  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.presentAlertConfirm(place.formatted_address)
        });
      });
    });
  }
  ionViewWillEnter() {
    this.d.saved_location_get().subscribe((resp: any) => {
      console.log(resp);
      this.dest = resp;
    })
  }
  dest = [];
  async presentAlertConfirm(destination) {
    const alert = await this.alertController.create({
      header: 'Favourite Destinations',
      message: 'Are you sure you want to add this location into your favourite destinations?',
      inputs: [{
        name: 'title',
        type: 'text',
        placeholder: 'Title'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: (value) => {
            if (value.title == '') {
              return false;
            } else {
              let data = {
                routePath: destination,
                routeTitle: value.title,
                passengerId: JSON.parse(localStorage.getItem('user')).id
              }
              console.log(data);
              this.d.saved_location_create(data).subscribe((resp: any) => {
                console.log(resp);
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
    console.log(item);
    this.d.saved_location_delete(item.id).subscribe((resp: any) => {
      console.log(resp);
      this.ionViewWillEnter();
    })
  }
}
