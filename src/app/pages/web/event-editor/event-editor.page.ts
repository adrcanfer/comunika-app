import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private eventService: EventService,
    private spinnerService: SpinnerService
  ) { }

  async ionViewWillEnter() {
    this.sourceId = (await this.firebaseService.getLoggedUserId())!;
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId') ?? undefined;

    if(this.eventId) {
      this.spinnerService.showSpinner();
    }
  }

}
