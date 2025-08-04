import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-md py-4 sticky top-0 z-50">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <a href="#" class="text-2xl font-bold text-blue-800 rounded-md p-2 hover:bg-blue-50 transition-colors">
          Your Bank
        </a>
        <nav>
          <ul class="flex space-x-6 items-center">
            <li *ngIf="!isDashboard">
              <a href="#home" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Home
              </a>
            </li>
            <li *ngIf="isDashboard">
              <a href="#dashboard" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#services" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Services
              </a>
            </li>
            <li *ngIf="!isDashboard">
              <a href="#about" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                About Us
              </a>
            </li>
            <li *ngIf="isDashboard">
              <a href="#profile" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Profile
              </a>
            </li>
            <li *ngIf="!isDashboard">
              <a href="#contact" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Contact
              </a>
            </li>
            <li *ngIf="!currentUser">
              <button 
                (click)="onLogin.emit()"
                class="btn-primary text-white font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">
                Login
              </button>
            </li>
            <li *ngIf="!currentUser">
              <button 
                (click)="onRegister.emit()"
                class="btn-secondary font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">
                Register
              </button>
            </li>
            <li *ngIf="currentUser">
              <button 
                (click)="onLogout.emit()"
                class="btn-primary text-white font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() currentUser: User | null = null;
  @Input() isDashboard: boolean = false;
  @Output() onLogin = new EventEmitter<void>();
  @Output() onRegister = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();
}