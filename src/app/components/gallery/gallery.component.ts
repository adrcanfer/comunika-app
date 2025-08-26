import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: false
})
export class GalleryComponent implements OnInit {

  @Input() attachments: string[] = [];
  @Input() editMode: boolean = false;
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  isModalOpen: boolean = false;
  currentImageIndex: number = 0;
  currentImage?: string;

  constructor() { }

  ngOnInit() { }

  handleAction(action: string, url: string) {
    switch (action) {
      case 'view':
        this.openModal(url);
        break;
      default:
        const event: any = { action, url };
        this.action.emit(event);
    }
  }

  downloadImage() {
    if (environment.mode === 'web') {
      fetch(this.currentImage!)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // sacar extensión de forma segura
        const extension = this.currentImage!.split('.').pop() || 'png';
        link.download = `comunikame-${this.getFormattedCurrentDate()}.${extension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // liberar memoria
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Error al descargar la imagen:', err);
      });
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

  private getFormattedCurrentDate() {
    // Crear un nuevo objeto Date con la fecha y hora actual
    const now = new Date();

    // Obtener cada componente de la fecha
    const year = now.getFullYear(); // YYYY
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // MM (getMonth() es 0-indexado)
    const day = now.getDate().toString().padStart(2, '0'); // DD
    const hours = now.getHours().toString().padStart(2, '0'); // HH
    const minutes = now.getMinutes().toString().padStart(2, '0'); // MM
    const seconds = now.getSeconds().toString().padStart(2, '0'); // SS

    // Concatenar todos los componentes
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedDateTime;
  }

}
