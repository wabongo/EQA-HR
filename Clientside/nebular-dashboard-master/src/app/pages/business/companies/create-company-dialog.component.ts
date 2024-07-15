import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-create-company-dialog',
  template: `
    <nb-card>
      <nb-card-header>Create Company</nb-card-header>
      <nb-card-body>
        <form [formGroup]="companyForm" (ngSubmit)="submit()">
          <div class="form-group">
            <label for="region">Region</label>
            <input nbInput fullWidth id="region" formControlName="region" aria-describedby="regionError">
            <div *ngIf="companyForm.get('region').invalid && companyForm.get('region').touched" id="regionError" class="error-message">
              Region is required.
            </div>
          </div>
          <!-- Repeat for other fields: province, county, name, franchisee, phoneNumber, email, kraPin -->
          <div class="form-group">
            <label for="province">Province</label>
            <input nbInput fullWidth id="province" formControlName="province">
          </div>
          <div class="form-group">
            <label for="county">County</label>
            <input nbInput fullWidth id="county" formControlName="county">
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input nbInput fullWidth id="name" formControlName="name">
          </div>
          <div class="form-group">
            <label for="franchisee">Franchisee</label>
            <input nbInput fullWidth id="franchisee" formControlName="franchisee">
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input nbInput fullWidth id="phoneNumber" formControlName="phoneNumber">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input nbInput fullWidth id="email" formControlName="email">
          </div>
          <div class="form-group">
            <label for="kraPin">KRA Pin</label>
            <input nbInput fullWidth id="kraPin" formControlName="kraPin">
          </div>
          <div class="button-group">
            <button nbButton status="primary" type="submit" [disabled]="!companyForm.valid">Create</button>
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
export class CreateCompanyDialogComponent {
  companyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<CreateCompanyDialogComponent>
  ) {
    this.companyForm = this.formBuilder.group({
      region: ['', Validators.required],
      province: [''],
      county: [''],
      name: [''],
      franchisee: [''],
      phoneNumber: [''],
      email: [''],
      kraPin: ['']
    });
  }

  submit() {
    if (this.companyForm.valid) {
      this.dialogRef.close(this.companyForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}