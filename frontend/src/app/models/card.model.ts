export interface Card {
  cardId: number;
  cardType: 'CREDIT' | 'DEBIT';
  cardName: string;
  cardIssuerCompany: 'Visa' | 'Mastercard' | 'Rupay';
  cardNumber: string;
  accountNumber: string;
}

export interface CreateCardRequest {
  cardType: 'CREDIT' | 'DEBIT';
  cardName: string;
  cardIssuerCompany: 'Visa' | 'Mastercard' | 'Rupay';
  accountNumber: string;
}

export interface CardSearchResponse {
  cards: Card[];
}