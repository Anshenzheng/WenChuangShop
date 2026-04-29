import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.tokenSubject = new BehaviorSubject<string | null>(
      localStorage.getItem('token')
    );
  }
  
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
  
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }
  
  get token(): string | null {
    return this.tokenSubject.value;
  }
  
  get isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }
  
  get isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ROLE_ADMIN';
  }
  
  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${API_URL}/auth/login`, request)
      .pipe(
        tap(response => {
          if (response.code === 200 && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }
  
  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${API_URL}/auth/register`, request)
      .pipe(
        tap(response => {
          if (response.code === 200 && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }
  
  getCurrentUser(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${API_URL}/auth/me`);
  }
  
  private setAuthData(data: AuthResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    this.tokenSubject.next(data.token);
    this.currentUserSubject.next(data.user);
  }
}
