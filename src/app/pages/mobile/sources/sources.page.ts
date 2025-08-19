import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';
import { sortAlfaphetically, Source } from 'src/app/model/source.model';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { PreferenceConstants } from 'src/app/utils/preferences.util';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.page.html',
  styleUrls: ['./sources.page.scss'],
  standalone: false
})
export class SourcesPage implements ViewWillEnter {

  action: string = 'events';
  sources?: Source[];

  constructor(
    private activedRouter: ActivatedRoute,
    private sourceService: SourceService,
    private spinnerService: SpinnerService
  ) { }

  ionViewWillEnter() {
    this.action = this.activedRouter.snapshot.paramMap.get('action') ?? this.action;
    console.log(this.action);

    this.getSources();
  }

  async getSources() {
    const subscriptionsStr = (await Preferences.get({key: PreferenceConstants.subscribedSources}))?.value;
    
    if(subscriptionsStr) {
      this.spinnerService.showSpinner();
      const sourceIds = JSON.parse(subscriptionsStr);

      this.sourceService.getSourcesBatch(sourceIds)
      .then(s => {
        this.sources = s.items;
        sortAlfaphetically(this.sources);
      }).finally(() => this.spinnerService.closeSpinner());
    }
  }

  getTitle() {
    switch(this.action) {
      case 'events': 
        return "Notificaciones";
      case 'calendar': 
        return "Calendario"
      default:
        return this.action;
    }
  }

}
