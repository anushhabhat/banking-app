import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthComponent } from './components/auth/auth.component';
import { CardServiceComponent } from './components/card-service/card-service.component';
import { LoanServiceComponent } from './components/loan-service/loan-service.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    DashboardComponent,
    AuthComponent,
    CardServiceComponent,
    LoanServiceComponent
  ],
  template: `
    <div class="app-container">
      <app-header 
        *ngIf="currentView !== 'auth'"
        (logout)="handleLogout()"
        (navigation)="handleNavigation($event)">
      </app-header>
      
      <main class="main-content">
        <app-auth 
          *ngIf="currentView === 'auth'"
          (loginSuccess)="handleLoginSuccess($event)">
        </app-auth>
        
        <app-dashboard 
          *ngIf="currentView === 'dashboard'"
          [userName]="userName"
          (navigate)="handleNavigation($event)">
        </app-dashboard>
        
        <app-card-service 
          *ngIf="currentView === 'cards'">
        </app-card-service>
        
        <app-loan-service 
          *ngIf="currentView === 'loans'">
        </app-loan-service>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #0f0f0f 100%);
      color: #ffffff;
    }
    
    .main-content {
      min-height: calc(100vh - 80px);
    }
  `]
})
export class AppComponent {
  currentView: 'auth' | 'dashboard' | 'cards' | 'loans' = 'auth';
  userName: string = '';

  ngOnInit() {
    const storedUser = sessionStorage.getItem('userName');
    if (storedUser) {
      this.userName = storedUser;
      this.currentView = 'dashboard';
    }
  }

  handleLoginSuccess(userData: any) {
    this.userName = userData.username || userData.userName;
    sessionStorage.setItem('userName', this.userName);
    sessionStorage.setItem('userId', userData.userId || userData.id);
    this.currentView = 'dashboard';
  }

  handleLogout() {
    sessionStorage.clear();
    this.currentView = 'auth';
    this.userName = '';
  }

  handleNavigation(view: string) {
    this.currentView = view as any;
  }
}