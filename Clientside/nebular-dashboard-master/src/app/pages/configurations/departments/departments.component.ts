import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Department } from './department.model';

import { Column } from '../../../shared/smart-table/smart-table.component';
import { DepartmentService } from './department.service';
import { UpdateDepartmentDialogComponent } from './update-department-dialog/update-department-dialog.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  columns: Column[] = [
    { key: 'name', title: 'Name' },
    { key: 'description', title: 'Description' },
  ];

  constructor(
    private departmentService: DepartmentService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        console.log('Loaded departments:', this.departments);
      },
      error: (error) => {
        console.error('Error loading departments', error);
      }
    });
  }

  navigateToCreateDepartment(): void {
    this.router.navigate(['/pages/configurations/departments/create-department/create']);
  }

  openUpdateModal(event: { data: Department }): void {
    const department = event.data;
    this.dialogService.open(UpdateDepartmentDialogComponent, {
      context: {
        department: {...department}
      },
    }).onClose.subscribe((updatedDepartment: Department) => {
      if (updatedDepartment) {
        this.departmentService.updateDepartment(updatedDepartment.id, updatedDepartment).subscribe({
          next: (result) => {
            const index = this.departments.findIndex(d => d.id === result.data.id);
            if (index !== -1) {
              this.departments[index] = result.data;
            }
          },
          error: (error) => {
            console.error('Error updating department', error);
          }
        });
      }
    });
  }

  deleteDepartment(event: { data: Department }): void {
    const department = event.data;
    if (department.id) {
      this.departmentService.deleteDepartment(department.id).subscribe({
        next: () => {
          this.departments = this.departments.filter(d => d.id !== department.id);
        },
        error: (error) => {
          console.error('Error deleting department', error);
        }
      });
    }
  }
}