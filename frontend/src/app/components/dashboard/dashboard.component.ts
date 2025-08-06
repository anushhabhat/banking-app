import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="dashboard-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Welcome back, <span class="user-name">{{ userName }}!</span>
          </h1>
          <p class="hero-subtitle">
            Manage your finances with cutting-edge banking technology
          </p>
          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <div class="stat-value">{{ totalBalance | currency:'INR':'symbol':'1.2-2' }}</div>
                <div class="stat-label">Total Balance</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏦</div>
              <div class="stat-info">
                <div class="stat-value">{{ accountCount }}</div>
                <div class="stat-label">Active Accounts</div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="services-section">
        <h2 class="section-title">Banking Services</h2>
        <div class="services-grid">
          <div class="service-card" (click)="showAccountModal = true">
            <div class="service-icon">🏦</div>
            <h3 class="service-title">Account Management</h3>
            <p class="service-description">Create, view, and manage your bank accounts</p>
            <div class="service-action">Manage Accounts</div>
          </div>
          
          <div class="service-card" (click)="showTransferModal = true">
            <div class="service-icon">💸</div>
            <h3 class="service-title">Fund Transfer</h3>
            <p class="service-description">Transfer money securely between accounts</p>
            <div class="service-action">Transfer Funds</div>
          </div>
          
          <div class="service-card" (click)="navigateToCards()">
            <div class="service-icon">💳</div>
            <h3 class="service-title">Card Services</h3>
            <p class="service-description">Issue and manage your credit/debit cards</p>
            <div class="service-action">Manage Cards</div>
          </div>
          
          <div class="service-card" (click)="navigateToLoans()">
            <div class="service-icon">🏠</div>
            <h3 class="service-title">Loan Services</h3>
            <p class="service-description">Apply for loans and manage EMI payments</p>
            <div class="service-action">View Loans</div>
          </div>
        </div>
      </section>

      <!-- Account Management Modal -->
      <div *ngIf="showAccountModal" class="modal-overlay" (click)="closeModal($event)">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Account Management</h2>
            <button class="close-btn" (click)="showAccountModal = false">✕</button>
          </div>
          
          <div class="modal-tabs">
            <button 
              class="tab-btn"
              [class.active]="activeAccountTab === 'view'"
              (click)="switchAccountTab('view')">
              View Accounts
            </button>
            <button 
              class="tab-btn"
              [class.active]="activeAccountTab === 'create'"
              (click)="switchAccountTab('create')">
              Create Account
            </button>
            <button 
              class="tab-btn"
              [class.active]="activeAccountTab === 'delete'"
              (click)="switchAccountTab('delete')">
              Delete Account
            </button>
          </div>
          
          <!-- View Accounts Tab -->
          <div *ngIf="activeAccountTab === 'view'" class="tab-content">
            <div *ngIf="accounts.length === 0" class="empty-state">
              <div class="empty-icon">🏦</div>
              <p>No accounts found</p>
            </div>
            <div *ngFor="let account of accounts" class="account-item">
              <div class="account-info">
                <div class="account-type">{{ account.accountType }}</div>
                <div class="account-number">{{ account.accountNumber }}</div>
                <div class="account-balance">{{ account.balance | currency:'INR':'symbol':'1.2-2' }}</div>
              </div>
            </div>
          </div>
          
          <!-- Create Account Tab -->
          <div *ngIf="activeAccountTab === 'create'" class="tab-content">
            <form (ngSubmit)="createAccount()" class="account-form">
              <div class="form-group">
                <label class="form-label">Account Type</label>
                <select [(ngModel)]="newAccount.accountType" name="accountType" class="form-input" required>
                  <option value="SAVINGS">Savings</option>
                  <option value="SALARY">Salary</option>
                  <option value="CURRENT">Current</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Initial Balance</label>
                <input 
                  type="number" 
                  [(ngModel)]="newAccount.initialBalance"
                  name="initialBalance"
                  class="form-input"
                  placeholder="Enter initial balance"
                  min="0"
                  step="0.01"
                  required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Aadhaar Number</label>
                <input 
                  type="text" 
                  [(ngModel)]="newAccount.aadhaarNumber"
                  name="aadhaarNumber"
                  class="form-input"
                  placeholder="12-digit Aadhaar number"
                  maxlength="12"
                  required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Address</label>
                <input 
                  type="text" 
                  [(ngModel)]="newAccount.address"
                  name="address"
                  class="form-input"
                  placeholder="Enter your address"
                  required>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">State</label>
                  <input 
                    type="text" 
                    [(ngModel)]="newAccount.state"
                    name="state"
                    class="form-input"
                    placeholder="State"
                    required>
                </div>
                <div class="form-group">
                  <label class="form-label">Pin Code</label>
                  <input 
                    type="text" 
                    [(ngModel)]="newAccount.pinCode"
                    name="pinCode"
                    class="form-input"
                    placeholder="6-digit pin"
                    maxlength="6"
                    required>
                </div>
              </div>
              
              <button type="submit" class="submit-btn" [disabled]="isLoading">
                {{ isLoading ? 'Creating...' : 'Create Account' }}
              </button>
            </form>
          </div>
          
          <!-- Delete Account Tab -->
          <div *ngIf="activeAccountTab === 'delete'" class="tab-content">
            <div *ngIf="accounts.length === 0" class="empty-state">
              <div class="empty-icon">🏦</div>
              <p>No accounts to delete</p>
            </div>
            <div *ngFor="let account of accounts" class="account-item delete-item">
              <div class="account-info">
                <div class="account-type">{{ account.accountType }}</div>
                <div class="account-number">{{ account.accountNumber }}</div>
                <div class="account-balance">{{ account.balance | currency:'INR':'symbol':'1.2-2' }}</div>
              </div>
              <button class="delete-btn" (click)="deleteAccount(account.id)">Delete</button>
            </div>
          </div>
          
          <div *ngIf="modalMessage" class="modal-message" [class.error]="isModalError">
            {{ modalMessage }}
          </div>
        </div>
      </div>

      <!-- Transfer Modal -->
      <div *ngIf="showTransferModal" class="modal-overlay" (click)="closeModal($event)">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Fund Transfer</h2>
            <button class="close-btn" (click)="showTransferModal = false">✕</button>
          </div>
          
          <form (ngSubmit)="transferFunds()" class="transfer-form">
            <div class="form-group">
              <label class="form-label">From Account</label>
              <select [(ngModel)]="transferData.fromAccount" name="fromAccount" class="form-input" required>
                <option value="">Select account</option>
                <option *ngFor="let account of accounts" [value]="account.accountNumber">
                  {{ account.accountType }} - {{ account.accountNumber }} ({{ account.balance | currency:'INR':'symbol':'1.2-2' }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">To Account</label>
              <input 
                type="text" 
                [(ngModel)]="transferData.toAccount"
                name="toAccount"
                class="form-input"
                placeholder="Enter 12-digit account number"
                maxlength="12"
                required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Amount</label>
              <input 
                type="number" 
                [(ngModel)]="transferData.amount"
                name="amount"
                class="form-input"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                required>
            </div>
            
            <button type="submit" class="submit-btn" [disabled]="isLoading">
              {{ isLoading ? 'Transferring...' : 'Transfer Funds' }}
            </button>
          </form>
          
          <div *ngIf="modalMessage" class="modal-message" [class.error]="isModalError">
            {{ modalMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #0f0f0f 100%);
      padding: 2rem;
    }
    
    .hero-section {
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
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
    
    .user-name {
      background: linear-gradient(135deg, #4a9eff 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      color: #cccccc;
      margin-bottom: 2rem;
    }
    
    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }
    
    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
    }
    
    .stat-label {
      color: #cccccc;
      font-size: 0.9rem;
    }
    
    .services-section {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .service-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 20px;
      padding: 2.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .service-card:hover::before {
      left: 100%;
    }
    
    .service-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(255, 255, 255, 0.1);
      border-color: #666;
    }
    
    .service-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
    }
    
    .service-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1rem;
    }
    
    .service-description {
      color: #cccccc;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .service-action {
      background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
      color: #ffffff;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      display: inline-block;
      transition: all 0.3s ease;
    }
    
    .service-card:hover .service-action {
      background: linear-gradient(135deg, #5a5a5a 0%, #3a3a3a 100%);
      transform: scale(1.05);
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    
    .modal-content {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 20px;
      padding: 2rem;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .modal-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: #cccccc;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .close-btn:hover {
      background: #444;
      color: #ffffff;
    }
    
    .modal-tabs {
      display: flex;
      background: #0f0f0f;
      border-radius: 12px;
      padding: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .tab-btn {
      flex: 1;
      padding: 1rem;
      background: transparent;
      border: none;
      color: #cccccc;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .tab-btn.active {
      background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
      color: #ffffff;
    }
    
    .tab-content {
      min-height: 300px;
    }
    
    .account-form, .transfer-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-label {
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .form-input {
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
    }
    
    .form-input::placeholder {
      color: #888;
    }
    
    .submit-btn {
      padding: 1.2rem;
      background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
      border: 1px solid #666;
      border-radius: 12px;
      color: #ffffff;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
      background: linear-gradient(135deg, #5a5a5a 0%, #3a3a3a 100%);
    }
    
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .account-item {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .account-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .account-type {
      font-weight: 700;
      color: #ffffff;
      font-size: 1.1rem;
    }
    
    .account-number {
      color: #cccccc;
      font-family: monospace;
    }
    
    .account-balance {
      color: #4a9eff;
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    .delete-btn {
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
      border: 1px solid #ff6666;
      border-radius: 8px;
      color: #ffffff;
      padding: 0.5rem 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .delete-btn:hover {
      background: linear-gradient(135deg, #ff6666 0%, #ff4444 100%);
      transform: scale(1.05);
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
    
    .modal-message {
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
      text-align: center;
      font-weight: 600;
    }
    
    .modal-message:not(.error) {
      background: linear-gradient(135deg, #2d5a2d 0%, #1a4a1a 100%);
      color: #90ee90;
      border: 1px solid #4a8a4a;
    }
    
    .modal-message.error {
      background: linear-gradient(135deg, #5a2d2d 0%, #4a1a1a 100%);
      color: #ff9090;
      border: 1px solid #8a4a4a;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-stats {
        grid-template-columns: 1fr;
      }
      
      .services-grid {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        width: 95%;
        padding: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent {
  @Input() userName: string = '';
  @Output() navigate = new EventEmitter<string>();
  
  showAccountModal = false;
  showTransferModal = false;
  activeAccountTab: 'view' | 'create' | 'delete' = 'view';
  isLoading = false;
  modalMessage = '';
  isModalError = false;
  
  accounts: any[] = [];
  totalBalance = 0;
  accountCount = 0;
  cardCount = 0;
  
  newAccount = {
    accountType: 'SAVINGS',
    initialBalance: 0,
    aadhaarNumber: '',
    address: '',
    state: '',
    pinCode: ''
  };
  
  transferData = {
    fromAccount: '',
    toAccount: '',
    amount: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAccounts();
  }

  async loadAccounts() {
    const userId = sessionStorage.getItem('userId') || '21';
    try {
      const accounts: any = await this.http.get(`http://localhost:8081/api/v1/account/user/${userId}`).toPromise();
      this.accounts = Array.isArray(accounts) ? accounts : [];
      this.accountCount = this.accounts.length;
      this.totalBalance = this.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    } catch (error) {
      console.error('Error loading accounts:', error);
      this.accounts = [];
    }
  }

  switchAccountTab(tab: 'view' | 'create' | 'delete') {
    this.activeAccountTab = tab;
    this.modalMessage = '';
    if (tab === 'view' || tab === 'delete') {
      this.loadAccounts();
    }
  }

  async createAccount() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      this.showModalMessage('Please log in to create an account', true);
      return;
    }

    this.isLoading = true;
    this.modalMessage = '';

    const accountData = {
      userId: parseInt(userId),
      accountType: this.newAccount.accountType,
      initialBalance: this.newAccount.initialBalance,
      aadhaarNumber: this.newAccount.aadhaarNumber,
      address: this.newAccount.address,
      state: this.newAccount.state,
      pinCode: this.newAccount.pinCode
    };

    try {
      await this.http.post('http://localhost:8081/api/v1/account/create', accountData).toPromise();
      this.showModalMessage('Account created successfully!', false);
      this.resetNewAccount();
      setTimeout(() => {
        this.switchAccountTab('view');
      }, 2000);
    } catch (error: any) {
      this.showModalMessage(error.error?.message || 'Failed to create account', true);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteAccount(accountId: number) {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      await this.http.delete(`http://localhost:8081/api/v1/account/${accountId}`).toPromise();
      this.showModalMessage('Account deleted successfully!', false);
      this.loadAccounts();
    } catch (error: any) {
      this.showModalMessage(error.error?.message || 'Failed to delete account', true);
    }
  }

  async transferFunds() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      this.showModalMessage('Please log in to transfer funds', true);
      return;
    }

    this.isLoading = true;
    this.modalMessage = '';

    const transferPayload = {
      fromUserId: parseInt(userId),
      fromAccount: this.transferData.fromAccount,
      toAccount: this.transferData.toAccount,
      amount: this.transferData.amount
    };

    try {
      await this.http.post('http://localhost:8086/api/transactions', transferPayload).toPromise();
      this.showModalMessage('Transfer successful!', false);
      this.resetTransferData();
      setTimeout(() => {
        this.showTransferModal = false;
        this.loadAccounts();
      }, 2000);
    } catch (error: any) {
      this.showModalMessage(error.error?.message || 'Transfer failed', true);
    } finally {
      this.isLoading = false;
    }
  }

  navigateToCards() {
    this.navigate.emit('cards');
  }

  navigateToLoans() {
    this.navigate.emit('loans');
  }

  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showAccountModal = false;
      this.showTransferModal = false;
    }
  }

  private showModalMessage(message: string, isError: boolean) {
    this.modalMessage = message;
    this.isModalError = isError;
    setTimeout(() => {
      this.modalMessage = '';
    }, 5000);
  }

  private resetNewAccount() {
    this.newAccount = {
      accountType: 'SAVINGS',
      initialBalance: 0,
      aadhaarNumber: '',
      address: '',
      state: '',
      pinCode: ''
    };
  }

  private resetTransferData() {
    this.transferData = {
      fromAccount: '',
      toAccount: '',
      amount: 0
    };
  }
}