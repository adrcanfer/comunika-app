import { Injectable } from '@angular/core';
import { Events } from '../model/events.model';
import { Event } from '../model/event.model';
import { ApiService } from './api.service';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private apiService: ApiService,
    private subscriptionService: SubscriptionService
  ) { }

  // Método encargado de buscar los eventos
  async getEvents(lastKey?: string): Promise<Events> {
    let url = `event/search`;

    if(lastKey != undefined) {
      url += `?lastKey=${lastKey}`;
    }

    const requestBody = {
      sources: (await this.subscriptionService.getSubscriptionsIdFromStorage())
    }

    return this.apiService.doPost(url, requestBody);
  }

  async getEvent(id: string): Promise<Event> {
    const url = `event/${id}`;
    return this.apiService.doGet(url);
  }

}
