import { Component, OnInit } from '@angular/core';
import { GetResult, Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';
import { Source } from 'src/app/model/source.model';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';
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
    private spinnerService: SpinnerService
  ) { }

  async ionViewWillEnter() {
    //Recuperar los elementos guardados de las preferencias
    this.loadSavedSubscriptions();


  }

  searchInput(event: any) {
    this.searchKey = event.detail.value;
    this.sources = new Map();
    this.processSources();
  }

  search() {
    if(this.searchKey.length > 0) {
      this.spinnerService.showSpinner();
      this.sourceService.getsources(this.searchKey)
        .then(value => {
          this.sources = new Map();
          value.items.forEach(s => this.sources.set(s.id!, s));
          this.processSources();
        })
        .finally(() => this.spinnerService.closeSpinner());
    }
  }

  updateSourceElement(updatedSource: Source) {
    if(updatedSource.selected) {
      this.selectedSources.set(updatedSource.id!, updatedSource);
    } else {
      this.selectedSources.delete(updatedSource.id!);
    }

    this.processSources();
  }

  private processSources() {
    if(this.selectedSources.size == 0 && this.sources.size == 0) {
      this.sourcesToShow = undefined;
      return;
    }

    this.sourcesToShow = [];

    //Marcamos los sources seleccionados
    this.sources.forEach(s => s.selected = this.selectedSources.has(s.id!));

    //Añadimos solos los sources seleccionados que no se encuentran en la busqueda
    this.selectedSources.forEach(s => {
      if(!this.sources.has(s.id!)) {
        this.sourcesToShow!.push(s);
      }
    });    

    //Añadimos los sources
    this.sourcesToShow.push(...this.sources.values());

    // Habilitamos el boton de guardar
    this.showSaveButton = Array.from(this.selectedSources.values()).find(s => !this.savedSources.has(s.id!)) != undefined;
  }

  async save() {
    //Guardar en las preferencias
    const subscribedSources = [...this.selectedSources.values()];
    await Preferences.set({key: PreferenceConstants.subscribedSources, value: JSON.stringify(subscribedSources)});

    //Guardar en el backend
    
  }

  private async loadSavedSubscriptions() {
    const subscriptionsStr = (await Preferences.get({key: PreferenceConstants.subscribedSources}))?.value;

    if(subscriptionsStr) {
      const subscriptions: Source[] = JSON.parse(subscriptionsStr);

      this.savedSources = new Map();
      this.selectedSources = new Map();
      subscriptions.forEach(s => {
        this.savedSources.set(s.id!, s);
        this.selectedSources.set(s.id!, s);
      });

      this.processSources();
    }
  }

}
