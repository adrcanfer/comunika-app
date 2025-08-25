import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Event } from 'src/app/model/event.model';
import { EventService } from 'src/app/services/event.service';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private location: Location
  ) { 
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }

  async ionViewWillEnter() {
    this.sourceId = (await this.firebaseService.getLoggedUserId())!;
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId') ?? undefined;

    if(this.eventId) {
      this.getEvent();
    }
  }

  save() {
    if(this.form.valid) {
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
          this.location.back();
        }).catch(e => console.error("Error dando de alta el evento", e))
        .finally(() => this.spinnerService.closeSpinner());
     
    } else {
      this.form.markAllAsTouched();
    }
  }

  private getEvent() {
    this.spinnerService.showSpinner();
    this.eventService.getEvent(this.eventId!, false)
      .then((e) => {
        this.form = new FormGroup({
          title: new FormControl(e.title, [Validators.required]),
          content: new FormControl(e.content, [Validators.required]),
        });

        this.showStats = e.showStats;
        this.attachments = e.attachments;
      }).catch(e => console.error(e))
      .finally(() => this.spinnerService.closeSpinner());
  }

}
