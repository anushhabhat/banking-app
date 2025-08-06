import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <div class="logo-icon">🏦</div>
            <h1 class="logo-text">NeoBank</h1>
          </div>
          <p class="tagline">Your Future, Secured with Modern Banking</p>
        </div>

        <div class="auth-tabs">
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'login'"
            (click)="activeTab = 'login'">
            Sign In
          </button>
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'register'"
            (click)="activeTab = 'register'">
            Create Account
          </button>
        </div>

        <!-- Login Form -->
        <form *ngIf="activeTab === 'login'" (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              type="text" 
              [(ngModel)]="loginData.username"
              name="username"
              class="form-input"
              placeholder="Enter your Username"
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              [(ngModel)]="loginData.password"
              name="password"
              class="form-input"
              placeholder="Enter your password"
              required>
          </div>
          
          <button type="submit" class="submit-btn" [disabled]="isLoading">
            <span *ngIf="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Register Form -->
        <form *ngIf="activeTab === 'register'" (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input 
                type="text" 
                [(ngModel)]="registerData.firstName"
                name="firstName"
                class="form-input"
                placeholder="John"
                required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input 
                type="text" 
                [(ngModel)]="registerData.lastName"
                name="lastName"
                class="form-input"
                placeholder="Doe"
                required>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              type="text" 
              [(ngModel)]="registerData.username"
              name="username"
              class="form-input"
              placeholder="john.doe"
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              [(ngModel)]="registerData.email"
              name="email"
              class="form-input"
              placeholder="john.doe@example.com"
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              [(ngModel)]="registerData.password"
              name="password"
              class="form-input"
              placeholder="Minimum 8 characters"
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              class="form-input"
              placeholder="Re-enter your password"
              required>
          </div>
          
          <button type="submit" class="submit-btn" [disabled]="isLoading">
            <span *ngIf="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div *ngIf="message" class="message" [class.error]="isError" [class.success]="!isError">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%);
    }
    
    .auth-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 20px;
      padding: 3rem;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .logo-icon {
      font-size: 3rem;
      filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
    }
    
    .logo-text {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }
    
    .tagline {
      color: #cccccc;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .auth-tabs {
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
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
    }
    
    .auth-form {
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
      .auth-container {
        padding: 1rem;
      }
      
      .auth-card {
        padding: 2rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AuthComponent {
  @Output() loginSuccess = new EventEmitter<any>();
  
  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  message = '';
  isError = false;
  
  loginData = {
    username: '',
    password: ''
  };
  
  registerData = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  };
  
  confirmPassword = '';

  constructor(private http: HttpClient) {}

  async onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      this.showMessage('Please fill in all fields', true);
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const response: any = await this.http.post('http://localhost:8082/user/signin', this.loginData).toPromise();
      
      this.showMessage('Login successful!', false);
      setTimeout(() => {
        this.loginSuccess.emit({
          username: response.username || this.loginData.username,
          userId: response.user?.id || response.id
        });
      }, 1000);
    } catch (error: any) {
      this.showMessage(error.error?.message || 'Login failed. Please try again.', true);
    } finally {
      this.isLoading = false;
    }
  }

  async onRegister() {
    if (!this.registerData.username || !this.registerData.email || 
        !this.registerData.firstName || !this.registerData.lastName || 
        !this.registerData.password || !this.confirmPassword) {
      this.showMessage('Please fill in all fields', true);
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.showMessage('Passwords do not match', true);
      return;
    }

    if (this.registerData.password.length < 8) {
      this.showMessage('Password must be at least 8 characters long', true);
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const response: any = await this.http.post('http://localhost:8082/user/signup', this.registerData).toPromise();
      
      this.showMessage('Registration successful! Please sign in.', false);
      setTimeout(() => {
        this.activeTab = 'login';
        this.resetForms();
      }, 2000);
    } catch (error: any) {
      this.showMessage(error.error?.message || 'Registration failed. Please try again.', true);
    } finally {
      this.isLoading = false;
    }
  }

  private showMessage(text: string, isError: boolean) {
    this.message = text;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  private resetForms() {
    this.loginData = { username: '', password: '' };
    this.registerData = { username: '', email: '', firstName: '', lastName: '', password: '' };
    this.confirmPassword = '';
  }
}