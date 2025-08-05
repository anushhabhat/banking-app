import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CreateCardRequest } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly API_URL = 'http://localhost:8084/api/v1/cards';

  constructor(private http: HttpClient) {}

  createCard(cardData: CreateCardRequest): Observable<any> {
    return this.http.post(this.API_URL, cardData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  getCardsByAccount(accountNumber: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.API_URL}/account/${accountNumber}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${cardId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}