import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { NbResetPasswordComponent, NB_AUTH_OPTIONS, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChangePasswordRequest } from '../auth.models';

@Component({
  selector: 'ngx-reset-password-page',
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxResetPasswordComponent extends NbResetPasswordComponent {
  constructor(
    protected authService: NbAuthService,
    protected authCustomService: AuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router
  ) {
    super(authService, options, cd, router);
  }

  resetPassword(passwordData: ChangePasswordRequest): void {
    this.authCustomService.changePassword(passwordData).subscribe({
      next: (response) => {
        console.log('Password reset response:', response);
        this.router.navigate(['/auth/login']);
        this.showMessages.success = true;
      },
      error: (error) => {
        console.error('Failed to reset password', error);
        this.errors = ['Failed to reset password. Please try again.'];
        this.showMessages.error = true;
      }
    });
  }
}
