

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account, TransferRequest } from '../../models/account.model';

@Component({
  selector: 'app-transfer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [class.show]="isVisible">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Transfer Funds</h2>
        <form (ngSubmit)="transferFunds()" #transferForm="ngForm" class="space-y-4">
          <div>
            <label for="fromAccount" class="block text-sm font-medium text-gray-700">From Account</label>
            <select 
              id="fromAccount" 
              name="fromAccount"
              [(ngModel)]="transferData.fromAccount"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
              required>
              <option value="">Select account</option>
              <option *ngFor="let account of accounts" [value]="account.accountNumber">
                {{ account.accountType }} - {{ account.accountNumber }} (₹{{ account.balance | number:'1.2-2' }})
              </option>
            </select>
          </div>
          <div>
            <label for="toAccount" class="block text-sm font-medium text-gray-700">To Account</label>
            <input 
              type="text" 
              id="toAccount" 
              name="toAccount"
              [(ngModel)]="transferData.toAccount"
              maxlength="12" 
              pattern="\\d{12}" 
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
              placeholder="Enter 12-digit account number" 
              required>
          </div>
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input 
              type="number" 
              id="amount" 
              name="amount"
              [(ngModel)]="transferData.amount"
              step="0.01" 
              min="0.01" 
              placeholder="Enter amount (e.g., 500.00)" 
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
              required>
          </div>
          <button 
            type="submit" 
            [disabled]="isTransferring"
            class="btn-primary text-white font-semibold py-2 px-4 rounded-full w-full disabled:opacity-50">
            {{ isTransferring ? 'Transferring...' : 'Transfer' }}
          </button>
        </form>
        <p *ngIf="transferMessage" 
           [class]="transferMessageType === 'success' ? 'mt-4 text-sm text-green-600' : 'mt-4 text-sm text-red-600'">
          {{ transferMessage }}
        </p>
        <button 
          (click)="onClose.emit()"
          class="btn-secondary mt-4 font-semibold py-2 px-4 rounded-full w-full">
          Close
        </button>
      </div>
    </div>
  `
})
export class TransferModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() userId: number = 0;
  @Output() onClose = new EventEmitter<void>();
  @Output() onTransferSuccess = new EventEmitter<void>();

  accounts: Account[] = [];
  isTransferring: boolean = false;
  transferMessage: string = '';
  transferMessageType: 'success' | 'error' = 'error';

  transferData: TransferRequest = {
    fromAccount: '',
    toAccount: '',
    amount: 0
  };

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    // leave empty — use ngOnChanges instead
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible && this.userId) {
      this.loadAccounts();
    }
  }

  loadAccounts(): void {
    this.accountService.getUserAccounts(this.userId).subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter(account =>
          account && account.accountNumber
        );
      },
      error: (error) => {
        this.showTransferMessage('Failed to load accounts.', 'error');
        console.error('Error loading accounts:', error);
      }
    });
  }

  transferFunds(): void {
    if (!this.validateTransfer()) {
      return;
    }

    const userId = Number(sessionStorage.getItem('userId'));
    if (!userId) {
      this.showTransferMessage('User not logged in.', 'error');
      return;
    }

    this.isTransferring = true;
    this.transferMessage = '';

    const payload = {
      ...this.transferData,
      fromUserId: userId
    };


    this.accountService.transferFunds(payload).subscribe({
      next: () => {
        this.showTransferMessage('Transfer successful!', 'success');
        setTimeout(() => {
          this.resetForm();
          this.onTransferSuccess.emit();
          this.onClose.emit();
        }, 1500);
      },
      error: (error) => {
        let errorMessage = 'Error sending the money.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message?.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
        }
        this.showTransferMessage(errorMessage, 'error');
        this.isTransferring = false;
        console.error('Transfer Error:', error);
      },
      complete: () => {
        this.isTransferring = false;
      }
    });
  }

  private validateTransfer(): boolean {
    if (!this.transferData.fromAccount) {
      this.showTransferMessage('Please select a valid source account.', 'error');
      return false;
    }

    if (!this.transferData.toAccount || !/^\d{12}$/.test(this.transferData.toAccount)) {
      this.showTransferMessage('Please enter a valid 12-digit destination account number.', 'error');
      return false;
    }

    if (!this.transferData.amount || this.transferData.amount <= 0) {
      this.showTransferMessage('Please enter a valid positive amount.', 'error');
      return false;
    }

    return true;
  }

  private showTransferMessage(text: string, type: 'success' | 'error'): void {
    this.transferMessage = text;
    this.transferMessageType = type;
  }

  private resetForm(): void {
    this.transferData = {
      fromAccount: '',
      toAccount: '',
      amount: 0
    };
    this.transferMessage = '';
  }
}
