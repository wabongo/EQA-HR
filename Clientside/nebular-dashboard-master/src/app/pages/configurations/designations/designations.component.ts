import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Designation } from './designation.model';

import { Column } from '../../../shared/smart-table/smart-table.component';
import { DesignationService } from './designation.service';
import { UpdateDesignationDialogComponent } from './update-designation-dialog/update-designation-dialog.component';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnInit {
  designations: Designation[] = [];
  columns: Column[] = [
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    { key: 'departmentName', title: 'Department' },
  ];

  constructor(
    private designationService: DesignationService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.designationService.getDesignations().subscribe({
      next: (response: Designation[]) => {
        this.designations = response;
      },
      error: (error) => {
        console.error('Error loading designations', error);
      }
    });
  }

  navigateToCreateDesignation(): void {
    this.router.navigate(['/pages/configurations/designations/create-designation/create']);
  }

  openUpdateModal(event: { data: Designation }): void {
    const designation = event.data;
    this.dialogService.open(UpdateDesignationDialogComponent, {
      context: {
        designation: {...designation}
      },
    }).onClose.subscribe((updatedDesignation: Designation) => {
      if (updatedDesignation) {
        this.designationService.updateDesignation(updatedDesignation.id, updatedDesignation).subscribe({
          next: (result) => {
            const index = this.designations.findIndex(d => d.id === result.data.id);
            if (index !== -1) {
              this.designations[index] = result.data;
            }
          },
          error: (error) => {
            console.error('Error updating designation', error);
          }
        });
      }
    });
  }

  deleteDesignation(event: { data: Designation }): void {
    const designation = event.data;
    if (designation.id) {
      this.designationService.deleteDesignation(designation.id).subscribe({
        next: () => {
          this.designations = this.designations.filter(d => d.id !== designation.id);
        },
        error: (error) => {
          console.error('Error deleting designation', error);
        }
      });
    }
  }
}