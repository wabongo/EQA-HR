import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterRequest, ChangePasswordRequest } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userApi = environment.userApi;

  constructor(private http: HttpClient) { }

  login(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.userApi}/api/v1/auth/authenticate`, user).pipe(
      map(response => {
        return {
          data: response.data,
          message: response.message,
          status: response.status
        };
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.userApi}/api/v1/auth/register`, data);
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    return this.http.patch<any>(`${this.userApi}/api/v1/auth/change-password`, passwordData);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.userApi}/api/v1/auth/logout`, {});
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${environment.userApi}/api/v1/auth/refresh-token`, {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        // The backend handles setting the new HttpOnly cookies
        // We don't need to do anything with the response here
      })
    );
  }
}
function tap(arg0: () => void): import("rxjs").OperatorFunction<any, any> {
  throw new Error('Function not implemented.');
}

