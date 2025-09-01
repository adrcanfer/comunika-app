import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  public async showDialog(title: string, text: string, callBack: Function) {
    const alert = await this.alertController.create({
      header: title,
      message: text,
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel'
        },
        {
          text: "Aceptar",
          role: 'accept'
        }
      ]
    });

    await alert.present();

    alert.addEventListener('didDismiss', (event: any) => {
      if(event.detail.role == 'accept') {
        callBack();
      }
    });
  }

  public async showAlert(title: string | undefined, text: string, callback?: Function) {
    const alert = await this.alertController.create({
      header: title,
      message: text,
      buttons: [
        {
          text: "Aceptar",
          role: 'accept'
        }
      ]
    });

    await alert.present();

    if(callback) {
      alert.addEventListener('didDismiss', (event: any) => {
        if(event.detail.role == 'accept') {
          callback();
        }
      });
    }
  }
}
