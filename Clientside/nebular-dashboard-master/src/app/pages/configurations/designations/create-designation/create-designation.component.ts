import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DesignationService } from '../designation.service';

import { NbToastrService } from '@nebular/theme';
import { Department } from '../../departments/department.model';
import { DepartmentService } from '../../departments/department.service';


@Component({
  selector: 'app-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.scss']
})
export class CreateDesignationComponent implements OnInit {
  designationForm: FormGroup;
  departments: Department[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private designationService: DesignationService,
    private departmentService: DepartmentService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    this.designationForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      departmentId: ['', Validators.required]
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments', error);
      }
    });
  }

  onSubmit() {
    if (this.designationForm.valid) {
      this.designationService.createDesignation(this.designationForm.value).subscribe({
        next: (response) => {
          this.toastrService.success('Designation created successfully', 'Success');
          this.router.navigate(['/configurations/designations']);
        },
        error: (error) => {
          this.toastrService.danger('Error creating designation', 'Error');
          console.error('Error creating designation:', error);
        }
      });
    }
  }
}