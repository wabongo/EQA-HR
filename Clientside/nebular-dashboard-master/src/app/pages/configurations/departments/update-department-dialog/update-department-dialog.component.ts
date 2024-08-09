import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Department } from "../department.model";


@Component({
  selector: 'app-update-department-dialog',
  templateUrl: './update-department-dialog.component.html',
  styleUrls: ['./update-department-dialog.component.scss']
})
export class UpdateDepartmentDialogComponent implements OnInit {
  departmentForm: FormGroup;
  department: Department;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<UpdateDepartmentDialogComponent>
  ) {}

  ngOnInit() {
    this.initForm();
    this.populateForm();
  }

  initForm() {
    this.departmentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  populateForm() {
    if (this.department) {
      this.departmentForm.patchValue(this.department);
    }
  }

  submit() {
    if (this.departmentForm.valid) {
      const updatedDepartment = { ...this.department, ...this.departmentForm.value };
      this.dialogRef.close(updatedDepartment);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}