import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthService } from '../auth.service'; // Import the AuthService

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private authService: AuthService
  ) {
    super(service, options, cd, router);
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService.login(this.user).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.submitted = false;

        // Handle case where password change is required
        if (response.data && response.data.changePasswordRequired) {
          console.log('Change password required');
          this.router.navigate(['/auth/reset-password']);
        } else if (response.data && response.data.access_token && response.data.refresh_token) {

          console.log('Login successful');
          this.router.navigate(['/pages/home']);
        } else {
          console.log('Unexpected response structure:', response);
          this.errors = ['Unexpected response from server. Please try again.'];
          this.showMessages.error = true;
        }
      },
      error: (error) => {
        console.log('Login error:', error);
        this.submitted = false;
        if (error.status === 401) {
          this.errors = [error.error.message || 'Invalid credentials'];
        } else {
          this.errors = [error.error.message || 'Login failed due to server error.'];
        }
        this.showMessages.error = true; // Make sure to set this flag to show the alert
      }
    });
  }
}
