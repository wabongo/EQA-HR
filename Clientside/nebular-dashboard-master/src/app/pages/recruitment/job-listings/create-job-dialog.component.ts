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
            <input nbInput fullWidth id="designation" formControlName="designation" aria-describedby="designationError">
            <div *ngIf="jobForm.get('designation').invalid && jobForm.get('designation').touched" id="designationError" class="error-message">
              Designation is required.
            </div>
          </div>
          <div class="form-group">
            <label for="facility">Facility</label>
            <input nbInput fullWidth id="facility" formControlName="facility" aria-describedby="facilityError">
            <div *ngIf="jobForm.get('facility').invalid && jobForm.get('facility').touched" id="facilityError" class="error-message">
              Facility is required.
            </div>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea nbInput fullWidth id="description" formControlName="description" aria-describedby="descriptionError"></textarea>
            <div *ngIf="jobForm.get('description').invalid && jobForm.get('description').touched" id="descriptionError" class="error-message">
              Description is required.
            </div>
          </div>
          <div class="form-group">
            <label for="requirements">Requirements</label>
            <textarea nbInput fullWidth id="requirements" formControlName="requirements" aria-describedby="requirementsError"></textarea>
            <div *ngIf="jobForm.get('requirements').invalid && jobForm.get('requirements').touched" id="requirementsError" class="error-message">
              Requirements are required.
            </div>
          </div>
          <div class="form-group">
            <label for="deadline">Deadline</label>
            <input nbInput fullWidth type="date" id="deadline" formControlName="deadline" aria-describedby="deadlineError">
            <div *ngIf="jobForm.get('deadline').invalid && jobForm.get('deadline').touched" id="deadlineError" class="error-message">
              Deadline is required.
            </div>
          </div>
          <div class="button-group">
            <button nbButton status="primary" type="submit" [disabled]="!jobForm.valid">Create</button>
            <button nbButton status="basic" type="button" (click)="cancel()">Cancel</button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .error-message {
      color: red;
      font-size: 0.875em;
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    nb-card {
      width: 600px; /* Adjust the width as needed */
      max-width: 100%;
    }
  `]
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
    if (this.jobForm.valid) {
      this.dialogRef.close(this.jobForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
