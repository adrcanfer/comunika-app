import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AdmobService } from './admob.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
    private admobService: AdmobService
  ) { }

  public async showToast(content: string) {
    const duration = 2000;
    
    this.admobService.removeBanner();
    const toast = await this.toastController.create({
      message: content,
      duration,
      position: 'bottom',
    });

    await toast.present();

    setTimeout(() => this.admobService.resumeBanner(), duration)
  }
}
