import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private alertController: AlertController) { }
  async presentAlertMessage(msg, func = null) {
    const binded = func && func.bind(this);
    const alert = await this.alertController.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        cssClass: 'primary',
        role: 'cancel',
        handler: () => {
          binded && binded();
        }
      }
      ]
    });
    await alert.present();
  }
  refreshPage() {
    window.location.reload();
  }
}
