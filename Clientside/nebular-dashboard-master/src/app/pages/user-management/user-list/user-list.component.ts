import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service';
import { RegisterRequest } from '../../../@auth/auth.models';
import { Router } from '@angular/router';
import { AuthService } from '../../../@auth/auth.service';
import { NbDialogService } from '@nebular/theme';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: RegisterRequest[] = [];
  paginatedUsers: RegisterRequest[] = [];
  selectedUser: RegisterRequest | null = null;
  searchQuery: string = '';
  pageSize: number = 1; // Updated page size
  currentPage: number = 1;
  totalItems: number = 0;
  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserManagementService,
    private router: Router,
    private authService: AuthService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('No access token available');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalItems = this.users.length;
        this.paginateUsers();
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  searchUsers(): void {
    this.currentPage = 1;
    this.paginateUsers();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.paginateUsers();
  }

  paginateUsers(): void {
    let filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.sortField) {
      filteredUsers.sort((a, b) => {
        const valueA = (a as any)[this.sortField];
        const valueB = (b as any)[this.sortField];
        return (this.sortOrder === 'asc' ? 1 : -1) * ((valueA > valueB) ? 1 : (valueA < valueB) ? -1 : 0);
      });
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    this.totalItems = filteredUsers.length;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('Current Page:', this.currentPage);
    this.paginateUsers();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage++;
      this.paginateUsers();
    }
  }

  viewUser(user: RegisterRequest): void { }
  
  navigateToCreateUser(): void {
    this.router.navigate(['/pages/user-management/users/create-user']);
  }

  exportData(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'user_data.xlsx');
  }

  bulkDelete(): void {
    // Implement bulk delete logic here
  }
}