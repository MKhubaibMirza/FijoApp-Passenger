import { Component, OnInit } from "@angular/core";
import { ToastController, MenuController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { PassengerService } from '../services/passenger.service';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    public passengerService: PassengerService,
    public r: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    public t: TranslateService
  ) {
    t.get("forgotPasswordPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  ngOnInit() { }
  ionViewWillEnter() {
    this.EmailMilgia = false;
  }
  ionViewWillLeave() {
    this.EmailMilgia = false;
  }

  async presentAlert(title, mes) {
    const alert = await this.alertController.create({
      header: title,
      message: mes,
      cssClass: "alertCust",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async presentToast(mes) {
    const toast = await this.toastController.create({
      message: mes,
      color: 'medium',
      mode:'ios',
      duration: 2000,
    });
    toast.present();
  }
  verifyEmail = {
    email: "",
  };
  ChangePass = {
    password: "",
    confPass: "",
  };
  UserGLOBAL_DATA: any;
  EmailMilgia = false;
  Change_Pass_Word = false;
  secreatCodeVerifeir = false;
  verifycode: any;
  secreatCode = {
    code: "",
  };
  EmailCheker() {
    if (this.verifyEmail.email !== "") {
      this.passengerService.forgot(this.verifyEmail).subscribe((resp: any) => {
        if (resp.passenger) {
          this.secreatCodeVerifeir = true;
          this.EmailMilgia = true;
          this.UserGLOBAL_DATA = resp.passenger;
          this.verifycode = resp.verificationCode;
          this.presentAlert(
            this.respFromLanguage.checkEmail,
            this.respFromLanguage.copy
          );
        } else if (resp.message === "Email does not exit") {
          this.presentToast(this.respFromLanguage.noExist);
        }
      });
    } else {
      this.presentToast(this.respFromLanguage.enterEmailPlz);
    }
  }
  verifierCodeOfpass() {
    if (this.secreatCode.code === "") {
      this.presentToast(this.respFromLanguage.enterCodePlz);
    } else {
      if (this.secreatCode.code == this.verifycode) {
        this.secreatCodeVerifeir = false;
        this.Change_Pass_Word = true;
      } else {
        this.presentToast(this.respFromLanguage.codeNoMatch);
      }
    }
  }
  pass_Matcher = false;
  changepasschecker() {
    if (this.ChangePass.confPass !== this.ChangePass.password) {
      this.pass_Matcher = false;
    } else {
      this.pass_Matcher = true;
    }
  }

  ChangePassword() {
    if ((this.ChangePass.confPass && this.ChangePass.password) === "") {
      this.presentToast(this.respFromLanguage.fillPlz);
    } else if (this.ChangePass.confPass !== this.ChangePass.password) {
      this.presentToast(this.respFromLanguage.wrongPass);
    } else {
      this.passengerService
        .changepass(this.ChangePass, this.UserGLOBAL_DATA.id)
        .subscribe((respo: any) => {
          localStorage.setItem("user", JSON.stringify(this.UserGLOBAL_DATA));
          localStorage.removeItem('TempUser');
          this.presentAlert(
            this.respFromLanguage.successfull,
            this.respFromLanguage.successfullChange
          );
          this.r.navigate(["/home"]);
        });
    }
  }

}
