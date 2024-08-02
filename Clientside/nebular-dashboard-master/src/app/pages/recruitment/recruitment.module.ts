import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { JobListingsComponent } from './job-listings/job-listings.component';
import { MyActionsComponent } from './my-actions/my-actions.component';
import { CreateJobDialogComponent } from './job-listings/create-job-dialog.component'; // Import the create dialog component
import { UpdateJobDialogComponent } from './job-listings/update-job-dialog.component'; // Import the update dialog component

import { NbAlertModule, NbCardModule, NbIconModule, NbMenuModule, NbButtonModule, NbDialogModule, NbInputModule, NbDatepickerModule, NbSelectModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewJobDialogComponent } from './job-listings/view-job-dialog.component';
import { ConfirmDeleteDialogComponent } from './job-listings/confirm-delete-dialog.component';
import { CandidatesComponent } from './candidate/candidates.component';
import { UpdateCandidateDialogComponent } from './candidate/update-candidate-dialog.component';
import { SmartTableComponent } from '../../shared/smart-table/smart-table.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateCandidateComponent } from './candidate/create-candidate/create-candidate.component';

@NgModule({
  declarations: [
    JobListingsComponent,
    CandidatesComponent,
    MyActionsComponent,
    CreateJobDialogComponent, // Declare the create dialog component
    UpdateJobDialogComponent, // Declare the update dialog component
    ViewJobDialogComponent, // Declare the view dialog component
    ViewJobDialogComponent, // Declare the view dialog component
    ConfirmDeleteDialogComponent,
    UpdateCandidateDialogComponent,
    CreateCandidateComponent,
    // SmartTableComponent
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
    NbDatepickerModule,
    NbSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this schema
})
export class RecruitmentModule { }
