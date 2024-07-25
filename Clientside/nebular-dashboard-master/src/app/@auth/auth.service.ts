import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterRequest, ChangePasswordRequest } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userApi = environment.userApi;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(private http: HttpClient) { }

  private log(message: string) {
    console.log(`AuthService: ${message}`);
  }


  login(credentials: any): Observable<any> {
    // console.log('Credentials:', credentials);
    return this.http.post<any>(`${this.userApi}/api/v1/auth/authenticate`, credentials).pipe(
      tap(response => {
        console.log('Full response:', response);
        if (response.message === "Authentication successful" && response.data) {
          if (response.data.access_token && response.data.refresh_token) {
            this.setTokens(response.data.access_token, response.data.refresh_token);
          } else {
            console.error('Expected tokens not found in response');
          }
        }
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    // Store tokens in the service and localStorage
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }




  refreshTokenRequest(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.userApi}/api/v1/auth/refresh-token`, {}, { headers }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.accessToken);
        // Note: The backend sends back the same refresh token, so we don't need to update it
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken')
    return this.http.post<any>(`${this.userApi}/api/v1/auth/logout`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.accessToken = null;
        this.refreshToken = null;
        this.log('Tokens cleared from memory');
      })
    );
  }

// In your auth.service.ts
refreshAccessToken(): Observable<any> {
  const refreshToken = localStorage.getItem('refreshToken');
  return this.http.post<any>(`${this.userApi}/auth/refresh-token`, { refreshToken }).pipe(
    tap(response => {
      if (response && response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
    })
  );
}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

}
