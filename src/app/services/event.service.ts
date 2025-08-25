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

  //Obtenemos un evento
  async getEvent(id: string, reading: boolean = true): Promise<Event> {
    const url = `event/${id}?reading=${reading}`;
    return this.apiService.doGet(url);
  }

  //Creamos un nuevo evento
  async postEvent(event: Event): Promise<Event> {
    const url = `event`;
    return this.apiService.doPost(url, event);
  }

  //Actualizamos un evento
  async putEvent(event: Event): Promise<Event> {
    const url = `event/${event.id}`;
    return this.apiService.doPut(url, event);
  }

  //Eliminamos un evento
  async deleteEvent(id: string): Promise<void> {
    const url = `event/${id}`;
    return this.apiService.doDelete(url);
  }

}
