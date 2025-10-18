import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { Event } from 'src/app/model/event.model';
import { S3FileContent } from 'src/app/model/s3-file-content.model';
import { UploadFileResponse } from 'src/app/model/upload-file-response.model';
import { AlertService } from 'src/app/services/alert.service';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/services/file.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.page.html',
  styleUrls: ['./event-editor.page.scss'],
  standalone: false
})
export class EventEditorPage implements ViewWillEnter {

  sourceId!: string;
  eventId?: string;

  form!: FormGroup;
  showStats: boolean = true;
  attachments: string[] = [];

  public editorConfig: EditorComponent['init'];

  private event?: Event;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private eventService: EventService,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private location: Location,
    private fileService: FileService
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });

    this.editorConfig = {
      base_url: '/tinymce',
      suffix: '.min',
      plugins: 'link autolink',
      toolbar: 'bold italic | link',
      resize: false,
      menubar: false,
      language: 'es'
    }
  }

  async ionViewWillEnter() {
    this.sourceId = (await this.firebaseService.getLoggedUserId())!;
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId') ?? undefined;

    if (this.eventId) {
      this.getEvent();
    }
  }

  save() {
    if (this.form.valid) {
      const event: Event = {
        id: this.eventId,
        title: this.form.controls['title'].value,
        content: this.form.controls['content'].value,
        showStats: this.showStats,
        attachments: this.attachments
      }

      const request = !this.eventId
        ? this.eventService.postEvent(event)
        : this.eventService.putEvent(event);

      this.spinnerService.showSpinner();
      request.then(e => {
        this.back();
      }).catch(e => console.error("Error dando de alta el evento", e))
        .finally(() => this.spinnerService.closeSpinner());

    } else {
      this.form.markAllAsTouched();
    }
  }

  back() {
    this.location.back();
  }

  async addAttachment(event: any) {
    const selectedFiles: any[] = event.target.files;

    //Comprobamos el tamaño
    for (let f of selectedFiles) {
      //Si es mayor de 3MB
      if (f.size > 3145728) {
        this.alertService.showAlert("Error", "Ninguno de los ficheros puede superar los 3 MB.");
        return;
      }
    }

    //Si está todo correcto
    for (let f of selectedFiles) {
      this.spinnerService.showSpinner();

      // Leemos el fichero
      const reader = new FileReader();

      reader.onloadend = () => {
        const uploadFileRequest: S3FileContent = {
          name: f.name,
          content: reader.result as string,
          contentType: f.type
        }

        //Subimos el fichero
        this.uploadFile(uploadFileRequest);
      }

      reader.readAsDataURL(f);
    }
  }

  handleAction(action: string, url: string) {
    switch (action) {
      case 'delete':
        this.deleteFile(url);
        break;
      default:
        console.error("Action not implemented", action);
    }
  }

  private getEvent() {
    this.spinnerService.showSpinner();
    this.eventService.getEvent(this.eventId!, false)
      .then((e) => {
        this.event = e;
        this.form = new FormGroup({
          title: new FormControl(e.title, [Validators.required]),
          content: new FormControl(e.content, [Validators.required]),
        });

        this.showStats = e.showStats;
        this.attachments = e.attachments;
      }).catch(e => console.error(e))
      .finally(() => this.spinnerService.closeSpinner());
  }

  private uploadFile(uploadFileRequest: S3FileContent) {
    this.fileService.uploadFile(uploadFileRequest).then(
      (data: UploadFileResponse) => {
        this.attachments.push(data.url);
        this.updateAttachments();
      }).catch(e => {
        console.error(e);
        this.alertService.showAlert("Error", "Se ha producido un error subiendo un adjunto. Inténtelo más tarde.")
      }).finally(() => this.spinnerService.closeSpinner());
  }

  private async deleteFile(url: string) {
    const urlParts = url.split('/');
    const key = urlParts[urlParts.length - 1];

    this.spinnerService.showSpinner();
    this.fileService.deleteFile(key).then(() => {
      this.attachments = this.attachments.filter(x => x != url);
      this.updateAttachments();
    }).catch(e => {
      console.error(e);
      this.alertService.showAlert("Error", "Se ha producido un error eliminando un adjunto. Inténtelo más tarde.")
    }).finally(() => this.spinnerService.closeSpinner());
  }

  private updateAttachments() {
    if(this.event) {
      this.event.attachments = this.attachments;
      this.spinnerService.showSpinner();
      this.eventService.putEvent(this.event).catch(e => {
        console.error(e);
        this.alertService.showAlert("Error", "Se ha producido un error actualizando los adjuntos. Inténtelo más tarde.")
      }).finally(() => this.spinnerService.closeSpinner());
    }
  }

}
