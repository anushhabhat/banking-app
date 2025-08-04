import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8082/user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('userName');
    
    if (userId && userName) {
      const user: User = {
        id: parseInt(userId),
        username: userName,
        email: '',
        firstName: '',
        lastName: ''
      };
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/signin`, credentials)
      .pipe(
        tap(response => {
          if (response.user) {
            sessionStorage.setItem('userId', response.user.id.toString());
            sessionStorage.setItem('userName', response.username || credentials.username);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/signup`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          sessionStorage.clear();
          this.currentUserSubject.next(null);
        })
      );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}