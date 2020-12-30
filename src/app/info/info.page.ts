import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { PassengerService } from '../services/passenger.service';
import { SocialAuthService } from '../services/social-auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(
    public passengerService: PassengerService,
    public modalController: ModalController,
    public alertCatrl: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private transfer: FileTransfer,
    public imagePicker: ImagePicker,
    private r: Router,
    public camera: Camera,
    public socialService: SocialAuthService,
    public t: TranslateService
  ) {
    t.get("infoPage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
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
      this.presentToast(this.respFromLanguage.fillPlz)
    } else {
      this.presentLoading()
      this.passengerService.updateInfo(this.data).subscribe((resp: any) => {
        localStorage.setItem('user', JSON.stringify(resp.passengerObj))
        this.loadingController.dismiss()
        this.ionViewWillEnter()
        this.presentToast(this.respFromLanguage.updtedSuccessfully)
      })
    }
  }
  logout() {
    this.socialService.logOut();
  }
  url = environment.baseUrl;
  IMAGEGALEERY: any;
  // maxImg = 1;
  // async openGalery() {
  //   this.imagePicker.requestReadPermission().then(result => {
  //     if (result == 'OK') {
  //       let options = {
  //         maximumImagesCount: 1,
  //       }
  //       this.imagePicker.getPictures(options).then((results) => {
  //         for (var i = 0; i < results.length; i++) {
  //           this.IMAGEGALEERY = results[i];
  //         }
  //       }).then(() => {
  //         if (this.IMAGEGALEERY) {
  //           this.presentLoading()
  //           this.uploadFile()
  //         }
  //       }, err => {
  //       })
  //     }
  //   }, err => {
  //     alert(err)
  //   });
  // }
  async openGalery() {
    const alert = await this.alertCatrl.create({
      header: "Confirm",
      buttons: [
        {
          text: 'Gallery',
          handler: (blah) => {
            this.openCameraOrGalary(false);
          }
        }, {
          text: "Camera",
          handler: () => {
            this.openCameraOrGalary(true);
          }
        }
      ]
    });
    await alert.present();
  }
  openCameraOrGalary(byCamera) {
    let options: CameraOptions;
    if (byCamera) {
      options = {
        quality: 10,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA
      };
    } else {
      options = {
        quality: 10,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      };
    }
    this.camera.getPicture(options).then((imageData) => {
      let image = 'data:image/jpeg;base64,' + imageData;
      this.presentLoading();
      this.uploadFile(image);
    });
  }
  uploadFile(image) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      httpMethod: 'POST'
    };

    fileTransfer.upload(image, this.url + 'imageUpload', options)
      .then((data) => {
        let fileName = data.response.replace('"', '');
        fileName = fileName.replace('"', '');
        this.loadingController.dismiss();
        this.data.profilePhoto = fileName;
        let localData = JSON.parse(localStorage.getItem('user'))
        localData.profilePhoto = fileName;
        localStorage.setItem('user', JSON.stringify(localData));
        this.saveChanges();
      }, (err) => {
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
      message: this.respFromLanguage.loading,
      duration: 9000,
      spinner: 'dots',
      backdropDismiss: true,
    });
    await loading.present();
  }
}
