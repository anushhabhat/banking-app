import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccountRequest, TransferRequest } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly ACCOUNT_API_URL = 'http://localhost:8081/api/v1/account';
  private readonly TRANSFER_API_URL = 'http://localhost:8086/api/transactions';

  constructor(private http: HttpClient) {}

  getUserAccounts(userId: number): Observable<Account[]> {
    const timestamp = new Date().getTime();
    return this.http.get<Account[]>(`${this.ACCOUNT_API_URL}/user/${userId}?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  }
  // getAccounts(): Observable<Account[]> {
  //   return this.http.get<Account[]>(`${this.ACCOUNT_API_URL}/all`);
  // }

  createAccount(accountData: CreateAccountRequest): Observable<any> {
    return this.http.post(`${this.ACCOUNT_API_URL}/create`, accountData);
  }

  deleteAccount(accountId: number): Observable<any> {
    return this.http.delete(`${this.ACCOUNT_API_URL}/${accountId}`);
  }

  transferFunds(transferData: TransferRequest): Observable<any> {
  return this.http.post(this.TRANSFER_API_URL, transferData, {
    headers: {
      'Accept': 'application/json'
    },
    responseType: 'text' as const 
  }
);
}
}