import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-md py-4 sticky top-0 z-50">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <span class="text-2xl font-bold text-blue-800 rounded-md p-2">
          Your Bank
        </span>
        <nav>
          <ul class="flex space-x-6 items-center">
            <li *ngIf="!isDashboard">
              <button (click)="scrollToSection.emit('home')" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Home
              </button>
            </li>
            <li *ngIf="isDashboard">
              <button (click)="scrollToSection.emit('dashboard')" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Dashboard
              </button>
            </li>
            <li>
              <button (click)="scrollToSection.emit('services')" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Services
              </button>
            </li>
            <li *ngIf="!isDashboard">
              <button (click)="scrollToSection.emit('about')" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                About Us
              </button>
            </li>
            <li *ngIf="isDashboard">
              <button (click)="scrollToSection.emit('profile')" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Contact Us
              </button>
            </li>
            <li *ngIf="!isDashboard">
              <button (click)="scrollToSection.emit('contact')" class="text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md p-2 hover:bg-gray-100">
                Contact
              </button>
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

  @Output() scrollToSection = new EventEmitter<string>();
}
