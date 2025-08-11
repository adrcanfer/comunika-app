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
  getsources(query: string): Promise<Sources> {
    let url = `source?name=${query}`;
    return this.apiService.doGet(url);
  }


}
