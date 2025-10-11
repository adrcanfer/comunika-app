import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Transactions } from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private apiService: ApiService
  ) { }

  // Método encargado de obtener la sessión
  async getPortalSessionUrl(): Promise<any> {
    let url = `payment/portal-session`;
    return this.apiService.doGet(url);
  }

  // Método encargado de obtener las últimas transacciones
  async getTransactions(): Promise<Transactions> {
    let url = `payment/transaction`;
    return this.apiService.doGet(url);
  }


}
