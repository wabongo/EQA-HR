import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegisterRequest, ChangePasswordRequest } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userApi = environment.userApi;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user$ = this.currentUserSubject.asObservable();

  private profileFetched = false; // Flag to prevent multiple fetches

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private log(message: string) {
    console.log(`AuthService: ${message}`);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.userApi}/api/v1/auth/authenticate`, credentials).pipe(
      tap(response => {
        if (response.message === 'Authentication successful' && response.data) {
          if (response.data.access_token && response.data.refresh_token) {
            this.setTokens(response.data.access_token, response.data.refresh_token);
          } else {
            console.error('Expected tokens not found in response');
          }
        }
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.user$;
  }

  private fetchUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.userApi}/api/v1/users/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.log('User profile fetched');
        this.currentUserSubject.next(user.data); // Update the BehaviorSubject with user data
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(error);
      })
    );
  }

  updateUserProfile(): void {
    if (!this.profileFetched) { // Check if profile has already been fetched
      this.profileFetched = true;
      this.fetchUserProfile().subscribe();
    }
  }

  getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return this.refreshToken || localStorage.getItem('refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this.updateUserProfile(); // Update user profile when tokens are set
  }

  refreshTokenRequest(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{ access_token: string, refresh_token?: string }>(`${this.userApi}/api/v1/auth/refresh-token`, {}, { headers }).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.setTokens(response.access_token, response.refresh_token || this.getRefreshToken() || '');
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    this.log('Attempting registration');
    return this.http.post<any>(`${this.userApi}/api/v1/auth/register`, data);
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    this.log('Attempting password change');
    return this.http.patch<any>(`${this.userApi}/api/v1/auth/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  logout(): Observable<any> {
    this.log('Attempting logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessToken = null;
    this.refreshToken = null;
    return this.http.post<any>(`${this.userApi}/api/v1/auth/logout`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.log('Tokens cleared from memory');
        this.currentUserSubject.next(null); // Clear user on logout
      })
    );
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<{ access_token: string }>(`${this.userApi}/api/v1/auth/refresh-token`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      })
    }).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.setTokens(response.access_token, this.getRefreshToken() || '');
        }
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
  }
}