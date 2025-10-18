import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TextDialogComponent } from '../components/text-dialog/text-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private modalController: ModalController
  ) { }

  async openTextDialog(title: string, content: string | undefined): Promise<string | undefined> {
    const modal = await this.modalController.create({
      component: TextDialogComponent,
      componentProps: {
        title,
        content
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    return data ? data.content : "";
  }
}
