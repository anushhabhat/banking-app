import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoanDashboardComponent } from './pages/loan-dashboard/loan-dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'loans', component: LoanDashboardComponent },
  { path: '**', redirectTo: '' }
];