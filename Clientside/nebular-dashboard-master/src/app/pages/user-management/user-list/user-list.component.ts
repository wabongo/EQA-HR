import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service';
import { RegisterRequest } from '../../../@auth/auth.models';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../@auth/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: RegisterRequest[] = [];

  constructor(
    private userService: UserManagementService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('No access token available');
      this.router.navigate(['/auth/login']); // Redirect to the login page
      return; // Stop execution if no token is available
    }

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users', error);
        // Optional: Handle the error as needed
      }
    });
  }

  navigateToCreateUser(): void {
    this.router.navigate(['/pages/user-management/create-user']); // Match this with the actual path in your routing module
  }
}