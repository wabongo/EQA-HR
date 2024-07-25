import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementComponent } from '../user-management.component';
import { UserManagementService } from '../user-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserManagementService, private router:Router) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      designation: ['', Validators.required],
      facility: ['', Validators.required],
      idNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      terms: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: (response) => {
          console.log('User created:', response);
          this.router.navigate(['/pages/user-management']);
        },
        error: (err) => console.error('Error creating user:', err),
      });
    }
  }
  
}
