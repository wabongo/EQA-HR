import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Province, centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince } from "../../../../shared/provinces";
import { CompanyService } from "../../companies/companies.service";
import { CompanyRequest } from "../../companies/company.model";
import { Router } from "@angular/router";
import { FacilityType } from "../facility.model";
import { FacilitiesService } from "../facilities.service";

@Component({
    selector: 'app-create-facility',
    templateUrl: './create-facility.component.html',
    styleUrls: ['./create-facility.component.scss']
})
export class CreateFacilityComponent implements OnInit {
    facilityForm: FormGroup;
    provinces: Province[];
    counties: { name: string, subcounties: string[] }[] = [];
    subcounties: string[] = [];
    FacilityType = FacilityType;
    llcs: CompanyRequest[] = [];
    
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private companyService: CompanyService,
        private facilityService: FacilitiesService,
    ) {
        this.provinces = [centralProvince, coastProvince, nairobiProvince, northEasternProvince, nyanzaProvince, riftValleyProvince, westernProvince];
    }
  
    ngOnInit() {
        this.initForm();
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
            llcName: ['', Validators.required],
            franchiseeContact: ['', [Validators.required, Validators.pattern('^\\+?\\d{10,14}$')]],
            recruitmentEmail: ['', [Validators.required, Validators.email]]
        });
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
  
    loadLlcs() {
        this.companyService.getCompanies().subscribe(
            (companies) => {
                this.llcs = companies;
                console.log('Loaded companies:', this.llcs);
            },
            (error) => {
                console.error('Error loading companies:', error);
            }
        );
    }
  
    submit() {
        if (this.facilityForm.valid) {
            this.facilityService.createFacility(this.facilityForm.value).subscribe(
                response => {
                    console.log('Company created successfully', response);
                    this.router.navigate(['/pages/business/facilities']);
                },
                error => {
                    console.error('Error creating company', error);
                    // Handle error (e.g., show error message to user)
                
                }
            );
        }
    }
    
    cancel() {
        this.router.navigate(['/pages/business/facilities']);
    }
}