import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Media, MediaSaveOptions } from '@capacitor-community/media';
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
    if(environment.mode === 'app') {
      this.spinnerService.showSpinner();
      this.saveImgInApp(this.currentImage!)
        .finally(() => this.spinnerService.closeSpinner());
    } else {
      const urlParts = this.currentImage!.split('/');
      const key = urlParts[urlParts.length - 1];
  
      this.spinnerService.showSpinner();
      this.fileService.getFile(key)
        .then(async (res: S3FileContent) => {
          const { name, contentType, content } = res;
          const base64Data = content.split(',')[1];
            this.saveImgInWeb(name, base64Data, contentType);
        })
        .catch(e => {
          this.alertService.showAlert("Error", "Se ha producido un error descargando el adjunto. Inténtelo de nuevo más tarde.")
        }).finally(() => this.spinnerService.closeSpinner());
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
    a.download = name;
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  async saveImgInApp(path: string) {
    try {
      let opts: MediaSaveOptions = { path, albumIdentifier: await this.getAlbum() };
      await Media.savePhoto(opts);
      this.toastService.showToast("Imagen guardada en la galería");

    } catch (err) {
      console.error(err);
      this.alertService.showAlert("Error", "No se pudo guardar la imagen.");
    }
  }

  async getAlbum(): Promise<string | undefined> {
    if (Capacitor.getPlatform() === 'ios') {
      return undefined;
    }

    const albumName = 'ComuniKame';

    //Obtenemos los albumes
    const { albums } = await Media.getAlbums();

    //Buscamos si existe ComuniKame
    const albumFound = albums.find(x => x.name === albumName);

    if(albumFound) {
      //Si lo encontramos, devolvemos el identificador
      return albumFound.identifier;
    } else {
      //Si no lo encontramos, lo creamos y volvemos a llamar a este metodo para encontrar el album
      await Media.createAlbum({ name: albumName });
      return this.getAlbum();
    }
  }

}
