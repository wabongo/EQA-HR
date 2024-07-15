import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { JobListingsComponent } from './job-listings/job-listings.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { MyActionsComponent } from './my-actions/my-actions.component';
import { CreateJobDialogComponent } from './job-listings/create-job-dialog.component'; // Import the create dialog component
import { UpdateJobDialogComponent } from './job-listings/update-job-dialog.component'; // Import the update dialog component

import { NbAlertModule, NbCardModule, NbIconModule, NbMenuModule, NbButtonModule, NbDialogModule, NbInputModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewJobDialogComponent } from './job-listings/view-job-dialog.component';
import { ConfirmDeleteDialogComponent } from './job-listings/confirm-delete-dialog.component';

@NgModule({
  declarations: [
    JobListingsComponent,
    ApplicantsComponent,
    MyActionsComponent,
    CreateJobDialogComponent, // Declare the create dialog component
    UpdateJobDialogComponent, // Declare the update dialog component
    ViewJobDialogComponent, // Declare the view dialog component
    ViewJobDialogComponent, // Declare the view dialog component
    ConfirmDeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    RecruitmentRoutingModule,
    NbCardModule,
    NbAlertModule,
    NbIconModule,
    NbButtonModule,
    NbDialogModule.forChild(),
    NbInputModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this schema
})
export class RecruitmentModule { }
