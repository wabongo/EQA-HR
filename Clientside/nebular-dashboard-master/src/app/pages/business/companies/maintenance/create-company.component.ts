import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Province } from '../../../../shared/provinces';
import { centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince } from '../../../../shared/provinces';
import { CompanyService } from '../companies.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {
  companyForm: FormGroup;
  provinces: Province[];
  counties: { name: string, subcounties: string[] }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.provinces = [
      centralProvince,
      coastProvince,
      nairobiProvince,
      northEasternProvince,
      nyanzaProvince,
      riftValleyProvince,
      westernProvince
    ];
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.companyForm = this.formBuilder.group({
      region: ['', Validators.required],
      province: ['', Validators.required],
      county: ['', Validators.required],
      name: ['', Validators.required],
      franchisee: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      kraPin: ['', Validators.required]
    });
  }

  onRegionChange(selectedRegion: string) {
    const selectedProvince = this.provinces.find(province => province.name === selectedRegion);
    this.counties = selectedProvince ? selectedProvince.counties : [];
    this.companyForm.patchValue({ county: '' });
  }

  submit() {
    if (this.companyForm.valid) {
      this.companyService.createCompany(this.companyForm.value).subscribe(
        response => {
          console.log('Company created successfully', response);
          this.router.navigate(['/pages/business/companies']);
        },
        error => {
          console.error('Error creating company', error);
          // Handle error (e.g., show error message to user)
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/pages/business/companies']);
  }
}