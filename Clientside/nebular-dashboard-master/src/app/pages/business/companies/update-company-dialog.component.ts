import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Province } from '../../../shared/provinces';
import { centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince } from '../../../shared/provinces';
import { CompanyRequest } from './company.model';

@Component({
  selector: 'app-update-company-dialog',
  template: `
    <nb-card>
      <nb-card-header>Update Company</nb-card-header>
      <nb-card-body>
        <form [formGroup]="companyForm" (ngSubmit)="submit()">
          <div class="form-control-group">
            <label class="label" for="region">Region</label>
            <input nbInput fullWidth id="region" formControlName="region">
          </div>

          <div class="form-control-group">
            <label class="label" for="province">Province</label>
            <nb-select fullWidth placeholder="Select Province" formControlName="province" (selectedChange)="onProvinceChange($event)">
              <nb-option *ngFor="let province of provinces" [value]="province.name">{{ province.name }}</nb-option>
            </nb-select>
          </div>

          <div class="form-control-group">
            <label class="label" for="county">County</label>
            <nb-select fullWidth placeholder="Select County" formControlName="county">
              <nb-option *ngFor="let county of counties" [value]="county">{{ county }}</nb-option>
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
            <button nbButton status="primary" type="submit" [disabled]="!companyForm.valid">Update</button>
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

export class UpdateCompanyDialogComponent implements OnInit {
  companyForm: FormGroup;
  provinces: Province[];
  counties: string[] = [];
  company: CompanyRequest;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<UpdateCompanyDialogComponent>
  ) {
    this.provinces = [centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince];
  }

  ngOnInit() {
    this.initForm();
    this.populateForm();
  }

  initForm() {
    this.companyForm = this.formBuilder.group({
      region: ['', Validators.required],
      province: ['', Validators.required],
      county: ['', Validators.required],
      name: ['', Validators.required],
      franchisee: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?\\d{10,14}$')]],
      email: ['', [Validators.required, Validators.email]],
      kraPin: ['', Validators.required]
    });
  }

  populateForm() {
    if (this.company) {
      this.companyForm.patchValue(this.company);
      this.onProvinceChange(this.company.province, true);
    }
  }

  onProvinceChange(selectedProvince: string, initial = false) {
    const selectedProvinceObj = this.provinces.find(province => province.name === selectedProvince);
    this.counties = selectedProvinceObj ? selectedProvinceObj.counties.map(county => county.name) : [];
    if (!initial) {
      this.companyForm.patchValue({ county: '' });
    }
  }

  submit() {
    if (this.companyForm.valid) {
      const updatedCompany = { ...this.company, ...this.companyForm.value };
      this.dialogRef.close(updatedCompany);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}