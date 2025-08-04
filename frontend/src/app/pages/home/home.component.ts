import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';
import { RegisterComponent } from '../../components/register/register.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    LoginModalComponent, 
    RegisterComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header 
        [currentUser]="currentUser"
        [isDashboard]="false"
        (onLogin)="showLoginModal()"
        (onRegister)="showRegisterPage()"
        (onLogout)="logout()">
      </app-header>

      <main class="flex-1" [style.display]="showRegister ? 'none' : 'block'">
        <!-- Hero Section -->
        <section id="home" class="hero-background text-white py-20 md:py-32 text-center rounded-b-lg shadow-lg">
          <div class="container mx-auto px-4">
            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Your Future, Secured with Your Bank
            </h1>
            <p class="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in">
              Experience seamless banking, innovative solutions, and trusted financial partnership.
            </p>
            <button 
              (click)="showRegisterPage()"
              class="btn-primary inline-block text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Open an Account Today
            </button>
          </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-16 md:py-24 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-800">Our Comprehensive Services</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9H19.5m-16.5 5.25h16.5m-13.5-9L12 3l9.75 6.75" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Accounts</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Savings, Checking, and Investment accounts tailored for every financial goal.
                </p>
              </div>
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Fund Transfers</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Fast, secure, and convenient money transfers, local and international.
                </p>
              </div>
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Loans</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Personal, Home, and Business loans with competitive rates and flexible terms.
                </p>
              </div>
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9H19.5m-16.5 5.25h16.5m-13.5-9L12 3l9.75 6.75" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Cards</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Credit and Debit cards with rewards, security, and worldwide acceptance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- About Us Section -->
        <section id="about" class="py-16 md:py-24 bg-gray-100">
          <div class="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div class="md:w-1/2">
              <img src="https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Banking Image" class="rounded-xl shadow-lg w-full h-auto object-cover">
            </div>
            <div class="md:w-1/2">
              <h2 class="text-3xl md:text-4xl font-bold mb-6 text-blue-800">Why Choose Your Bank?</h2>
              <p class="text-lg text-gray-700 mb-6 leading-relaxed">
                At Your Bank, we are committed to providing innovative and secure financial solutions that empower our customers. With a focus on digital convenience and personalized service, we help you achieve your financial aspirations.
              </p>
              <ul class="space-y-4 text-gray-700 text-lg">
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-500 mr-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Secure & Reliable Banking
                </li>
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-500 mr-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24/7 Customer Support
                </li>
                <li class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-500 mr-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Competitive Rates & Fees
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section id="contact" class="py-16 md:py-24 bg-blue-800 text-white text-center rounded-t-lg shadow-lg">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Financial Journey?</h2>
            <p class="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Join thousands of satisfied customers who trust Your Bank for their financial needs.
            </p>
            <button 
              (click)="showRegisterPage()"
              class="btn-secondary inline-block py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      <app-register
        [isVisible]="showRegister"
        (onClose)="hideRegister()"
        (onSwitchToLogin)="switchToLogin()">
      </app-register>

      <app-footer></app-footer>

      <app-login-modal
        [isVisible]="showLogin"
        (onClose)="hideLogin()"
        (onSwitchToRegister)="switchToRegister()"
        (onLoginSuccess)="onLoginSuccess()">
      </app-login-modal>
    </div>
  `
})
export class HomeComponent {
  currentUser: User | null = null;
  showLogin: boolean = false;
  showRegister: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Redirect to dashboard if user is logged in
        window.location.href = '/dashboard';
      }
    });
  }

  showLoginModal(): void {
    this.showLogin = true;
    this.showRegister = false;
    document.body.style.overflow = 'hidden';
  }

  showRegisterPage(): void {
    this.showRegister = true;
    this.showLogin = false;
    document.body.style.overflow = 'auto';
    window.scrollTo(0, 0);
  }

  hideLogin(): void {
    this.showLogin = false;
    document.body.style.overflow = 'auto';
  }

  hideRegister(): void {
    this.showRegister = false;
    document.body.style.overflow = 'auto';
  }

  switchToLogin(): void {
    this.showRegister = false;
    this.showLogin = true;
    document.body.style.overflow = 'hidden';
  }

  switchToRegister(): void {
    this.showLogin = false;
    this.showRegister = true;
    document.body.style.overflow = 'auto';
  }

  onLoginSuccess(): void {
    this.hideLogin();
    // Navigation will be handled by the subscription in constructor
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/';
      },
      error: () => {
        sessionStorage.clear();
        window.location.href = '/';
      }
    });
  }
}