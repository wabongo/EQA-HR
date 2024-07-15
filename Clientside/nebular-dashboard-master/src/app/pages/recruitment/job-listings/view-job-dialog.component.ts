import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { JoblistingsRequest } from './job-listings.model';

@Component({
  selector: 'app-view-job-dialog',
  template: `
    <nb-card *ngIf="job">
      <nb-card-header>View Job Post</nb-card-header>
      <nb-card-body>
        <div class="job-details">
          <p><strong>Designation:</strong> {{ job.designation }}</p>
          <p><strong>Facility:</strong> {{ job.facility }}</p>
          <p><strong>Description:</strong> {{ job.description }}</p>
          <p><strong>Requirements:</strong> {{ job.requirements }}</p>
          <p><strong>Deadline:</strong> {{ job.deadline }}</p>
        </div>
        <div class="button-group">
          <button nbButton status="basic" type="button" (click)="close()">Close</button>
        </div>
      </nb-card-body>
    </nb-card>
    <div *ngIf="!job">
      <p>Loading job details...</p>
    </div>
  `,
  styles: [`
    .job-details {
      margin-bottom: 1rem;
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    nb-card {
      width: 600px; /* Adjust the width as needed */
      max-width: 100%;
    }
  `]
})
export class ViewJobDialogComponent {
  @Input() job: JoblistingsRequest | null = null;

  constructor(private dialogRef: NbDialogRef<ViewJobDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }
}