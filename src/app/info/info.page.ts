import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { PassengerService } from '../services/passenger.service';
import { SocialAuthService } from '../services/social-auth.service';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(
    public passengerService: PassengerService,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private transfer: FileTransfer,
    public imagePicker: ImagePicker,
    private r: Router,
    public socialService: SocialAuthService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (localStorage.getItem('user')) {
      this.data = JSON.parse(localStorage.getItem('user'));
    }
  }

  data = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profilePhoto: ''
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getFirstName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName
  }
  getLastName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).lastName;
  }
  getPhoto() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).profilePhoto;
  }
  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
      cssClass: 'changepassword',
    });
    await modal.present();
  }
  saveChanges() {
    if ((this.data.firstName && this.data.lastName && this.data.phoneNumber) == '') {
      this.presentToast('Please Fill all the Fields')
    } else {
      this.presentLoading()
      this.passengerService.updateInfo(this.data).subscribe((resp: any) => {
        console.log(resp)
        localStorage.setItem('user', JSON.stringify(resp.passengerObj))
        this.loadingController.dismiss()
        this.ionViewWillEnter()
        this.presentToast(resp.message)
      })
    }
  }
  logout() {
    this.socialService.logOut();
  }
  url = environment.baseUrl;
  IMAGEGALEERY: any;
  maxImg = 1;
  async openGalery() {
    this.imagePicker.requestReadPermission().then(result => {
      console.log('requestReadPermission: ', result);
      if (result == 'OK') {
        let options = {
          maximumImagesCount: 1,
        }
        this.imagePicker.getPictures(options).then((results) => {
          console.log(result)
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.IMAGEGALEERY = results[i];
          }
        }).then(() => {
          console.log(this.IMAGEGALEERY)
          if (this.IMAGEGALEERY) {
            this.presentLoading()
            this.uploadFile()
          }
        }, err => {
          console.log(err)
        })
      }
    }, err => {
      alert(err)
    });
  }
  uploadFile() {
    console.log()
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      httpMethod: 'POST'
    };

    fileTransfer.upload(this.IMAGEGALEERY, this.url + 'imageUpload', options)
      .then((data) => {
        console.log('success:' + JSON.stringify(data));
        let fileName = data.response.replace('"', '');
        fileName = fileName.replace('"', '');
        this.loadingController.dismiss();
        this.data.profilePhoto = fileName

        let localData = JSON.parse(localStorage.getItem('user'))
        fileName = localData.profilePhoto
        localStorage.setItem('user', JSON.stringify(localData))
      }, (err) => {
        console.log('error', err);
        this.loadingController.dismiss();
      });
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'medium'
    });
    toast.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 9000,
      spinner: 'dots',
      backdropDismiss: true,
    });
    await loading.present();
  }
}
