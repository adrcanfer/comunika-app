import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { sortAlfaphetically, Source } from 'src/app/model/source.model';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { PreferenceConstants } from 'src/app/utils/preferences.util';

@Component({
  selector: 'app-select-sources',
  templateUrl: './select-sources.page.html',
  styleUrls: ['./select-sources.page.scss'],
  standalone: false
})
export class SelectSourcesPage implements ViewWillEnter {

  searchKey: string = '';
  sourcesToShow?: Source[];
  showSaveButton = false;

  private sources: Map<string, Source> = new Map();
  private selectedSources: Map<string, Source> = new Map();
  private savedSources: Map<string, Source> = new Map();

  constructor(
    private sourceService: SourceService,
    private subscriptionService: SubscriptionService,
    private spinnerService: SpinnerService,
    private router: Router,
    private location: Location
  ) { }

  async ionViewWillEnter() {
    this.searchKey = '';
    this.savedSources = new Map();
    this.selectedSources = new Map();
    this.sources = new Map();

    //Recuperar los elementos guardados de las preferencias
    await this.loadSavedSubscriptions();

    this.processSources();
  }

  searchInput(event: any) {
    this.searchKey = event.detail.value;
    this.sources = new Map();
    this.processSources();
  }

  search() {
    if (this.searchKey.length > 0) {
      this.spinnerService.showSpinner();

      const sourcesPromise = this.searchKey.startsWith('#') 
        ? this.sourceService.getSourceByShortId(this.searchKey.substring(1))
        : this.sourceService.getSources(this.searchKey);
      sourcesPromise
        .then(value => {
          this.sources = new Map();
          value.items.forEach(s => this.sources.set(s.id!, s));
          this.processSources();
        })
        .finally(() => this.spinnerService.closeSpinner());
    }
  }

  updateSourceElement(updatedSource: Source) {
    if (updatedSource.selected) {
      this.selectedSources.set(updatedSource.id!, updatedSource);
    } else {
      this.selectedSources.delete(updatedSource.id!);
    }

    this.processSources();
  }

  private processSources() {
    if (this.selectedSources.size == 0 && this.sources.size == 0) {
      this.sourcesToShow = undefined;
    } else {
      this.sourcesToShow = [];

      //Marcamos los sources seleccionados
      this.sources.forEach(s => s.selected = this.selectedSources.has(s.id!));

      //Añadimos solos los sources seleccionados que no se encuentran en la busqueda
      this.selectedSources.forEach(s => {
        if (!this.sources.has(s.id!)) {
          this.sourcesToShow!.push(s);
        }
      });

      //Añadimos los sources
      this.sourcesToShow.push(...this.sources.values());

    }

    // Habilitamos el boton de guardar
    this.showSaveButton =
      Array.from(this.selectedSources.values()).find(s => !this.savedSources.has(s.id!)) != undefined
      || Array.from(this.savedSources.values()).find(s => !this.selectedSources.has(s.id!)) != undefined;
  }

  async save() {
    //Guardar en las preferencias
    const subscribedSources = [...this.selectedSources.values()];
    const subscribedSourceIds = subscribedSources.map(x => x.id!);

    if (subscribedSourceIds.length == 0) {
      await Preferences.remove({ key: PreferenceConstants.subscribedSources });
    } else {
      await Preferences.set({ key: PreferenceConstants.subscribedSources, value: JSON.stringify(subscribedSourceIds) });
    }

    //Recuperamos el token de push
    const pushToken = (await Preferences.get({ key: PreferenceConstants.pushToken }))?.value || undefined;

    //Guardar en el backend
    if (pushToken) {
      const subscribedSoruceIds = subscribedSources.map(s => s.id!);
      this.spinnerService.showSpinner();
      this.subscriptionService.postSubscriptions(subscribedSoruceIds, pushToken)
        .finally(() => {
          this.spinnerService.closeSpinner();
          this.router.navigateByUrl('mobile/sources/events');
        });
    } else {
      //Redirijimos al listado de noticias
      this.router.navigateByUrl('mobile/sources/events');
    }

  }

  back() {
    this.location.back();
  }

  private async loadSavedSubscriptions() {
    const subscriptionsStr = (await Preferences.get({ key: PreferenceConstants.subscribedSources }))?.value;

    if (subscriptionsStr) {
      this.spinnerService.showSpinner();
      const sourceIds = JSON.parse(subscriptionsStr);

      const subscribedSources: Source[] = (await this.sourceService.getSourcesBatch(sourceIds)).items;
      subscribedSources.forEach(s => s.selected = true);
      sortAlfaphetically(subscribedSources);

      subscribedSources.forEach(s => {
        this.savedSources.set(s.id!, s);
        this.selectedSources.set(s.id!, s);
      });

      this.spinnerService.closeSpinner();
    }
  }

}
