import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Event } from "src/app/model/event.model";
import { Preferences } from '@capacitor/preferences';
import { PreferenceConstants } from 'src/app/utils/preferences.util';
import { Router } from '@angular/router';


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

  constructor(
    private spinnerService: SpinnerService,
    private eventService: EventService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    const hasSubscribedSources = (await Preferences.get({key: PreferenceConstants.subscribedSources}))?.value != undefined;

    if(!hasSubscribedSources) {
      this.router.navigateByUrl('/mobile/home');
      return;
    } 

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

  private getEvents(first: boolean = true, refresh: boolean = false, event?: any) {
    if(first) this.spinnerService.showSpinner();

    if(refresh) {
      this.lastKey = undefined;
    }

    this.eventService.getEvents(this.lastKey)
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
