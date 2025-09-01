import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';
import { PreferenceConstants } from 'src/app/utils/preferences.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements ViewWillEnter {
  public loading: boolean = true;

  constructor(
    private router: Router,
  ) { }

  async ionViewWillEnter() {
    this.loading = true;
    const hasSubscribedSources = (await Preferences.get({key: PreferenceConstants.subscribedSources}))?.value != undefined;

    if(hasSubscribedSources) {
      this.router.navigateByUrl('/mobile/sources/events')
    } else {
      this.loading = false;
    }
  }

  navigateToSelectSources() {
    this.router.navigateByUrl('/mobile/select-sources');
  }

}
