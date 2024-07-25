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

        if (response.data && response.data.firstLogin) {
          console.log('First login detected. Redirecting to change password page.');
          this.router.navigate(['/auth/reset-password']);
        } else if (response.message === "Authentication successful") {
          this.showMessages.sucess = true;
          if (response.data && response.data.access_token && response.data.refresh_token) {
            console.log('Login successful. Storing tokens.');
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            this.router.navigate(['/pages/home']);
          } else {
            console.error('Expected tokens not found in response');
            this.errors = ['Unexpected response structure from server'];
            this.showMessages.error = true;
          }
        } else {
          console.error('Unexpected response message:', response.message);
          this.errors = ['Unexpected response from server. Please try again.'];
          this.showMessages.error = true;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.submitted = false;
        if (error.status === 401) {
          this.errors = [error.error.message || 'Invalid credentials'];
        } else {
          this.errors = [error.error.message || 'Login failed due to server error.'];
        }
        this.showMessages.error = true;
      }
    });
  }
}
