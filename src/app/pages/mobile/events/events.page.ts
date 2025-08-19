import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Event } from "src/app/model/event.model";
import { EventService } from 'src/app/services/event.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false
})
export class EventsPage implements ViewWillEnter {

  events?: Event[]
  endInfiniteScroll = false;

  private lastKey?: string;
  private sourceId!: string;

  constructor(
    private activedRouter: ActivatedRoute,
    private spinnerService: SpinnerService,
    private eventService: EventService,
    private location: Location
  ) { }

  async ionViewWillEnter() {
    this.sourceId = this.activedRouter.snapshot.paramMap.get('sourceId') ?? '';
    console.log(this.sourceId);

    if(!this.events) {
      this.getEvents(true, true);
    }
  }

  loadNextContent(event?: any) {
    this.getEvents(false, false, event);
  }

  refreshContent(event: any) {
    this.lastKey = undefined;
    this.getEvents(false, true, event);
  }

  back() {
    this.location.back();
  }

  private getEvents(first: boolean = true, refresh: boolean = false, event?: any) {
    if(first) this.spinnerService.showSpinner();

    if(refresh) {
      this.lastKey = undefined;
    }

    this.eventService.getEvents(this.sourceId, this.lastKey)
      .then(async data => {    
        if(first || refresh) this.events = [];
            
        this.events!.push(...data.items);
        this.lastKey = data.lastKey;
        this.endInfiniteScroll = this.lastKey == null || data.items.length == 0;
      })
      .catch(err => console.error(err))
      .finally(() => {
        if(first) this.spinnerService.closeSpinner();
        if(event) event.target.complete();
      });
  }

}
