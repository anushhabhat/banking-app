import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';
import { Card, CreateCardRequest } from '../../models/card.model';

@Component({
  selector: 'app-card-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [class.show]="isVisible">
      <div class="modal-content max-w-6xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Card Management</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Search Cards Section -->
          <div class="bg-gray-50 p-8 rounded-xl card-shadow">
            <h3 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search Cards
            </h3>
            <div class="mb-6">
              <label for="searchAccountNumber" class="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input 
                type="text" 
                [(ngModel)]="searchAccountNumber"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                placeholder="Enter account number to search cards"
                (keypress)="onSearchKeyPress($event)">
              <button 
                (click)="searchCards()"
                [disabled]="isSearching"
                class="btn-primary mt-4 text-white font-semibold py-2 px-4 rounded-full w-full disabled:opacity-50">
                <span *ngIf="isSearching" class="loading"></span>
                Search Cards
              </button>
            </div>
            <div class="mt-6">
              <div *ngIf="searchedCards.length === 0 && hasSearched && !isSearching" class="empty-state">
                <div class="empty-state-icon">💳</div>
                <h4 class="text-lg font-semibold text-gray-800">No cards found</h4>
                <p>No cards are associated with this account number.</p>
              </div>
              <div *ngIf="searchedCards.length > 0">
                <h4 class="text-lg font-semibold mb-4 text-gray-800">Found {{ searchedCards.length }} card(s)</h4>
                <div class="space-y-4">
                  <div *ngFor="let card of searchedCards" class="bg-white p-6 rounded-md card-shadow">
                    <div class="flex justify-between items-center mb-4">
                      <span class="inline-block bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                        {{ card.cardType || 'N/A' }}
                      </span>
                      <span class="text-lg font-semibold text-gray-800">
                        {{ card.cardIssuerCompany || 'Unknown' }}
                      </span>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600 font-medium">Name on Card:</span>
                        <span class="font-mono">{{ card.cardName || 'N/A' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600 font-medium">Card Number:</span>
                        <span class="font-mono">{{ formatCardNumber(card.cardNumber) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600 font-medium">Card Type:</span>
                        <span class="font-mono">{{ card.cardType || 'N/A' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600 font-medium">Card Provider:</span>
                        <span class="font-mono">{{ card.cardIssuerCompany || 'N/A' }}</span>
                      </div>
                    </div>
                    <button 
                      *ngIf="card.cardId"
                      (click)="deleteCard(card.cardId)"
                      class="btn-danger text-white font-semibold py-2 px-4 rounded-full w-full mt-4">
                      Delete Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Issue New Card Section -->
          <div class="bg-gray-50 p-8 rounded-xl card-shadow">
            <h3 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9H19.5m-16.5 5.25h16.5m-13.5-9L12 3l9.75 6.75" />
              </svg>
              Issue New Card
            </h3>
            
            <!-- Card Preview -->
            <div class="card-display mb-6">
              <div class="credit-card" [ngClass]="getCardClass()">
                <div class="chip"></div>
                <div class="card-number">•••• •••• •••• ••••</div>
                <div class="card-info">
                  <div class="card-name">{{ previewName || 'CUSTOMER NAME' }}</div>
                  <div class="card-logo">{{ previewLogo || 'CREDIT' }}</div>
                </div>
              </div>
            </div>

            <form (ngSubmit)="createCard()" #cardForm="ngForm" class="space-y-4">
              <div>
                <label for="cardType" class="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select 
                  [(ngModel)]="newCard.cardType"
                  name="cardType"
                  (change)="updatePreview()"
                  class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  required>
                  <option value="">Select Card Type</option>
                  <option value="CREDIT">Credit Card</option>
                  <option value="DEBIT">Debit Card</option>
                </select>
              </div>
              <div>
                <label for="cardName" class="block text-sm font-medium text-gray-700 mb-2">Card Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCard.cardName"
                  name="cardName"
                  (input)="updatePreview()"
                  class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  placeholder="Enter name on card" 
                  required>
              </div>
              <div>
                <label for="cardIssuerCompany" class="block text-sm font-medium text-gray-700 mb-2">Card Issuer Company</label>
                <select 
                  [(ngModel)]="newCard.cardIssuerCompany"
                  name="cardIssuerCompany"
                  (change)="updatePreview()"
                  class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  required>
                  <option value="">Select Issuer</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Rupay">RuPay</option>
                </select>
              </div>
              <div>
                <label for="accountNumber" class="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCard.accountNumber"
                  name="accountNumber"
                  class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  placeholder="Enter account number" 
                  required>
              </div>
              <button 
                type="submit" 
                [disabled]="isCreating"
                class="btn-primary text-white font-semibold py-2 px-4 rounded-full w-full disabled:opacity-50">
                <span *ngIf="isCreating" class="loading"></span>
                Issue Card
              </button>
            </form>
            
            <div *ngIf="createMessage" 
                 [class]="createMessageType === 'success' ? 'mt-4 p-3 bg-green-100 text-green-700 rounded-md' : 'mt-4 p-3 bg-red-100 text-red-700 rounded-md'">
              {{ createMessage }}
            </div>
          </div>
        </div>

        <button 
          (click)="onClose.emit()"
          class="btn-secondary mt-6 font-semibold py-2 px-4 rounded-full w-full">
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .credit-card {
      width: 380px;
      height: 240px;
      border-radius: 20px;
      padding: 30px;
      position: relative;
      overflow: hidden;
      margin: 0 auto;
      transform-style: preserve-3d;
      transition: all 0.3s ease;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
    .credit-card:hover {
      transform: rotateY(5deg) rotateX(5deg);
    }
    .credit-card.visa {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
    }
    .credit-card.mastercard {
      background: linear-gradient(135deg, #eb001b, #f79e1b);
    }
    .credit-card.rupay {
      background: linear-gradient(135deg, #002d62, #00aeef);
    }
    .credit-card.credit {
      background: linear-gradient(135deg, #2563eb, #1e40af);
    }
    .chip {
      width: 50px;
      height: 35px;
      background: #ffd700;
      border-radius: 8px;
      position: absolute;
      top: 30px;
      left: 30px;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    .card-number {
      font-family: 'Courier New', monospace;
      font-size: 24px;
      letter-spacing: 4px;
      margin: 60px 0 20px 0;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .card-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .card-name {
      font-size: 18px;
      font-weight: 600;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
    }
    .card-logo {
      font-size: 28px;
      font-weight: 900;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 10px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #718096;
    }
    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }
  `]
})
export class CardModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  searchAccountNumber: string = '';
  searchedCards: Card[] = [];
  hasSearched: boolean = false;
  isSearching: boolean = false;
  isCreating: boolean = false;
  createMessage: string = '';
  createMessageType: 'success' | 'error' = 'error';

  newCard: CreateCardRequest = {
    cardType: 'CREDIT',
    cardName: '',
    cardIssuerCompany: 'Visa',
    accountNumber: ''
  };

  previewName: string = '';
  previewLogo: string = '';

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.updatePreview();
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchCards();
    }
  }

  searchCards(): void {
    if (!this.searchAccountNumber.trim()) {
      this.showCreateMessage('Please enter an account number', 'error');
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;

    this.cardService.getCardsByAccount(this.searchAccountNumber.trim()).subscribe({
      next: (cards) => {
        this.searchedCards = cards || [];
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search failed:', error);
        if (error.status === 404) {
          this.searchedCards = [];
        } else {
          this.showCreateMessage('Error: ' + (error.error?.message || error.message), 'error');
        }
        this.isSearching = false;
      }
    });
  }

  createCard(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isCreating = true;
    this.createMessage = '';

    this.cardService.createCard(this.newCard).subscribe({
      next: (response) => {
        this.showCreateMessage('Card issued successfully!', 'success');
        this.resetForm();
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Failed to issue card';
        this.showCreateMessage('Error: ' + errorMessage, 'error');
        this.isCreating = false;
      },
      complete: () => {
        this.isCreating = false;
      }
    });
  }

  deleteCard(cardId: number): void {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    this.cardService.deleteCard(cardId).subscribe({
      next: () => {
        this.showCreateMessage('Card deleted successfully!', 'success');
        if (this.searchAccountNumber) {
          this.searchCards();
        }
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Failed to delete card';
        this.showCreateMessage('Error: ' + errorMessage, 'error');
      }
    });
  }

  updatePreview(): void {
    this.previewName = this.newCard.cardName.toUpperCase() || 'CUSTOMER NAME';
    this.previewLogo = this.newCard.cardIssuerCompany?.toUpperCase() || this.newCard.cardType || 'CREDIT';
  }

  getCardClass(): string {
    if (this.newCard.cardIssuerCompany) {
      return this.newCard.cardIssuerCompany.toLowerCase();
    }
    return 'credit';
  }

  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) return '**** **** **** ****';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  }

  private validateForm(): boolean {
    if (!this.newCard.cardType) {
      this.showCreateMessage('Please select a card type', 'error');
      return false;
    }
    if (!this.newCard.cardName.trim()) {
      this.showCreateMessage('Please enter the name on card', 'error');
      return false;
    }
    if (!this.newCard.cardIssuerCompany) {
      this.showCreateMessage('Please select a card issuer', 'error');
      return false;
    }
    if (!this.newCard.accountNumber.trim()) {
      this.showCreateMessage('Please enter an account number', 'error');
      return false;
    }
    return true;
  }

  private showCreateMessage(text: string, type: 'success' | 'error'): void {
    this.createMessage = text;
    this.createMessageType = type;
    
    setTimeout(() => {
      this.createMessage = '';
    }, 5000);
  }

  private resetForm(): void {
    this.newCard = {
      cardType: 'CREDIT',
      cardName: '',
      cardIssuerCompany: 'Visa',
      accountNumber: ''
    };
    this.updatePreview();
  }
}