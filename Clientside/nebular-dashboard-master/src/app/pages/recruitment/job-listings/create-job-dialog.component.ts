import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-create-job-dialog',
  template: `
    <nb-card>
      <nb-card-header>Create Job Post</nb-card-header>
      <nb-card-body>
        <form [formGroup]="jobForm" (ngSubmit)="submit()">
          <div class="form-group">
            <label for="designation">Designation</label>
            <input nbInput fullWidth id="designation" formControlName="designation">
          </div>
          <div class="form-group">
            <label for="facility">Facility</label>
            <input nbInput fullWidth id="facility" formControlName="facility">
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea nbInput fullWidth id="description" formControlName="description"></textarea>
          </div>
          <div class="form-group">
            <label for="requirements">Requirements</label>
            <textarea nbInput fullWidth id="requirements" formControlName="requirements"></textarea>
          </div>
          <div class="form-group">
            <label for="deadline">Deadline</label>
            <input nbInput fullWidth type="date" id="deadline" formControlName="deadline">
          </div>
          <button nbButton status="primary" type="submit" [disabled]="!jobForm.valid">Create</button>
          <button nbButton status="basic" type="button" (click)="cancel()">Cancel</button>
        </form>
      </nb-card-body>
    </nb-card>
  `
})
export class CreateJobDialogComponent {
  jobForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<CreateJobDialogComponent>
  ) {
    this.jobForm = this.formBuilder.group({
      designation: ['', Validators.required],
      facility: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  submit() {
    console.log('Form submitted. Form value:', this.jobForm.value);
    if (this.jobForm.valid) {
      console.log('Form is valid. Closing dialog with form value.');
      this.dialogRef.close(this.jobForm.value);
    } else {
      console.log('Form is invalid. Current errors:', this.jobForm.errors);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
