import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-loan-service',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="loan-service-container">
      <div class="hero-section">
        <h1 class="hero-title">Loan Services</h1>
        <p class="hero-subtitle">Manage your loans and EMI payments with ease</p>
      </div>

      <!-- Loans Overview -->
      <div class="loans-overview">
        <div class="overview-card">
          <div class="overview-icon">💰</div>
          <div class="overview-info">
            <div class="overview-value">{{ totalLoanAmount | currency:'INR':'symbol':'1.2-2' }}</div>
            <div class="overview-label">Total Loan Amount</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-icon">📊</div>
          <div class="overview-info">
            <div class="overview-value">{{ remainingAmount | currency:'INR':'symbol':'1.2-2' }}</div>
            <div class="overview-label">Remaining Amount</div>
          </div>
        </div>
        
          
      </div>

      <!-- Loans Table -->
      <div class="loans-table-section">
        <h2 class="section-title">Your Loans</h2>
        <div class="table-container">
          <div *ngIf="loans.length === 0" class="empty-state">
            <div class="empty-icon">💳</div>
            <p>No loans found</p>
          </div>
          
          <table *ngIf="loans.length > 0" class="loans-table">
            <thead>
              <tr>
                <th>Loan Number</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Interest Rate</th>
                <th>EMI Amount</th>
                <th>Remaining</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Next EMI</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loan of loans" class="loan-row">
                <td class="loan-number">{{ loan.loanNumber }}</td>
                <td class="loan-type">{{ loan.loanType }}</td>
                <td class="loan-amount">{{ loan.amount | currency:'INR':'symbol':'1.2-2' }}</td>
                <td class="interest-rate">{{ loan.interestRate }}%</td>
                <td class="emi-amount">{{ loan.emiAmount | currency:'INR':'symbol':'1.2-2' }}</td>
                <td class="remaining-amount">{{ loan.remainingAmount | currency:'INR':'symbol':'1.2-2' }}</td>
                <td class="issue-date">{{ loan.issueDate | date:'shortDate' }}</td>
                <td class="status">
                  <span class="status-badge" [class]="getStatusClass(loan.status)">
                    {{ loan.status }}
                  </span>
                </td>
                <td class="next-emi">{{ loan.nextEMI || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="action-cards">
        <!-- Issue New Loan -->
        <div class="action-card">
          <div class="card-header">
            <div class="card-icon">💰</div>
            <h3 class="card-title">Issue New Loan</h3>
          </div>
          
          <form (ngSubmit)="issueLoan()" class="loan-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Loan Amount</label>
                <input 
                  type="number" 
                  [(ngModel)]="newLoan.amount"
                  name="amount"
                  class="form-input"
                  placeholder="Enter loan amount"
                  min="1000"
                  step="1000"
                  required>
              </div>
              <div class="form-group">
                <label class="form-label">Term (Months)</label>
                <input 
                  type="number" 
                  [(ngModel)]="newLoan.termMonths"
                  name="termMonths"
                  class="form-input"
                  placeholder="Loan term in months"
                  min="6"
                  max="360"
                  required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Loan Type</label>
              <select [(ngModel)]="newLoan.loanType" name="loanType" class="form-input" required>
                <option value="">Select loan type</option>
                <option value="Personal">Personal Loan</option>
                <option value="Savings">Savings Loan</option>
                <option value="Motor">Motor Loan</option>
                <option value="Home">Home Loan</option>
              </select>
            </div>
            
            <button type="submit" class="submit-btn" [disabled]="isLoading">
              <span *ngIf="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Processing...' : 'Issue Loan' }}
            </button>
          </form>
          
          <div *ngIf="issueMessage" class="message" [class.error]="isIssueError">
            {{ issueMessage }}
          </div>
        </div>

        <!-- Repay EMI -->
        <div class="action-card">
          <div class="card-header">
            <div class="card-icon">💳</div>
            <h3 class="card-title">Repay EMI</h3>
          </div>
          
          <form (ngSubmit)="repayEMI()" class="repay-form">
            <div class="form-group">
              <label class="form-label">Loan Number</label>
              <input 
                type="text" 
                [(ngModel)]="repayData.loanNumber"
                name="loanNumber"
                class="form-input"
                placeholder="e.g. LN44749531"
                required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Account Number</label>
              <input 
                type="text" 
                [(ngModel)]="repayData.accountNumber"
                name="accountNumber"
                class="form-input"
                placeholder="e.g. 445396429695"
                required>
            </div>
            
            <button type="submit" class="submit-btn" [disabled]="isLoading">
              <span *ngIf="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Processing...' : 'Repay EMI' }}
            </button>
          </form>
          
          <div *ngIf="repayMessage" class="message" [class.error]="isRepayError">
            {{ repayMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loan-service-container {
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
    
    .loans-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .overview-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }
    
    .overview-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
    }
    
    .overview-icon {
      font-size: 2.5rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }
    
    .overview-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
    }
    
    .overview-label {
      color: #cccccc;
      font-size: 0.9rem;
    }
    
    .loans-table-section {
      margin-bottom: 3rem;
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .table-container {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 2rem;
      overflow-x: auto;
    }
    
    .loans-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .loans-table th {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      color: #ffffff;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #444;
    }
    
    .loans-table td {
      padding: 1rem;
      border-bottom: 1px solid #333;
      color: #cccccc;
    }
    
    .loan-row:hover {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    }
    
    .loan-number {
      font-family: monospace;
      font-weight: 600;
      color: #4a9eff;
    }
    
    .loan-type {
      font-weight: 600;
      color: #ffffff;
    }
    
    .loan-amount, .emi-amount, .remaining-amount {
      font-weight: 600;
      color: #90ee90;
    }
    
    .interest-rate {
      font-weight: 600;
      color: #ffcc00;
    }
    
    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-badge.active {
      background: linear-gradient(135deg, #2d5a2d 0%, #1a4a1a 100%);
      color: #90ee90;
    }
    
    .status-badge.closed {
      background: linear-gradient(135deg, #5a2d2d 0%, #4a1a1a 100%);
      color: #ff9090;
    }
    
    .status-badge.pending {
      background: linear-gradient(135deg, #5a5a2d 0%, #4a4a1a 100%);
      color: #ffff90;
    }
    
    .action-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .action-card {
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
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    
    .loan-form, .repay-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
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
    
    .message:not(.error) {
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
      .loan-service-container {
        padding: 1rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .loans-overview {
        grid-template-columns: 1fr;
      }
      
      .action-cards {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .table-container {
        padding: 1rem;
      }
      
      .loans-table {
        font-size: 0.9rem;
      }
      
      .loans-table th,
      .loans-table td {
        padding: 0.5rem;
      }
    }
  `]
})
export class LoanServiceComponent {
  loans: any[] = [];
  totalLoanAmount = 0;
  remainingAmount = 0;
  activeLoans = 0;
  isLoading = false;
  
  issueMessage = '';
  isIssueError = false;
  repayMessage = '';
  isRepayError = false;
  
  newLoan = {
    amount: 50000,
    termMonths: 12,
    loanType: ''
  };
  
  repayData = {
    loanNumber: '',
    accountNumber: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLoans();
  }

  async loadLoans() {
    const accountId = sessionStorage.getItem('userId') || '21';
    
    try {
      const loans: any = await this.http.get(`http://localhost:8087/api/v1/loans/account/${accountId}`).toPromise();
      this.loans = Array.isArray(loans) ? loans : [];
      
      // Calculate overview stats
      this.totalLoanAmount = this.loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
      this.remainingAmount = this.loans.reduce((sum, loan) => sum + (loan.remainingAmount || 0), 0);
      this.activeLoans = this.loans.filter(loan => loan.status === 'ACTIVE').length;
      
      // Load next EMI for each loan
      for (let loan of this.loans) {
        loan.nextEMI = await this.fetchNextEMI(loan.loanNumber);
      }
    } catch (error) {
      console.error('Error loading loans:', error);
      this.loans = [];
    }
  }

  async fetchNextEMI(loanNumber: string): Promise<string> {
    try {
      const response = await this.http.get(`http://localhost:8087/api/v1/loans/emi/${loanNumber}`, { responseType: 'text' }).toPromise();
      return response || 'N/A';
    } catch (error) {
      return 'N/A';
    }
  }

  async issueLoan() {
    if (!this.newLoan.amount || !this.newLoan.termMonths || !this.newLoan.loanType) {
      this.showIssueMessage('Please fill in all fields', true);
      return;
    }

    const accountId = sessionStorage.getItem('userId') || '21';
    this.isLoading = true;
    this.issueMessage = '';

    const loanData = {
      amount: this.newLoan.amount,
      termMonths: this.newLoan.termMonths,
      accountId: parseInt(accountId),
      loanType: this.newLoan.loanType
    };

    try {
      await this.http.post('http://localhost:8087/api/v1/loans/issue', loanData).toPromise();
      this.showIssueMessage('Loan issued successfully!', false);
      this.resetLoanForm();
      this.loadLoans();
    } catch (error: any) {
      this.showIssueMessage('Error issuing loan: ' + (error.error?.message || error.message), true);
    } finally {
      this.isLoading = false;
    }
  }

  async repayEMI() {
    if (!this.repayData.loanNumber || !this.repayData.accountNumber) {
      this.showRepayMessage('Please enter both Loan Number and Account Number', true);
      return;
    }

    this.isLoading = true;
    this.repayMessage = '';

    try {
      const response = await this.http.put(
        `http://localhost:8087/api/v1/loans/repay/${this.repayData.loanNumber}/${this.repayData.accountNumber}`,
        {},
        { responseType: 'text' }
      ).toPromise();
      
      this.showRepayMessage(response || 'EMI repaid successfully!', false);
      this.resetRepayForm();
      this.loadLoans();
    } catch (error: any) {
      this.showRepayMessage('Error repaying EMI: ' + (error.error || error.message), true);
    } finally {
      this.isLoading = false;
    }
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || 'pending';
  }

  private showIssueMessage(message: string, isError: boolean) {
    this.issueMessage = message;
    this.isIssueError = isError;
    setTimeout(() => {
      this.issueMessage = '';
    }, 5000);
  }

  private showRepayMessage(message: string, isError: boolean) {
    this.repayMessage = message;
    this.isRepayError = isError;
    setTimeout(() => {
      this.repayMessage = '';
    }, 5000);
  }

  private resetLoanForm() {
    this.newLoan = {
      amount: 50000,
      termMonths: 12,
      loanType: ''
    };
  }

  private resetRepayForm() {
    this.repayData = {
      loanNumber: '',
      accountNumber: ''
    };
  }
}