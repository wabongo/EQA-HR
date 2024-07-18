import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FacilityRequest } from './facility.model';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDialogComponent } from './create-facility-dialog.component';
import { UpdateFacilityDialogComponent } from './update-facility-dialog.component';

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

  openCreateModal(): void {
    this.dialogService.open(CreateFacilityDialogComponent, {
      context: {
        // title: 'Create Facility'
      },
    }).onClose.subscribe((facility: FacilityRequest) => {
      if (facility) {
        this.facilityService.createFacility(facility).subscribe({
          next: (newFacility) => {
            this.facilityRequests.push(newFacility);
          },
          error: (error) => {
            console.error('Error creating facility', error);
          }
        });
      }
    });
  }

  viewFacility(facility: FacilityRequest): void {
    // Implement the logic to view a facility
    console.log('View facility:', facility);
  }

  openUpdateModal(facility: FacilityRequest): void {
    this.dialogService.open(UpdateFacilityDialogComponent, {
      context: {
        // title: 'Update Facility',
        facility: facility
      },
    }).onClose.subscribe((updatedFacility: FacilityRequest) => {
      if (updatedFacility) {
        this.facilityService.updateFacility(updatedFacility.id, updatedFacility).subscribe({
          next: (updatedFacility) => {
            const index = this.facilityRequests.findIndex(f => f.id === updatedFacility.id);
            if (index !== -1) {
              this.facilityRequests[index] = updatedFacility;
            }
          },
          error: (error) => {
            console.error('Error updating facility', error);
          }
        });
      }
    });
  }

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