
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';
import { TransferModalComponent } from '../../components/transfer-modal/transfer-modal.component';
import { CardModalComponent } from '../../components/card-modal/card-modal.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    AccountModalComponent, 
    TransferModalComponent,
    CardModalComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header 
        [currentUser]="currentUser"
        [isDashboard]="true"
        (onLogout)="logout()">
      </app-header>

      <main class="flex-1">
        <!-- Welcome Section -->
        <section id="dashboard" class="hero-background text-white py-20 md:py-32 text-center rounded-b-lg shadow-lg">
          <div class="container mx-auto px-4">
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Welcome, <span>{{ userName }}!</span>
            </h1>
            <p class="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in">
              Manage your finances with ease and explore our services below.
            </p>
            <a href="#services" class="btn-primary inline-block text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Explore Services
            </a>
          </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-16 md:py-24 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-800">Your Banking Services</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9H19.5m-16.5 5.25h16.5m-13.5-9L12 3l9.75 6.75" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Accounts</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  View and manage your Savings, Checking, and Investment accounts.
                </p>
                <button 
                  (click)="showAccountModal()"
                  class="btn-primary mt-4 inline-block text-white font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">
                  Manage Accounts
                </button>
              </div>
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Fund Transfers</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Transfer money securely within your accounts or to others.
                </p>
                <button 
                  (click)="showTransferModal()"
                  class="btn-primary mt-4 inline-block text-white font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">
                  Transfer Now
                </button>
              </div>
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Loans</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Explore loan options or manage existing loans with ease.
                </p>
                <a href="#" class="btn-primary mt-4 inline-block text-white font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">View Loans</a>
              </div>
              <div class="bg-gray-50 p-8 rounded-xl card-shadow hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div class="text-blue-600 text-5xl mb-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9H19.5m-16.5 5.25h16.5m-13.5-9L12 3l9.75 6.75" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">Cards</h3>
                <p class="text-gray-600 text-center leading-relaxed">
                  Manage your Credit and Debit cards, view rewards, and more.
                </p>
                <button 
                  (click)="showCardModal()"
                  class="btn-primary mt-4 inline-block text-white font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">
                  Manage Cards
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <app-footer></app-footer>

      <app-account-modal
        [isVisible]="showAccountModalFlag"
        [userId]="userId"
        [userName]="userName"
        (onClose)="hideAccountModal()">
      </app-account-modal>

      <app-transfer-modal
        [isVisible]="showTransferModalFlag"
        [userId]="userId"
        (onClose)="hideTransferModal()"
        (onTransferSuccess)="onTransferSuccess()">
      </app-transfer-modal>

      <app-card-modal
        [isVisible]="showCardModalFlag"
        (onClose)="hideCardModal()">
      </app-card-modal>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userName: string = 'User';
  userId: number = 0;
  showAccountModalFlag: boolean = false;
  showTransferModalFlag: boolean = false;
 showCardModalFlag: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userName = user.username;
        this.userId = user.id;
      } else {
        // Redirect to home if not logged in
        window.location.href = '/';
      }
    });

    // Fallback to sessionStorage if user is not in service
    if (!this.currentUser) {
      const storedUserId = sessionStorage.getItem('userId');
      const storedUserName = sessionStorage.getItem('userName');
      
      if (storedUserId && storedUserName) {
        this.userId = parseInt(storedUserId);
        this.userName = storedUserName;
      } else {
        window.location.href = '/';
      }
    }
  }

  showAccountModal(): void {
    this.showAccountModalFlag = true;
  }

  hideAccountModal(): void {
    this.showAccountModalFlag = false;
  }

  showTransferModal(): void {
    this.showTransferModalFlag = true;
  }

  hideTransferModal(): void {
    this.showTransferModalFlag = false;
  }

 showCardModal(): void {
   this.showCardModalFlag = true;
 }

 hideCardModal(): void {
   this.showCardModalFlag = false;
 }

  onTransferSuccess(): void {
    // Refresh account data if needed
    console.log('Transfer successful');
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