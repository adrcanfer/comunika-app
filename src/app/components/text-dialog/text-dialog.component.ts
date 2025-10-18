import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss'],
  standalone: false
})
export class TextDialogComponent {

  @Input() title!: string;
  @Input() content!: string;

  constructor(private modalController: ModalController) { }

  close() {
    this.modalController.dismiss();
  }

  emit() {
    this.modalController.dismiss({ content: this.content});
  }

  changeContent(event: any) {
    const content = event.detail.value;
    this.content = content.trim().length == 0 ? undefined : content.trim();
  }

}
