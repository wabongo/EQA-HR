import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-job-dialog',
  template: `
    <nb-card>
      <nb-card-header>Create Job Post</nb-card-header>
      <nb-card-body>
        <form [formGroup]="jobForm" (ngSubmit)="submit()">
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
          <button nbButton status="primary" type="submit">Create</button>
          <button nbButton status="basic" type="button" (click)="cancel()">Cancel</button>
        </form>
      </nb-card-body>
    </nb-card>
  `
})
export class CreateJobDialogComponent {
  jobForm: FormGroup;

  @Output() jobCreated = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      designation: ['', Validators.required],
      facility: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  submit() {
    if (this.jobForm.valid) {
      this.jobCreated.emit(this.jobForm.value);
    }
  }

  cancel() {
    this.jobCreated.emit(null);
  }
}
