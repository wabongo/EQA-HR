import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../department.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit {
  departmentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.departmentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }


  
  onSubmit() {
    if (this.departmentForm.valid) {
      this.departmentService.createDepartment(this.departmentForm.value).subscribe({
        next: (response) => {
          this.toastrService.success('Department created successfully', 'Success');
          this.router.navigate(['/configurations/departments']);
        },
        error: (error) => {
          this.toastrService.danger('Error creating department', 'Error');
          console.error('Error creating department:', error);
        }
      });
    }
  }
}