import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { NbAuthService, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { Router } from '@angular/router';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Always add withCredentials to send cookies with cross-origin requests
    req = req.clone({
      withCredentials: true,
    });

    if (!this.filter(req)) {
      return this.authService.isAuthenticatedOrRefresh()
        .pipe(
          switchMap(authenticated => {
            if (authenticated) {
              // If authenticated, just handle the request
              return next.handle(req);
            } else {
              // If not authenticated, still send the request
              return next.handle(req);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              // Redirect to login page or show login modal
              this.router.navigate(['/auth/login']);
            }
            return throwError(() => error);
          })
        );
    } else {
      // For filtered requests (e.g., login), just pass through
      return next.handle(req);
    }
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}
