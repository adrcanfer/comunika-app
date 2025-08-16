import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Sources } from '../model/sources.model';

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

  // Método encargado de recuperar los sources
  getSourcesBatch(sourceIds: string): Promise<Sources> {
    let url = `source/batch/search`;
    const body = {sourceIds}
    return this.apiService.doPost(url, body);
  }
}
