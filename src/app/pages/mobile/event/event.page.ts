import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/model/event.model';
import { EventService } from 'src/app/services/event.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: false
})
export class EventPage implements OnInit {

  eventDetail?: Event;

  constructor(
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private activedRouter: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    const eventId = this.activedRouter.snapshot.paramMap.get('eventId')
    console.log(eventId);

    if(eventId) {
      this.spinnerService.showSpinner();
      this.eventService.getEvent(eventId)
        .then(e => this.eventDetail = e)
        .finally(() => this.spinnerService.closeSpinner());
    }
  }


  back() {
    this.location.back();
  }

}
