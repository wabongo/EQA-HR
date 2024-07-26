import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../@auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldAddToken(request)) {
      const token = this.authService.getAccessToken();
      if (!token) {
        console.log('No token found, redirecting to login page');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Redirecting to login page due to missing token'));
      }

      if (this.isTokenExpired(token)) {
        return this.handleExpiredToken(request, next);
      } else {
        request = this.addToken(request, token);
      }
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return true;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      return currentTime > expiryTime;
    } catch (error) {
      return true;
    }
  }

  private shouldAddToken(request: HttpRequest<any>): boolean {
    const excludedRoutes = ['/api/v1/auth/authenticate', '/api/v1/auth/register', '/api/v1/auth/refresh-token'];
    return !excludedRoutes.some(url => request.url.includes(url));
  }

  private handleExpiredToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshAccessToken().pipe(
      switchMap((token: any) => {
        return next.handle(this.addToken(request, token.accessToken));
      }),
      catchError(error => {
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}