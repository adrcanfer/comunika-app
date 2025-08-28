import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { S3FileContent } from 'src/app/model/s3-file-content.model';
import { AlertService } from 'src/app/services/alert.service';
import { FileService } from 'src/app/services/file.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ToastService } from 'src/app/services/toast.service';
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

  constructor(
    private spinnerService: SpinnerService,
    private fileService: FileService,
    private alertService: AlertService,
    private toastService: ToastService
  ) { }

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
    const urlParts = this.currentImage!.split('/');
    const key = urlParts[urlParts.length - 1];

    this.spinnerService.showSpinner();
    this.fileService.getFile(key)
      .then(async (res: S3FileContent) => {
        const { name, contentType, content } = res;
        const base64Data = content.split(',')[1];

        if (environment.mode === 'web') {
          this.saveImgInWeb(name, base64Data, contentType);
        } else {
          await this.saveImgInApp(name, base64Data, contentType);
        }
      })
      .catch(e => {
        this.alertService.showAlert("Error", "Se ha producido un error descargando el adjunto. Inténtelo de nuevo más tarde.")
      }).finally(() => this.spinnerService.closeSpinner());

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

  private saveImgInWeb(name: string, base64Data: string, contentType: string) {
    // Convertir base64 → Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    // Crear un link oculto para forzar la descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getFileName(name);  // nombre que vino de la API
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private async saveImgInApp(name: string, base64Data: string, contentType: string) {
    try {
      let result;

      if (Capacitor.getPlatform() === 'android') {
        // Guardar en Downloads
        result = await Filesystem.writeFile({
          path: `Pictures/ComuniKame/${this.getFileName(name)}`,
          data: base64Data,
          directory: Directory.ExternalStorage,
          recursive: true
        });

        console.log('Archivo guardado en:', result.uri);
        this.toastService.showToast("Se ha guardado exitosamente")

      } else {
        // En iOS lo guardamos en sandbox
        result = await Filesystem.writeFile({
          path: this.getFileName(name),
          data: base64Data,
          directory: Directory.External,
        });
        console.log('Archivo guardado en sandbox iOS:', result.uri);

        // En ambos casos abrimos un "share dialog" para que el usuario pueda verlo/exportarlo
        await Share.share({
          title: 'Archivo descargado',
          text: 'Aquí tienes tu archivo',
          url: result.uri,
          dialogTitle: 'Compartir archivo'

        });
      }

    } catch (err) {
      console.error('Error guardando fichero', err);
      this.alertService.showAlert("Error", "Se ha producido un error guardando el fichero. Inténtelo de nuevo más tarde.");
    }
  }

  private getFileName(name: string) {
    const extension = name.split(".")[1];
    return `ComuniKame-${this.getFormattedCurrentDate()}.${extension}`;
  }

}
