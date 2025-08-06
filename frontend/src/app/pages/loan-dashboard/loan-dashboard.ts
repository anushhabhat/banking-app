import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-dashboard',
  templateUrl: './loan-dashboard.html',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class LoanDashboardComponent implements OnInit {
  loans: any[] = [];
  accountId = sessionStorage.getItem('userId') || '21';
  API_BASE_URL = 'http://localhost:8087/api/v1/loans';

  loanAmount: number = 50000;
  termMonths: number = 12;
  loanType: string = 'Personal';
  issueLoanMessage: string = '';
  repayLoanNumber: string = '';
  accountNumber: string = '';
  repayEMIMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans() {
    this.http.get(`${this.API_BASE_URL}/account/${this.accountId}`).subscribe(async (loans: any) => {
      this.loans = await Promise.all(
        (loans || []).map(async (loan: any) => {
          const nextEMI = await this.fetchNextEMI(loan.loanNumber);
          return { ...loan, nextEMI };
        })
      );
    });
  }

  async fetchNextEMI(loanNumber: string): Promise<string> {
    try {
      const res = await this.http.get(`${this.API_BASE_URL}/emi/${loanNumber}`, { responseType: 'text' }).toPromise();
      return res || 'N/A';
    } catch {
      return 'N/A';
    }
  }

  issueLoan() {
    this.http.post(`${this.API_BASE_URL}/issue`, {
      amount: this.loanAmount,
      termMonths: this.termMonths,
      accountId: this.accountId,
      loanType: this.loanType
    }).subscribe({
      next: () => {
        this.issueLoanMessage = 'Loan issued successfully!';
        this.fetchLoans();
      },
      error: err => {
        this.issueLoanMessage = 'Error: ' + err.error || 'Failed to issue loan';
      }
    });
  }

  repayEMI() {
    if (!this.repayLoanNumber || !this.accountNumber) {
      this.repayEMIMessage = 'Please enter both Loan Number and Account Number.';
      return;
    }

    this.http.put(
      `${this.API_BASE_URL}/repay/${this.repayLoanNumber}/${this.accountNumber}`,
      {},
      { responseType: 'text' }  // ✅ Tell Angular it's not JSON
    ).subscribe({
      next: (res: string) => {
        this.repayEMIMessage = res || 'Repayment successful.';
        this.fetchLoans(); // Refresh table
      },
      error: err => {
        const errorText = typeof err.error === 'string'
          ? err.error
          : (err.message || 'Failed to repay EMI');
        this.repayEMIMessage = 'Error repaying EMI: ' + errorText;
      }
    });


  }
}


// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { LoanService } from '../../services/loan.service'; // adjust path as needed

// @Component({
//   selector: 'app-loan-dashboard-modal',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './loan-dashboard.modal.html'
// })
// export class LoanDashboardModalComponent {
//   @Input() isVisible: boolean = false;
//   @Input() userId: number = 0;
//   @Output() onClose = new EventEmitter<void>();

//   loanAmount: number = 0;
//   termMonths: number = 0;
//   loanType: string = '';
//   repayLoanNumber: string = '';
//   accountNumber: string = '';
//   loanMessage: string = '';
//   repayEMIMessage: string = '';
//   loans: any[] = [];

//   constructor(private loanService: LoanService) {}

//   ngOnInit() {
//     this.fetchLoans();
//   }

//   fetchLoans() {
//     this.loanService.getLoansByUserId(this.userId).subscribe(loans => {
//       this.loans = loans;
//     });
//   }

//   applyLoan() {
//     this.loanService.applyLoan(this.userId, this.loanAmount, this.termMonths, this.loanType).subscribe({
//       next: res => {
//         this.loanMessage = 'Loan Applied Successfully!';
//         this.fetchLoans();
//       },
//       error: err => {
//         this.loanMessage = 'Loan Application Failed.';
//       }
//     });
//   }

//   repayEMI() {
//     this.loanService.repayEMI(this.repayLoanNumber, this.accountNumber).subscribe({
//       next: res => {
//         this.repayEMIMessage = 'EMI Repaid Successfully!';
//         this.fetchLoans();
//       },
//       error: err => {
//         const errorText = typeof err.error === 'string' ? err.error : (err.message || 'Failed to repay EMI');
//         this.repayEMIMessage = 'Error repaying EMI: ' + errorText;
//       }
//     });
//   }

//   closeModal() {
//     this.onClose.emit();
//   }
// }
