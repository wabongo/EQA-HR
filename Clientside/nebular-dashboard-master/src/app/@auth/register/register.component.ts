import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, NbRegisterComponent } from '@nebular/auth';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../auth.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  // styleUrls: ['./register.component.scss']
})
export class NgxRegisterComponent extends NbRegisterComponent {
  user: RegisterRequest = {
    username: '',
    designation: '',
    facility: '',
    idNumber: '',
    phoneNumber: '',
    email: '',
    role: '',
    terms: '',
  };

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  showMessages: any = { error: true, success: true };

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private authService: AuthService
  ) {
    super(service, options, cd, router);
  }

  register(): void {
    this.submitted = true;
    console.log('Registering user:', this.user);
    this.authService.register(this.user).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.messages = ['Registration successful!'];
        this.errors = [];
        this.submitted = false;
        // Assuming the backend returns accessToken and refreshToken
        const { accessToken, refreshToken } = res;
        // Handle tokens here (store them, etc.)
        this.router.navigate(['/pages/home']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errors = ['Registration failed. Please try again.'];
        this.messages = [];
        this.submitted = false;
      },
    });
  }

  getConfigValue(key: string): any {
    // Mock function to get configuration values
    const config = {
      'forms.validation.fullName.required': true,
      'forms.validation.fullName.minLength': 3,
      'forms.validation.fullName.maxLength': 50,
      'forms.validation.email.required': true,
      'forms.validation.password.required': true,
      'forms.validation.password.minLength': 8,
      'forms.validation.password.maxLength': 50,
      'forms.register.terms': true,
    };
    return config[key];
  }
}
