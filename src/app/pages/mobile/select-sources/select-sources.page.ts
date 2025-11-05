import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';
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

  searchFormControl: FormControl = new FormControl('', [])
  sourcesToShow?: Source[];
  showSaveButton = false;
  searchError: string = 'Búsqueda inválida'

  private sources?: Map<string, Source>;
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
    this.searchFormControl.setValue('');
    this.searchFormControl.clearValidators();
    this.searchFormControl.updateValueAndValidity();
    this.savedSources = new Map();
    this.selectedSources = new Map();

    //Recuperar los elementos guardados de las preferencias
    await this.loadSavedSubscriptions();

    this.processSources();
  }

  searchInput() {
    this.sources = undefined;
    if(this.searchFormControl.value.length == 0) {
      this.searchFormControl.clearValidators();
      this.searchFormControl.updateValueAndValidity();
    }
    this.processSources();
  }

  search() {
    this.searchFormControl.setValidators(this.searchValidator());
    this.searchFormControl.updateValueAndValidity();
    this.searchFormControl.markAsTouched();

    const searchKey = this.searchFormControl.value;
    if (this.searchFormControl.valid) {
      this.spinnerService.showSpinner();

      const sourcesPromise = searchKey.startsWith('#') 
        ? this.sourceService.getSourceByShortId(searchKey.substring(1))
        : this.sourceService.getSources(searchKey);
      sourcesPromise
        .then(value => {
          this.sources = new Map();
          value.items.forEach(s => this.sources!.set(s.id!, s));
          this.processSources();
        })
        .finally(() => this.spinnerService.closeSpinner());
    } else {
      this.sources = undefined;
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
    if (this.selectedSources.size == 0 && !this.sources) {
      this.sourcesToShow = undefined;
    } else if(this.selectedSources.size == 0 && this.sources!.size == 0) {
      this.sourcesToShow = [];
    } else {
      this.sourcesToShow = [];

      //Marcamos los sources seleccionados
      this.sources?.forEach(s => s.selected = this.selectedSources.has(s.id!));

      //Añadimos solos los sources seleccionados que no se encuentran en la busqueda
      this.selectedSources.forEach(s => {
        if (!this.sources || !this.sources!.has(s.id!)) {
          this.sourcesToShow!.push(s);
        }
      });

      //Añadimos los sources
      if(this.sources) {
        this.sourcesToShow.push(...this.sources.values());
      }

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

  searchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const searchKey = control.value as string;
  
      // Permitir vacío para un buscador (a menos que se añada Validators.required)
      if (!searchKey) {
        return null;
      }
  
      const isID = searchKey.startsWith('#');
      const length = searchKey.length;
  
      let isValid = true;
  
      if (!isID && length < 5) {
        this.searchError = 'El texto de búsqueda debe tener al menos 5 caracteres.';
        isValid = false;
      } else if (isID && length != 7) {
        this.searchError = 'Identificador inválido. Debe tener exactamente 7 caracteres, incluyendo el "#". (Ej: #ABC123)';
        isValid = false;
      } else {
        this.searchError = '';
        isValid = true;
      }
      
      // Si es inválido, devolvemos el error con un mensaje descriptivo
      return !isValid ? { 
          invalidSearch: { 
              message: this.searchError 
          } 
      } : null;
    };
  }

}
