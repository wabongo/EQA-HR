import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { JoblistingsRequest } from './job-listings.model';

@Component({
  selector: 'app-update-job-dialog',
  template: `
    <nb-card>
      <nb-card-header>Update Job Post</nb-card-header>
      <nb-card-body>
        <form [formGroup]="jobForm" (ngSubmit)="submitForm()">
          <div class="form-group">
            <label for="designation">Designation</label>
            <input nbInput fullWidth id="designation" formControlName="designation" />
          </div>
          <div class="form-group">
            <label for="facility">Facility</label>
            <input nbInput fullWidth id="facility" formControlName="facility" />
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
            <input nbInput fullWidth type="date" id="deadline" formControlName="deadline" />
          </div>
          <div class="button-group">
            <button nbButton status="primary" type="submit" [disabled]="!jobForm.valid">Update</button>
            <button nbButton status="basic" type="button" (click)="cancel()">Cancel</button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `
})
export class UpdateJobDialogComponent implements OnInit {
  jobForm: FormGroup;
  @Input() job: JoblistingsRequest | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<UpdateJobDialogComponent>
  ) {
    this.jobForm = this.fb.group({
      designation: ['', Validators.required],
      facility: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.job) {
      this.jobForm.patchValue(this.job);
    }
  }

  submitForm() {
    if (this.jobForm.valid) {
      const updatedJob: JoblistingsRequest = { ...this.job, ...this.jobForm.value };
      this.dialogRef.close(updatedJob);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
