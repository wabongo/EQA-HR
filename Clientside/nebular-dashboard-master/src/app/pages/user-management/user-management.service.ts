import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { RegisterRequest } from '../../@auth/auth.models';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../@auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private userApi = `${environment.userApi}/api/v1/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    if (!token) {
        console.error('No access token available');
        this.router.navigate(['/auth/login']); // Redirect to the login page
        return new HttpHeaders(); // Return an empty HttpHeaders
    }
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<RegisterRequest[]> {
    return this.http.get<{ message: string; data: RegisterRequest[] }>(this.userApi, { headers: this.getHeaders() }).pipe(
        map(response => response.data),
        catchError(error => {
            console.error('Error fetching users:', error);

            if (error.message.includes('No access token available')) {
                // Handle the scenario where no token is available
                console.error('Access token is missing. Redirecting to login.');
                this.router.navigate(['/auth/login']); // Redirect to login page
                return of([]); // Return an empty observable to handle the case gracefully
            }

            if (error.status === 401) {
                // Handle unauthorized access - possible token expiration
                console.error('Unauthorized access - likely invalid or expired token');
                return this.authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        // Retry the original request with the new token
                        const headers = this.getHeaders(); // Refresh headers with the new token
                        return this.http.get<{ message: string; data: RegisterRequest[] }>(this.userApi, { headers });
                    }),
                    map(response => response.data),
                    catchError(err => {
                        console.error('Failed to refresh token and fetch users', err);
                        this.router.navigate(['/auth/login']); // Redirect to login page
                        return of([]); // Return an empty observable to handle the case gracefully
                    })
                );
            } else if (error.status === 403) {
                // Handle forbidden access - possibly invalid permissions or token issues
                console.error('Forbidden access - check permissions or token validity');
                return of([]); // Return an empty observable to handle the case gracefully
            } else if (error.status === 404) {
                console.error('Users not found - please check the endpoint or data');
                return of([]); // Return an empty observable to handle the case gracefully
            } else {
                console.error('An unexpected error occurred:', error.message);
                return of([]); // Return an empty observable to handle the case gracefully
            }
        })
    );
  }

  createUser(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.userApi}/create-user`, user, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from create user:', response)),
      catchError(error => {
        console.error('Error in create user:', error);
        return throwError(() => error);
      })
    );
  }
}