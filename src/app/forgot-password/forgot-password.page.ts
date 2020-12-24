import { Component, OnInit } from "@angular/core";
import { ToastController, MenuController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { PassengerService } from '../services/passenger.service';
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
    public toastController: ToastController
  ) {
  }

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
        console.log(resp);
        if (resp.passenger) {
          this.secreatCodeVerifeir = true;
          this.EmailMilgia = true;
          this.UserGLOBAL_DATA = resp.passenger;
          this.verifycode = resp.verificationCode;
          this.presentAlert(
            "Check You E-Mail",
            "Please copy 8 word secret code from your email."
          );
          console.log(this.UserGLOBAL_DATA);
        } else if (resp.message === "Email does not exit") {
          this.presentToast("* Email does not exists. TRY AGAIN !");
        }
      });
    } else {
      this.presentToast("Please Enter You Email");
    }
  }
  verifierCodeOfpass() {
    if (this.secreatCode.code === "") {
      this.presentToast("Please enter code");
    } else {
      console.log(this.secreatCode.code, this.verifycode)
      if (this.secreatCode.code == this.verifycode) {
        this.secreatCodeVerifeir = false;
        this.Change_Pass_Word = true;
      } else {
        this.presentToast("Code Does Not Match.");
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
      this.presentToast("Please fill all the fields.");
    } else if (this.ChangePass.confPass !== this.ChangePass.password) {
      this.presentToast("Password does not match with each other.");
    } else {
      this.passengerService
        .changepass(this.ChangePass, this.UserGLOBAL_DATA.id)
        .subscribe((respo: any) => {
          console.log(respo);
          localStorage.setItem("user", JSON.stringify(this.UserGLOBAL_DATA));
          localStorage.removeItem('TempUser');
          this.presentAlert(
            "Successfull",
            "Your password has been successfully updated."
          );
          this.r.navigate(["/home"]);
        });
    }
  }

}
