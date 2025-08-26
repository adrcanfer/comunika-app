import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: false
})
export class GalleryComponent  implements OnInit {

  @Input() attachments: string[] = [];
  @Input() editMode: boolean = false;
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  isModalOpen: boolean = false;
  currentImageIndex: number = 0;
  currentImage?: string;

  constructor() { }

  ngOnInit() {}

  handleAction(action: string, url: string) {
    switch(action) {
      case 'view':
        this.openModal(url);
        break;
      default:
        const event: any = {action, url};
        this.action.emit(event);
    }
  }

  showNext(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.attachments.length;
    this.currentImage = this.attachments[this.currentImageIndex];
  }

  showPrev(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.attachments.length) % this.attachments.length;
    this.currentImage = this.attachments[this.currentImageIndex];
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  private openModal(url: string) {
    const index = this.attachments.findIndex(a => a === url);
      if (index !== -1) {
        this.currentImageIndex = index;
        this.currentImage = this.attachments[this.currentImageIndex];
        this.isModalOpen = true;
      }
  }
  
}
