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
  async getEvents(sourceId: string, limit: number, lastKey?: string): Promise<Events> {
    let url = `event?sourceId=${sourceId}&limit=${limit}`;

    if(lastKey != undefined) {
      url += `&lastKey=${lastKey}`;
    }

    return this.apiService.doGet(url);
  }

  async getEvent(id: string): Promise<Event> {
    const url = `event/${id}`;
    return this.apiService.doGet(url);
  }

}
