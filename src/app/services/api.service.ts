import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pair } from '../model/pair.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    private firebaseService: FirebaseService
  ) { }

  doGet(path: string, queryParams?: Pair[], headers?: Pair[]): Promise<any> {
    const url = `${this.baseUrl}${path}${this.getQueryParams(queryParams)}`;
    return new Promise(async (resolve, reject) => {
      this.httpClient.get(url, {headers: await this.getHeaders(headers)}).subscribe((res: any) => resolve(res), (err) => reject(err));
    });
  }

  doPost(path: string, body: any | null, headers?: Pair[]): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    return new Promise(async (resolve, reject) => {
      this.httpClient.post(url, body, {headers: await this.getHeaders(headers)}).subscribe((res: any) => resolve(res), (err) => reject(err));
    });
  }

  doPut(path: string, body: any | null, headers?: Pair[]): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    return new Promise(async (resolve, reject) => {
      this.httpClient.put(url, body, {headers: await this.getHeaders(headers)}).subscribe((res: any) => resolve(res), (err) => reject(err));
    });
  }

  doDelete(path: string, headers?: Pair[]): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    return new Promise(async (resolve, reject) => {
      this.httpClient.delete(url, {headers: await this.getHeaders(headers)}).subscribe((res: any) => resolve(res), (err) => reject(err));
    });
  }

  private getQueryParams(params?: Pair[]) {
    let queryParams = "";

    if(params && params.length > 0) {
      for(let i = 0; i < params.length; i++) {
        queryParams += i == 0 ? '?' : "&";
        queryParams += `${params[i].key}=${params[i].value}`
      }
    }
    return queryParams;
  }

  private async getHeaders(headers?: Pair[] ) {
    let res = new HttpHeaders();
    headers?.forEach(h => res = res.append(h.key, h.value));
    
    const loggedUser = await this.firebaseService.getLoggedUser();
    if(loggedUser) {
      res = res.append("Authorization", `Bearer ${loggedUser}`);
    }

    return res;
  }
}
