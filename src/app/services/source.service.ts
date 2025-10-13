import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Sources } from '../model/sources.model';
import { Source } from '../model/source.model';
import { Account } from '../model/account.model';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(
    private apiService: ApiService
  ) { }

  // Método encargado de buscar los sources
  getSources(query: string): Promise<Sources> {
    let url = `source?name=${query}`;
    return this.apiService.doGet(url);
  }

  // Método encargado de buscar el source por shortId
  getSourceByShortId(shortId: string): Promise<Sources> {
    let url = `source/short-id/${shortId}`;
    return this.apiService.doGet(url);
  }
  // Método encargado de recuperar los sources
  getSourcesBatch(sourceIds: string): Promise<Sources> {
    let url = `source/batch/search`;
    const body = {sourceIds}
    return this.apiService.doPost(url, body);
  }

  // Método encargado de crear un source
  postSource(source: Source): Promise<void> {
    let url = `source`;
    return this.apiService.doPost(url, source);
  }

  // Método encargado de crear un source
  putSource(source: Source): Promise<void> {
    let url = `source`;
    return this.apiService.doPut(url, source);
  }

  // Método encargado de recuperar la cuenta
  getAccount(): Promise<Account> {
    let url = `account`;
    return this.apiService.doGet(url);
  }
}
