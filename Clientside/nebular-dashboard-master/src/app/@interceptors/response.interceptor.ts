import { NbToastrService } from '@nebular/theme';
import { NbAuthService, NbAuthResult, getDeepFromObject, NB_AUTH_OPTIONS, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {Inject, Injectable, Injector} from '@angular/core';
import {tap, catchError} from 'rxjs/operators';
import { HttpRequest, HttpInterceptor, HttpEvent, HttpHandler } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector,
        @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter,
        @Inject(NB_AUTH_OPTIONS) protected options = {},
        private router: Router,
        private nbToastService: NbToastrService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.filter(request)) {
            return next.handle(request).pipe(
                catchError(err => {
                    switch(err.status) {
                        case 401:
                            // Consider implementing token refresh here instead of immediate redirect
                            this.nbToastService.danger('Session expired. Please log in again.', 'Unauthorized');
                            this.router.navigate(["/auth/login"]);
                            break;
                        case 403:
                            this.nbToastService.danger('You do not have permission to access this resource.', 'Forbidden');
                            break;
                        default:
                            this.nbToastService.danger('An error occurred. Please try again.', 'Error');
                    }
                    return throwError(err);
                })
            );
        } else {
            return next.handle(request);
        }
    }
}

