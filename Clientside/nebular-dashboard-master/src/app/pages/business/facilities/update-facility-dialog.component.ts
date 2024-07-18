import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Province } from '../../../shared/provinces';
import { centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince } from '../../../shared/provinces';
import { FacilityRequest } from './facility.model';

@Component({
  selector: 'app-update-facility-dialog',
  template: `
    <nb-card>
      <nb-card-header>Create Facility</nb-card-header>
      <nb-card-body>
        <form [formGroup]="facilityForm" (ngSubmit)="submit()">
          <div class="form-row">
            <div class="form-column">
              <div class="form-control-group">
                <label class="label" for="clinicName">Clinic Name</label>
                <input nbInput fullWidth id="clinicName" formControlName="clinicName">
              </div>

              <div class="form-control-group">
                <label class="label" for="dateOpened">Date Opened</label>
                <input nbInput fullWidth id="dateOpened" formControlName="dateOpened" type="date">
              </div>

              <div class="form-control-group">
                <label class="label" for="province">Province</label>
                <nb-select fullWidth placeholder="Select Province" formControlName="province" (selectedChange)="onProvinceChange($event)">
                  <nb-option *ngFor="let province of provinces" [value]="province.name">{{ province.name }}</nb-option>
                </nb-select>
              </div>

              <div class="form-control-group">
                <label class="label" for="county">County</label>
                <nb-select fullWidth placeholder="Select County" formControlName="county" (selectedChange)="onCountyChange($event)">
                  <nb-option *ngFor="let county of counties" [value]="county.name">{{ county.name }}</nb-option>
                </nb-select>
              </div>

              <div class="form-control-group">
                <label class="label" for="subcounty">Subcounty</label>
                <nb-select fullWidth placeholder="Select Subcounty" formControlName="subcounty">
                  <nb-option *ngFor="let subcounty of subcounties" [value]="subcounty">{{ subcounty }}</nb-option>
                </nb-select>
              </div>

              <div class="form-control-group">
                <label class="label" for="type">Facility Type</label>
                <nb-select fullWidth placeholder="Select Facility Type" formControlName="type">
                  <nb-option value="HUB">Hub</nb-option>
                  <nb-option value="SATELLITE">Satellite</nb-option>
                  <nb-option value="SPOKE">Spoke</nb-option>
                </nb-select>
              </div>
            </div>
            <div class="form-column">
              <div class="form-control-group">
                <label class="label" for="physicalAddress">Physical Address</label>
                <input nbInput fullWidth id="physicalAddress" formControlName="physicalAddress">
              </div>

              <div class="form-control-group">
                <label class="label" for="doctorInCharge">Doctor in Charge</label>
                <input nbInput fullWidth id="doctorInCharge" formControlName="doctorInCharge">
              </div>

              <div class="form-control-group">
                <label class="label" for="clinicContact">Clinic Contact</label>
                <input nbInput fullWidth id="clinicContact" formControlName="clinicContact">
              </div>

              <div class="form-control-group">
                <label class="label" for="llcName">LLC Name</label>
                <input nbInput fullWidth id="llcName" formControlName="llcName">
              </div>

              <div class="form-control-group">
                <label class="label" for="franchiseeContact">Franchisee Contact</label>
                <input nbInput fullWidth id="franchiseeContact" formControlName="franchiseeContact">
              </div>

              <div class="form-control-group">
                <label class="label" for="recruitmentEmail">Recruitment Email</label>
                <input nbInput fullWidth id="recruitmentEmail" formControlName="recruitmentEmail">
              </div>
            </div>
          </div>

          <div class="button-group">
            <button nbButton status="primary" type="submit" [disabled]="!facilityForm.valid">Create</button>
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
    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .form-column {
      flex: 1;
      min-width: 300px;
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    nb-card {
      width: 100%;
      max-width: 800px;
    }
  `]
})
export class UpdateFacilityDialogComponent implements OnInit {
  facilityForm: FormGroup;
  provinces: Province[];
  counties: { name: string, subcounties: string[] }[] = [];
  subcounties: string[] = [];
  facility: FacilityRequest;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<UpdateFacilityDialogComponent>
  ) {
    this.provinces = [centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince];
  }

  ngOnInit() {
    this.initForm();
    this.populateForm();
  }

  initForm() {
    this.facilityForm = this.formBuilder.group({
      clinicName: ['', Validators.required],
      dateOpened: ['', Validators.required],
      province: ['', Validators.required],
      county: ['', Validators.required],
      subcounty: ['', Validators.required],
      type: ['', Validators.required],
      physicalAddress: ['', Validators.required],
      doctorInCharge: ['', Validators.required],
      clinicContact: ['', [Validators.required, Validators.pattern('^\\+?\\d{10,14}$')]],
      llcName: ['', Validators.required],
      franchiseeContact: ['', [Validators.required, Validators.pattern('^\\+?\\d{10,14}$')]],
      recruitmentEmail: ['', [Validators.required, Validators.email]]
    });
  }

  populateForm() {
    if (this.facility) {
      this.facilityForm.patchValue(this.facility);
      this.onProvinceChange(this.facility.province);
      this.onCountyChange(this.facility.county);
    }
  }

  onProvinceChange(selectedProvince: string) {
    const selectedProvinceObj = this.provinces.find(province => province.name === selectedProvince);
    this.counties = selectedProvinceObj ? selectedProvinceObj.counties : [];
    this.facilityForm.patchValue({ county: '', subcounty: '' });
    this.subcounties = [];
  }

  onCountyChange(selectedCounty: string) {
    const selectedCountyObj = this.counties.find(county => county.name === selectedCounty);
    this.subcounties = selectedCountyObj ? selectedCountyObj.subcounties : [];
    this.facilityForm.patchValue({ subcounty: '' });
  }

  submit() {
    if (this.facilityForm.valid) {
      const updatedFacility = { ...this.facility, ...this.facilityForm.value };
      this.dialogRef.close(updatedFacility);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
