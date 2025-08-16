import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { PreferenceConstants } from '../utils/preferences.util';
import { Source } from '../model/source.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private apiService: ApiService) { }

  async getSubscriptionsIdFromStorage() {
    const subscriptionsStr = (await Preferences.get({key: PreferenceConstants.subscribedSources}))?.value;
    let response: string[] = [];

    if(subscriptionsStr) {
      response = JSON.parse(subscriptionsStr);
     
    }
    return response;
  }

  postSubscriptions(sourceIds: string[], pushToken: string) {
    let url = `subscription`;
    const body = {sourceIds, pushToken};
    return this.apiService.doPost(url, body);
  }

}
