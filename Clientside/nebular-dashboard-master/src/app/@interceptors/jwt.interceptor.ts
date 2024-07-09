import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../@auth/auth.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}
//added if statement. redo if error exeperienced.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has('Authorization')) {
      return next.handle(request);
    }
    console.log('Intercepting request:', request.url);

    if (this.shouldAddToken(request)) {
      const token = this.authService.getAccessToken();
      if (token) {
        if (this.isTokenExpired(token)) {
          console.log('Token is expired, refreshing');
          return this.handleExpiredToken(request, next);
        } else {
          console.log('Adding valid token to request');
          request = this.addToken(request, token);
        }
      } else {
        console.log('No token found, proceeding without token');
      }
    } else {
      console.log('Not adding token to request');
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('Caught 401 error, handling');
          return this.handle401Error(request, next);
        } else {
          console.error('Error in interceptor:', error);
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
        console.log('Invalid token format');
        return true;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      console.log('Token expiry time:', new Date(expiryTime));
      console.log('Current time:', new Date(currentTime));

      return currentTime > expiryTime;
    } catch (error) {
      console.error('Error parsing token:', error);
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
