import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FacilityRequest } from './facility.model';
import { FacilitiesService } from './facilities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
  facilityRequests: FacilityRequest[] = [];
  allColumns = ['clinicName', 'dateOpened', 'province', 'county', 'subcounty', 'type', 'physicalAddress', 'doctorInCharge', 'clinicContact', 'llcName', 'franchiseeContact', 'recruitmentEmail', 'actions'];

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

  


  viewFacility(facility: FacilityRequest): void {
    // Implement the logic to view a facility
    console.log('View facility:', facility);
  }

  // updateFacility(updatedFacility: FacilityRequest): void {
  //   this.facilityService.updateFacility(updatedFacility.id, updatedFacility).subscribe({
  //     next: (result) => {
  //       const index = this.facilityRequests.findIndex(f => f.id === result.id);
  //       if (index !== -1) {
  //         this.facilityRequests[index] = result;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error updating facility', error);
  //     }
  //   });
  // }

  deleteFacility(id: number): void {
    this.facilityService.deleteFacility(id).subscribe({
      next: () => {
        this.facilityRequests = this.facilityRequests.filter(f => f.id !== id);
      },
      error: (error) => {
        console.error('Error deleting facility', error);
      }
    });
  }
}