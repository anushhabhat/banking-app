import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="register-page" [class.active]="isVisible">
      <div class="register-container">
        <button 
          (click)="onClose.emit()"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold focus:outline-none">
          &times;
        </button>
        <h1 class="text-3xl font-extrabold text-center text-blue-800 mb-8">Your Bank</h1>
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-6">
          <div>
            <label for="registerUsername" class="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input 
              type="text" 
              id="registerUsername" 
              name="username"
              [(ngModel)]="userData.username"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="e.g., john.doe" 
              required>
          </div>
          <div>
            <label for="registerEmail" class="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input 
              type="email" 
              id="registerEmail" 
              name="email"
              [(ngModel)]="userData.email"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="e.g., john.doe@example.com" 
              required>
          </div>
          <div>
            <label for="registerFirstName" class="block text-gray-700 text-sm font-semibold mb-2">
              First Name
            </label>
            <input 
              type="text" 
              id="registerFirstName" 
              name="firstName"
              [(ngModel)]="userData.firstName"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="e.g., John" 
              required>
          </div>
          <div>
            <label for="registerLastName" class="block text-gray-700 text-sm font-semibold mb-2">
              Last Name
            </label>
            <input 
              type="text" 
              id="registerLastName" 
              name="lastName"
              [(ngModel)]="userData.lastName"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="e.g., Doe" 
              required>
          </div>
          <div>
            <label for="registerPassword" class="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input 
              type="password" 
              id="registerPassword" 
              name="password"
              [(ngModel)]="userData.password"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="Minimum 8 characters" 
              required>
          </div>
          <div>
            <label for="confirmPassword" class="block text-gray-700 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-colors" 
              placeholder="Re-enter your password" 
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
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
          <p class="text-center text-sm text-gray-600 mt-4">
            Already have an account? 
            <button 
              type="button"
              (click)="onSwitchToLogin.emit()"
              class="text-blue-600 hover:underline focus:outline-none">
              Login
            </button>
          </p>
        </form>
      </div>
    </section>
  `
})
export class RegisterComponent {
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSwitchToLogin = new EventEmitter<void>();

  userData: RegisterRequest = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  };

  confirmPassword: string = '';
  message: string = '';
  messageType: 'success' | 'error' = 'error';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.showMessage(response.message || 'Registration successful.', 'success');
        this.resetForm();
        setTimeout(() => {
          this.onSwitchToLogin.emit();
        }, 1500);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.showMessage(errorMessage, 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.userData.username || !this.userData.email || !this.userData.firstName || 
        !this.userData.lastName || !this.userData.password || !this.confirmPassword) {
      this.showMessage('Please fill in all required fields.', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return false;
    }

    if (this.userData.password.length < 8) {
      this.showMessage('Password must be at least 8 characters long.', 'error');
      return false;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.showMessage('Passwords do not match.', 'error');
      return false;
    }

    return true;
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
  }

  private resetForm(): void {
    this.userData = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    };
    this.confirmPassword = '';
    this.message = '';
    this.isLoading = false;
  }
}