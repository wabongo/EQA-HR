import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityType, FacilityRequest } from '../facility.model';
import { CompanyService } from '../../companies/companies.service';
import { FacilitiesService } from '../facilities.service';
import { Province, centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince } from '../../../../shared/provinces';

@Component({
  selector: 'app-update-facility',
  templateUrl: './update-facility.component.html',
  styleUrls: ['./update-facility.component.scss']
})
export class UpdateFacilityComponent implements OnInit {
  facilityForm: FormGroup;
  facility: FacilityRequest;
  provinces: Province[];
  counties: { name: string, subcounties: string[] }[] = [];
  subcounties: string[] = [];
  FacilityType = FacilityType;
  llcs: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private facilityService: FacilitiesService
  ) {
    this.provinces = [centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince];
  }

  ngOnInit() {
    this.initForm();
    this.loadFacilityData();
    this.loadLlcs();
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
      companyName: ['', Validators.required],
      franchiseeContact: ['', [Validators.required, Validators.pattern('^\\+?\\d{10,14}$')]],
      recruitmentEmail: ['', [Validators.required, Validators.email]]
    });
  }

  loadFacilityData() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Facility ID:', id);
    if (id) {
      this.facilityService.getFacilityById(+id).subscribe(
        (response) => {
          console.log('Facility data received:', response);
          if (response && response.entity) {
            this.facility = response.entity;
            this.populateForm(this.facility);
          } else {
            console.error('Invalid facility data received');
          }
        },
        (error) => {
          console.error('Error loading facility', error);
        }
      );
    } else {
      console.error('No facility ID provided');
    }
  }
  
  populateForm(facility: any) {
    console.log('Populating form with:', facility);
    this.facilityForm.patchValue({
      clinicName: facility.clinicName || '',
      dateOpened: this.formatDate(facility.dateOpened),
      province: facility.province || '',
      county: facility.county || '',
      subcounty: facility.subcounty || '',
      type: facility.type || '',
      physicalAddress: facility.physicalAddress || '',
      doctorInCharge: facility.doctorInCharge || '',
      clinicContact: facility.clinicContact || '',
      companyName: facility.companyName || '',
      franchiseeContact: facility.franchiseeContact || '',
      recruitmentEmail: facility.email || ''  // Note the change here
    });
  
    console.log('Form values after population:', this.facilityForm.value);
  
    if (facility.province) this.onProvinceChange(facility.province);
    if (facility.county) this.onCountyChange(facility.county);
  }

  private formatDate(date: string | Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Invalid date
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  }

  onProvinceChange(selectedProvince: string) {
    const selectedProvinceObj = this.provinces.find(province => province.name === selectedProvince);
    this.counties = selectedProvinceObj ? selectedProvinceObj.counties : [];
    if (!this.facility) {
      this.facilityForm.patchValue({ county: '', subcounty: '' });
    }
    this.subcounties = [];
  }

  onCountyChange(selectedCounty: string) {
    const selectedCountyObj = this.counties.find(county => county.name === selectedCounty);
    this.subcounties = selectedCountyObj ? selectedCountyObj.subcounties : [];
    if (!this.facility) {
      this.facilityForm.patchValue({ subcounty: '' });
    }
  }

  loadLlcs() {
    this.companyService.getCompanies().subscribe(
      (companies) => {
        this.llcs = companies;
      },
      (error) => {
        console.error('Error loading companies:', error);
      }
    );
  }

  submit() {
    if (this.facilityForm.valid && this.facility) {
      const updatedFacility = { ...this.facility, ...this.facilityForm.value };
      this.facilityService.updateFacility(updatedFacility.id, updatedFacility).subscribe(
        response => {
          console.log('Facility updated successfully', response);
          this.router.navigate(['/pages/business/facilities']);
        },
        error => {
          console.error('Error updating facility', error);
          // Handle error (e.g., show error message to user)
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/pages/business/facilities']);
  }
}