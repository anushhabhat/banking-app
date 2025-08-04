import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      class="modal-overlay" 
      [class.active]="isVisible"
      (click)="onOverlayClick($event)">
      <div class="auth-container">
        <button 
          (click)="onClose.emit()"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold focus:outline-none">
          &times;
        </button>
        <h1 class="text-3xl font-extrabold text-center text-blue-800 mb-8">Your Bank</h1>
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back!</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
          <div>
            <label for="loginIdentifier" class="block text-gray-700 text-sm font-semibold mb-2">
              Mobile Number / Email
            </label>
            <input 
              type="text" 
              id="loginIdentifier" 
              name="username"
              [(ngModel)]="credentials.username"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="e.g., +919876543210 or your@email.com" 
              required>
          </div>
          <div>
            <label for="loginPassword" class="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input 
              type="password" 
              id="loginPassword" 
              name="password"
              [(ngModel)]="credentials.password"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="Enter your password" 
              required>
          </div>
          <div 
            *ngIf="message" 
            class="form-message"
            [class.success]="messageType === 'success'"
            [class.error]="messageType === 'error'">
            {{ message }}
          </div>
          <button 
            type="submit" 
            [disabled]="isLoading"
            class="btn-primary w-full text-white font-semibold py-3 rounded-lg text-lg shadow-md hover:shadow-lg disabled:opacity-50">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
          <p class="text-center text-sm text-gray-600 mt-4">
            <a href="#" class="text-blue-600 hover:underline">Forgot Password?</a>
          </p>
          <p class="text-center text-sm text-gray-600 mt-2">
            Don't have an account? 
            <button 
              type="button"
              (click)="onSwitchToRegister.emit()"
              class="text-blue-600 hover:underline focus:outline-none">
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginModalComponent {
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSwitchToRegister = new EventEmitter<void>();
  @Output() onLoginSuccess = new EventEmitter<void>();

  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  message: string = '';
  messageType: 'success' | 'error' = 'error';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose.emit();
    }
  }

  onSubmit(): void {
    if (!this.credentials.username.trim() || !this.credentials.password.trim()) {
      this.showMessage('Please enter your mobile number/email and password.', 'error');
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.showMessage(response.message || 'Login successful.', 'success');
        setTimeout(() => {
          this.onLoginSuccess.emit();
          this.resetForm();
        }, 500);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.showMessage(errorMessage, 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
  }

  private resetForm(): void {
    this.credentials = { username: '', password: '' };
    this.message = '';
    this.isLoading = false;
  }
}