import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account, CreateAccountRequest } from '../../models/account.model';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [class.show]="isVisible">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Manage Accounts</h2>
        <div class="flex space-x-4 mb-4">
          <button 
            (click)="setActiveTab('view')"
            [class]="getTabClass('view')"
            class="font-semibold py-2 px-4 rounded-full">
            View Accounts
          </button>
          <button 
            (click)="setActiveTab('create')"
            [class]="getTabClass('create')"
            class="font-semibold py-2 px-4 rounded-full">
            Create Account
          </button>
          <button 
            (click)="setActiveTab('delete')"
            [class]="getTabClass('delete')"
            class="font-semibold py-2 px-4 rounded-full">
            Delete Account
          </button>
        </div>

        <!-- View Accounts -->
        <div *ngIf="activeTab === 'view'" class="tab-content active">
          <h3 class="text-xl font-semibold mb-4">Your Accounts</h3>
          <div class="space-y-4">
            <p *ngIf="isLoadingAccounts" class="text-gray-600">Loading accounts...</p>
            <p *ngIf="!isLoadingAccounts && accounts.length === 0" class="text-gray-600">No accounts found.</p>
            <div *ngFor="let account of accounts" class="bg-gray-100 p-4 rounded-md">
              <p><strong>User:</strong> {{ userName }}</p>
              <p><strong>Account Type:</strong> {{ account.accountType }}</p>
              <p><strong>Account Number:</strong> {{ account.accountNumber }}</p>
              <p><strong>Balance:</strong> ₹{{ account.balance | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <!-- Create Account -->
        <div *ngIf="activeTab === 'create'" class="tab-content active">
          <h3 class="text-xl font-semibold mb-4">Create New Account</h3>
          <form (ngSubmit)="createAccount()" #createForm="ngForm" class="space-y-4">
            <div>
              <label for="accountType" class="block text-sm font-medium text-gray-700">Account Type</label>
              <select 
                id="accountType" 
                name="accountType"
                [(ngModel)]="newAccount.accountType"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required>
                <option value="SAVINGS">Savings</option>
                <option value="SALARY">Salary</option>
                <option value="CURRENT">Current</option>
              </select>
            </div>
            <div>
              <label for="initialBalance" class="block text-sm font-medium text-gray-700">Initial Balance</label>
              <input 
                type="number" 
                id="initialBalance" 
                name="initialBalance"
                [(ngModel)]="newAccount.initialBalance"
                step="0.01" 
                min="0" 
                placeholder="Enter initial balance (e.g., 1000.00)"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required>
              <small class="text-gray-500">Minimum balance: ₹00.00</small>
            </div>
            <div>
              <label for="aadhaarNumber" class="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input 
                type="text" 
                id="aadhaarNumber" 
                name="aadhaarNumber"
                [(ngModel)]="newAccount.aadhaarNumber"
                maxlength="12" 
                pattern="\\d{12}" 
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required>
            </div>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address"
                [(ngModel)]="newAccount.address"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required>
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">State</label>
              <input 
                type="text" 
                id="state" 
                name="state"
                [(ngModel)]="newAccount.state"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required>
            </div>
            <div>
              <label for="pinCode" class="block text-sm font-medium text-gray-700">Pin Code</label>
              <input 
                type="text" 
                id="pinCode" 
                name="pinCode"
                [(ngModel)]="newAccount.pinCode"
                maxlength="6" 
                pattern="\\d{6}" 
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required>
            </div>
            <button 
              type="submit" 
              [disabled]="isCreatingAccount"
              class="btn-primary text-white font-semibold py-2 px-4 rounded-full w-full disabled:opacity-50">
              {{ isCreatingAccount ? 'Creating...' : 'Create Account' }}
            </button>
          </form>
          <p *ngIf="createMessage" 
             [class]="createMessageType === 'success' ? 'mt-4 text-sm text-green-600' : 'mt-4 text-sm text-red-600'">
            {{ createMessage }}
          </p>
        </div>

        <!-- Delete Account -->
        <div *ngIf="activeTab === 'delete'" class="tab-content active">
          <h3 class="text-xl font-semibold mb-4">Delete Accounts</h3>
          <div class="space-y-4">
            <p *ngIf="isLoadingAccounts" class="text-gray-600">Loading accounts...</p>
            <p *ngIf="!isLoadingAccounts && accounts.length === 0" class="text-gray-600">No accounts found.</p>
            <div *ngFor="let account of accounts" class="bg-gray-100 p-4 rounded-md flex justify-between items-center">
              <div>
                <p><strong>Account Number:</strong> {{ account.accountNumber }}</p>
                <p><strong>Type:</strong> {{ account.accountType }}</p>
                <p><strong>Balance:</strong> ₹{{ account.balance | number:'1.2-2' }}</p>
              </div>
              <button 
                (click)="deleteAccount(account.id)"
                class="btn-danger text-white font-semibold py-1 px-3 rounded-full">
                Delete
              </button>
            </div>
          </div>
        </div>

        <button 
          (click)="onClose.emit()"
          class="btn-secondary mt-4 font-semibold py-2 px-4 rounded-full w-full">
          Close
        </button>
      </div>
    </div>
  `
})
export class AccountModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() userId: number = 0;
  @Input() userName: string = '';
  @Output() onClose = new EventEmitter<void>();

  activeTab: 'view' | 'create' | 'delete' = 'view';
  accounts: Account[] = [];
  isLoadingAccounts: boolean = false;
  isCreatingAccount: boolean = false;
  createMessage: string = '';
  createMessageType: 'success' | 'error' = 'error';

  newAccount: CreateAccountRequest = {
    userId: 0,
    accountType: 'SAVINGS',
    initialBalance: 0,
    aadhaarNumber: '',
    address: '',
    state: '',
    pinCode: ''
  };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    if (this.isVisible) {
      this.loadAccounts();
    }
  }

  setActiveTab(tab: 'view' | 'create' | 'delete'): void {
    this.activeTab = tab;
    if (tab === 'view' || tab === 'delete') {
      this.loadAccounts();
    }
    this.createMessage = '';
  }

  getTabClass(tab: string): string {
    return this.activeTab === tab 
      ? 'btn-primary text-white' 
      : 'btn-secondary';
  }

  loadAccounts(): void {
    if (!this.userId) return;
    
    this.isLoadingAccounts = true;
    this.accountService.getUserAccounts(this.userId).subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter(account => 
          account && account.accountType && account.accountNumber
        );
        this.isLoadingAccounts = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.accounts = [];
        this.isLoadingAccounts = false;
      }
    });
  }

  createAccount(): void {
    if (!this.userId) {
      this.showCreateMessage('Please log in to create an account.', 'error');
      return;
    }

    if (!this.newAccount.initialBalance || this.newAccount.initialBalance < 0) {
      this.showCreateMessage('Please enter a valid non-negative balance.', 'error');
      return;
    }

    this.newAccount.userId = this.userId;
    this.isCreatingAccount = true;
    this.createMessage = '';

    this.accountService.createAccount(this.newAccount).subscribe({
      next: (response) => {
        this.showCreateMessage('Account created successfully!', 'success');
        this.resetCreateForm();
        setTimeout(() => {
          this.setActiveTab('view');
        }, 3000);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Failed to create account.';
        this.showCreateMessage(errorMessage, 'error');
        this.isCreatingAccount = false;
      },
      complete: () => {
        this.isCreatingAccount = false;
      }
    });
  }

  deleteAccount(accountId: number): void {
    if (!confirm('Are you sure you want to delete this account?')) return;

    this.accountService.deleteAccount(accountId).subscribe({
      next: () => {
        this.loadAccounts();
      },
      error: (error) => {
        console.error('Error deleting account:', error);
      }
    });
  }

  private showCreateMessage(text: string, type: 'success' | 'error'): void {
    this.createMessage = text;
    this.createMessageType = type;
  }

  private resetCreateForm(): void {
    this.newAccount = {
      userId: this.userId,
      accountType: 'SAVINGS',
      initialBalance: 0,
      aadhaarNumber: '',
      address: '',
      state: '',
      pinCode: ''
    };
  }
}