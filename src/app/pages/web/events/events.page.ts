import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Event } from "src/app/model/event.model";
import { EventService } from 'src/app/services/event.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false
})
export class EventsPage implements ViewWillEnter {

  events?: Event[]
  endInfiniteScroll = false;
  loggedUser: boolean = false;

  private sourceId: string = '';
  private lastKey?: string;

  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private spinnerService: SpinnerService
  ) { }

  async ionViewWillEnter() {
    const sourceId = this.activatedRoute.snapshot.paramMap.get('sourceId');

    if(sourceId) {
      this.sourceId = sourceId;
      this.loggedUser = false;
    } else {
      const uuid = await this.firebaseService.getLoggedUserId();
      this.sourceId = uuid!;
      this.loggedUser = true;
    }

    this.getEvents(true, true);
  }

  loadNextContent(event?: any) {
    this.getEvents(false, false, event);
  }

  private getEvents(first: boolean = true, refresh: boolean = false, event?: any) {
    if(first) this.spinnerService.showSpinner();

    if(refresh) {
      this.lastKey = undefined;
    }

    this.eventService.getEvents(this.sourceId, 10, this.lastKey)
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
