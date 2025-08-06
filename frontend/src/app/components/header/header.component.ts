import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="logo" (click)="navigate('dashboard')">
          <div class="logo-icon">🏦</div>
          <span class="logo-text">NeoBank</span>
        </div>
        
        <nav class="nav">
          <button 
            class="nav-item"
            (click)="navigate('dashboard')"
            [class.active]="activeView === 'dashboard'">
            <span class="nav-icon">📊</span>
            Dashboard
          </button>
          <button 
            class="nav-item"
            (click)="navigate('cards')"
            [class.active]="activeView === 'cards'">
            <span class="nav-icon">💳</span>
            Cards
          </button>
          <button 
            class="nav-item"
            (click)="navigate('loans')"
            [class.active]="activeView === 'loans'">
            <span class="nav-icon">💰</span>
            Loans
          </button>
          <button class="logout-btn" (click)="onLogout()">
            <span class="logout-icon">🚪</span>
            Logout
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
      border-bottom: 2px solid #333;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    
    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .logo:hover {
      transform: scale(1.05);
    }
    
    .logo-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }
    
    .logo-text {
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      border: 1px solid #444;
      border-radius: 12px;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .nav-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .nav-item:hover::before {
      left: 100%;
    }
    
    .nav-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
      border-color: #666;
    }
    
    .nav-item.active {
      background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
      border-color: #777;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
    }
    
    .nav-icon {
      font-size: 1.2rem;
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
      border: 1px solid #ff6666;
      border-radius: 12px;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-left: 1rem;
    }
    
    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 68, 68, 0.3);
      background: linear-gradient(135deg, #ff6666 0%, #ff4444 100%);
    }
    
    .logout-icon {
      font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
        flex-direction: column;
        height: auto;
        gap: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
      
      .nav {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .nav-item, .logout-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
  @Output() navigation = new EventEmitter<string>();
  
  activeView: string = 'dashboard';

  onLogout() {
    this.logout.emit();
  }

  navigate(view: string) {
    this.activeView = view;
    this.navigation.emit(view);
  }
}