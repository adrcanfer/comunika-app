import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from 'src/app/model/event.model';
import { AlertService } from 'src/app/services/alert.service';
import { EventService } from 'src/app/services/event.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-event-footer',
  templateUrl: './event-footer.component.html',
  styleUrls: ['./event-footer.component.scss'],
  standalone: false
})
export class EventFooterComponent  implements OnInit {

  @Input() event!: Event
  ownerMode: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
  ) { }

  async ngOnInit() {
    const owner = await this.firebaseService.getLoggedUserId();
    this.ownerMode = owner != undefined && this.event.source?.id == owner;
  }

}
