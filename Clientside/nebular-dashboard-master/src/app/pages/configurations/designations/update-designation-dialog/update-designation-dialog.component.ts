import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Department } from "../../departments/department.model";
import { DepartmentService } from "../../departments/department.service";
import { Designation } from "../designation.model";


@Component({
  selector: 'app-update-designation-dialog',
  templateUrl: './update-designation-dialog.component.html',
  styleUrls: ['./update-designation-dialog.component.scss']
})
export class UpdateDesignationDialogComponent implements OnInit {
  designationForm: FormGroup;
  designation: Designation;
  departments: Department[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<UpdateDesignationDialogComponent>,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadDepartments();
    this.populateForm();
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

  populateForm() {
    if (this.designation) {
      this.designationForm.patchValue(this.designation);
    }
  }

  submit() {
    if (this.designationForm.valid) {
      const updatedDesignation = { ...this.designation, ...this.designationForm.value };
      this.dialogRef.close(updatedDesignation);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}