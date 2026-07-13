import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse } from './models';

const TOKEN_KEY = 'la-casa-nostra-admin-token';
const USER_KEY = 'la-casa-nostra-admin-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api';
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<string | null>(localStorage.getItem(USER_KEY));

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((response) => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  token(): string | null {
    const token = this.tokenSignal();
    if (token && this.isExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  username(): string | null {
    return this.userSignal();
  }

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, response.username);
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.username);
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      return Boolean(payload.exp && payload.exp * 1000 <= Date.now());
    } catch {
      return true;
    }
  }
}
