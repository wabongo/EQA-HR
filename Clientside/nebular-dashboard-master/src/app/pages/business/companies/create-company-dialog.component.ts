import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Province } from '../../../shared/provinces';

import { centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince } from '../../../shared/provinces';


@Component({
  selector: 'app-create-company-dialog',
  template: `
    <nb-card>
      <nb-card-header>Create Company</nb-card-header>
      <nb-card-body>
        <form [formGroup]="companyForm" (ngSubmit)="submit()">

        <div class="form-control-group">
            <label class="label" for="region">Region</label>
            <input nbInput fullWidth id="region" formControlName="region">
          </div>


          <div class="form-control-group">
            <label class="label" for="province">Province</label>
            <nb-select fullWidth placeholder="Select Province" formControlName="province" (selectedChange)="onRegionChange($event)">
              <nb-option *ngFor="let province of provinces" [value]="province.name">{{ province.name }}</nb-option>
            </nb-select>
            <ng-container *ngIf="companyForm.get('province').invalid && companyForm.get('province').touched">
              <p class="caption status-danger">Province is required.</p>
            </ng-container>
          </div>


        <div class="form-control-group">
            <label class="label" for="county">County</label>
            <nb-select fullWidth placeholder="Select County" formControlName="county">
              <nb-option *ngFor="let county of counties" [value]="county.name">{{ county.name }}</nb-option>
            </nb-select>
          </div>


          <div class="form-control-group">
            <label class="label" for="name">LLC Name</label>
            <input nbInput fullWidth id="name" formControlName="name">
          </div>
          <div class="form-control-group">
            <label class="label" for="franchisee">Franchisee</label>
            <input nbInput fullWidth id="franchisee" formControlName="franchisee">
          </div>
          <div class="form-control-group">
            <label class="label" for="phoneNumber">Phone Number</label>
            <input nbInput fullWidth id="phoneNumber" formControlName="phoneNumber">
          </div>
          <div class="form-control-group">
            <label class="label" for="email">Email</label>
            <input nbInput fullWidth id="email" formControlName="email">
          </div>
          <div class="form-control-group">
            <label class="label" for="kraPin">KRA Pin</label>
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
    .form-control-group {
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
  provinces: Province[];
  counties: { name: string, subcounties: string[] }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<CreateCompanyDialogComponent>
  ) 
  {
    this.provinces = [
      centralProvince,
      coastProvince,
      nairobiProvince,
      northEasternProvince,
      nyanzaProvince,
      riftValleyProvince,
      westernProvince
    ];

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

  onRegionChange(selectedRegion: string) {
    const selectedProvince = this.provinces.find(province => province.name === selectedRegion);
    this.counties = selectedProvince ? selectedProvince.counties : [];
    this.companyForm.patchValue({ county: '' });
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