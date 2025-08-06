import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-card-service',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="card-service-container">
      <div class="hero-section">
        <h1 class="hero-title">Card Management</h1>
        <p class="hero-subtitle">Issue and manage your credit and debit cards with advanced security</p>
      </div>

      <div class="content-grid">
        <!-- Search Cards Section -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">🔍</div>
            <h2 class="card-title">Search Cards</h2>
          </div>
          
          <div class="search-section">
            <div class="form-group">
              <label class="form-label">Account Number</label>
              <input 
                type="text" 
                [(ngModel)]="searchAccountNumber"
                class="form-input"
                placeholder="Enter account number to search cards">
            </div>
            <button class="action-btn" (click)="searchCards()" [disabled]="isLoading">
              <span *ngIf="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Searching...' : 'Search Cards' }}
            </button>
          </div>
          
          <div class="cards-list">
            <div *ngIf="searchedCards.length === 0 && hasSearched" class="empty-state">
              <div class="empty-icon">💳</div>
              <p>No cards found for this account</p>
            </div>
            
            <div *ngFor="let card of searchedCards" class="card-item">
              <div class="card-preview" [ngClass]="getCardClass(card.cardIssuerCompany)">
                <div class="card-chip"></div>
                <div class="card-number">•••• •••• •••• {{ getLastFourDigits(card.cardNumber) }}</div>
                <div class="card-info">
                  <div class="card-name">{{ card.cardName || 'CARD HOLDER' }}</div>
                  <div class="card-logo">{{ card.cardIssuerCompany || 'BANK' }}</div>
                </div>
              </div>
              
              <div class="card-details">
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span class="detail-value">{{ card.cardType }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Provider:</span>
                  <span class="detail-value">{{ card.cardIssuerCompany }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">{{ card.cardName }}</span>
                </div>
              </div>
              
              <button *ngIf="card.cardId" class="delete-btn" (click)="deleteCard(card.cardId)">
                Delete Card
              </button>
            </div>
          </div>
        </div>

        <!-- Issue New Card Section -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">💳</div>
            <h2 class="card-title">Issue New Card</h2>
          </div>
          
          <!-- Card Preview -->
          <div class="card-preview-container">
            <div class="card-preview" [ngClass]="getPreviewCardClass()">
              <div class="card-chip"></div>
              <div class="card-number">•••• •••• •••• ••••</div>
              <div class="card-info">
                <div class="card-name">{{ newCard.cardName.toUpperCase() || 'CUSTOMER NAME' }}</div>
                <div class="card-logo">{{ newCard.cardIssuerCompany.toUpperCase() || newCard.cardType || 'CREDIT' }}</div>
              </div>
            </div>
          </div>
          
          <form (ngSubmit)="issueCard()" class="card-form">
            <div class="form-group">
              <label class="form-label">Card Type</label>
              <select [(ngModel)]="newCard.cardType" name="cardType" class="form-input" required>
                <option value="">Select Card Type</option>
                <option value="CREDIT">Credit Card</option>
                <option value="DEBIT">Debit Card</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Card Name</label>
              <input 
                type="text" 
                [(ngModel)]="newCard.cardName"
                name="cardName"
                class="form-input"
                placeholder="Enter name on card"
                required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Card Issuer Company</label>
              <select [(ngModel)]="newCard.cardIssuerCompany" name="cardIssuerCompany" class="form-input" required>
                <option value="">Select Issuer</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Rupay">RuPay</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Account Number</label>
              <input 
                type="text" 
                [(ngModel)]="newCard.accountNumber"
                name="accountNumber"
                class="form-input"
                placeholder="Enter account number"
                required>
            </div>
            
            <button type="submit" class="submit-btn" [disabled]="isLoading">
              <span *ngIf="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Issuing Card...' : 'Issue Card' }}
            </button>
          </form>
          
          <div *ngIf="message" class="message" [class.error]="isError" [class.success]="!isError">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-service-container {
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #0f0f0f 100%);
      padding: 2rem;
    }
    
    .hero-section {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      color: #cccccc;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .service-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .card-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }
    
    .card-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    
    .search-section {
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      color: #ffffff;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .form-input {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 12px;
      color: #ffffff;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #666;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .form-input::placeholder {
      color: #888;
    }
    
        select.form-input {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-color: #1a1a1a;
      color: #ffffff;
      border: 1px solid #333;
      padding: 10px;
      font-size: 14px;
      background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
      background-repeat: no-repeat;
      background-position-x: calc(100% - 10px);
      background-position-y: center;
      padding-right: 30px;
    }

    select.form-input option {
      background-color: #1a1a1a;
      color: #ffffff;
    }
    
    .action-btn, .submit-btn {
      width: 100%;
      padding: 1.2rem;
      background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
      border: 1px solid #666;
      border-radius: 12px;
      color: #ffffff;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .action-btn:hover:not(:disabled), .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
      background: linear-gradient(135deg, #5a5a5a 0%, #3a3a3a 100%);
    }
    
    .action-btn:disabled, .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #666;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .card-preview-container {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }
    
    .card-preview {
      width: 350px;
      height: 220px;
      border-radius: 16px;
      padding: 2rem;
      position: relative;
      color: white;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .card-preview:hover {
      transform: rotateY(5deg) rotateX(5deg);
    }
    
    .card-preview.visa {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
    }
    
    .card-preview.mastercard {
      background: linear-gradient(135deg, #eb001b, #f79e1b);
    }
    
    .card-preview.rupay {
      background: linear-gradient(135deg, #002d62, #00aeef);
    }
    
    .card-preview.credit {
      background: linear-gradient(135deg, #2563eb, #1e40af);
    }
    
    .card-preview.debit {
      background: linear-gradient(135deg, #059669, #047857);
    }
    
    .card-chip {
      width: 45px;
      height: 32px;
      background: #ffd700;
      border-radius: 6px;
      position: absolute;
      top: 2rem;
      left: 2rem;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .card-number {
      font-family: 'Courier New', monospace;
      font-size: 1.4rem;
      letter-spacing: 3px;
      margin: 4rem 0 1.5rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .card-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .card-name {
      font-size: 1rem;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
    }
    
    .card-logo {
      font-size: 1.2rem;
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .cards-list {
      max-height: 600px;
      overflow-y: auto;
    }
    
    .card-item {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .card-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
    }
    
    .card-item .card-preview {
      width: 280px;
      height: 180px;
      margin-bottom: 1rem;
      padding: 1.5rem;
    }
    
    .card-item .card-number {
      font-size: 1.2rem;
      margin: 3rem 0 1rem 0;
    }
    
    .card-details {
      margin-bottom: 1rem;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .detail-label {
      color: #cccccc;
      font-weight: 600;
    }
    
    .detail-value {
      color: #ffffff;
      font-family: monospace;
    }
    
    .delete-btn {
      width: 100%;
      padding: 0.8rem;
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
      border: 1px solid #ff6666;
      border-radius: 8px;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .delete-btn:hover {
      background: linear-gradient(135deg, #ff6666 0%, #ff4444 100%);
      transform: translateY(-2px);
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #888;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    .message {
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
      text-align: center;
      font-weight: 600;
    }
    
    .message.success {
      background: linear-gradient(135deg, #2d5a2d 0%, #1a4a1a 100%);
      color: #90ee90;
      border: 1px solid #4a8a4a;
    }
    
    .message.error {
      background: linear-gradient(135deg, #5a2d2d 0%, #4a1a1a 100%);
      color: #ff9090;
      border: 1px solid #8a4a4a;
    }
    
    @media (max-width: 768px) {
      .card-service-container {
        padding: 1rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .card-preview {
        width: 300px;
        height: 190px;
      }
      
      .card-item .card-preview {
        width: 250px;
        height: 160px;
      }
    }
  `]
})
export class CardServiceComponent {
  searchAccountNumber = '';
  searchedCards: any[] = [];
  hasSearched = false;
  isLoading = false;
  message = '';
  isError = false;
  
  newCard = {
    cardType: '',
    cardName: '',
    cardIssuerCompany: '',
    accountNumber: ''
  };

  constructor(private http: HttpClient) {}

  async searchCards() {
    if (!this.searchAccountNumber.trim()) {
      this.showMessage('Please enter an account number', true);
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;

    try {
      const cards: any = await this.http.get(`http://localhost:8084/api/v1/cards/account/${this.searchAccountNumber}`).toPromise();
      this.searchedCards = Array.isArray(cards) ? cards : [];
    } catch (error: any) {
      if (error.status === 404) {
        this.searchedCards = [];
      } else {
        this.showMessage('Error searching cards: ' + (error.error?.message || error.message), true);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async issueCard() {
    if (!this.newCard.cardType || !this.newCard.cardName || !this.newCard.cardIssuerCompany || !this.newCard.accountNumber) {
      this.showMessage('Please fill in all fields', true);
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      await this.http.post('http://localhost:8084/api/v1/cards', this.newCard).toPromise();
      this.showMessage('Card issued successfully!', false);
      this.resetForm();
    } catch (error: any) {
      this.showMessage('Error issuing card: ' + (error.error?.message || error.message), true);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteCard(cardId: number) {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    try {
      await this.http.delete(`http://localhost:8084/api/v1/cards/${cardId}`).toPromise();
      this.showMessage('Card deleted successfully!', false);
      if (this.searchAccountNumber) {
        this.searchCards();
      }
    } catch (error: any) {
      this.showMessage('Error deleting card: ' + (error.error?.message || error.message), true);
    }
  }

  getCardClass(issuer: string): string {
    if (!issuer) return 'credit';
    return issuer.toLowerCase();
  }

  getPreviewCardClass(): string {
    if (this.newCard.cardIssuerCompany) {
      return this.newCard.cardIssuerCompany.toLowerCase();
    }
    return this.newCard.cardType ? this.newCard.cardType.toLowerCase() : 'credit';
  }

  getLastFourDigits(cardNumber: string): string {
    if (!cardNumber) return '••••';
    return cardNumber.slice(-4);
  }

  private showMessage(text: string, isError: boolean) {
    this.message = text;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  private resetForm() {
    this.newCard = {
      cardType: '',
      cardName: '',
      cardIssuerCompany: '',
      accountNumber: ''
    };
  }
}