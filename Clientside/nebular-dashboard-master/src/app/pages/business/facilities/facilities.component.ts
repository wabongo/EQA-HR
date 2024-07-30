import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FacilityRequest } from './facility.model';
import { FacilitiesService } from './facilities.service';
import { Router } from '@angular/router';
import { Column } from '../../../shared/smart-table/smart-table.component';
 // Update the path

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
  facilityRequests: FacilityRequest[] = [];
  columns: Column[] = [
    { key: 'clinicName', title: 'Clinic Name' },
    { key: 'dateOpened', title: 'Date Opened' },
    // { key: 'province', title: 'Province' },
    { key: 'county', title: 'County' },
    // { key: 'subcounty', title: 'Subcounty' },
    { key: 'type', title: 'Type' },
    // { key: 'physicalAddress', title: 'Physical Address' },
    { key: 'doctorInCharge', title: 'Doctor in Charge' },
    { key: 'clinicContact', title: 'Clinic Contact' },
    // { key: 'companyName', title: 'LLC Name' },
    // { key: 'franchiseeContact', title: 'Franchisee Contact' },
    { key: 'recruitmentEmail', title: 'Recruitment Email' }
  ];

  constructor(
    private facilityService: FacilitiesService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.facilityService.getFacilities().subscribe({
      next: (facilities) => {
        this.facilityRequests = facilities;
      },
      error: (error) => {
        console.error('Error loading facilities', error);
      }
    });
  }

  navigateToCreateFacility(): void {
    this.router.navigate(['/pages/business/facilities/maintenance/create']);
  }

  navigateToUpdateFacility(facility: FacilityRequest): void {
    if (facility && facility.id) {
      this.router.navigate(['/pages/business/facilities/maintenance/update', facility.id]);
    } else {
      console.error('Invalid facility or facility ID');
    }
  }

  deleteFacility(facility: FacilityRequest): void {
    if (facility && facility.id) {
      this.facilityService.deleteFacility(facility.id).subscribe({
        next: () => {
          this.facilityRequests = this.facilityRequests.filter(f => f.id !== facility.id);
        },
        error: (error) => {
          console.error('Error deleting facility', error);
        }
      });
    } else {
      console.error('Invalid facility or facility ID');
    }
  }
}