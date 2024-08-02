import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { JoblistingsRequest } from './job-listings.model';

@Component({
  selector: 'app-job-details',
  template: `
    <nb-card>
      <nb-card-header>
        <h3>{{ job.designation }} - {{ job.jobType }}</h3>
      </nb-card-header>
      <nb-card-body>
        <p><strong>Location:</strong> {{ job.facility }}</p>
        <p><strong>Description:</strong> {{ job.description }}</p>
        <p><strong>Requirements:</strong> {{ job.requirements }}</p>
        <p><strong>Deadline:</strong> {{ job.deadline | date:'mediumDate' }}</p>
        <!-- Add more details as needed -->
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" (click)="close()">Close</button>
        <button nbButton status="info" (click)="viewApplicants()" *ngIf="job.status === 'APPLIED'">View Applicants</button>
        <button nbButton status="success" (click)="scheduleInterview()" *ngIf="job.status === 'APPLIED'">Schedule Interview</button>
        <button nbButton status="info" (click)="viewOfferDetails()" *ngIf="job.status === 'OFFERED'">View Offer Details</button>
      </nb-card-footer>
    </nb-card>
  `
})
export class JobDetailsComponent {
  @Input() job!: JoblistingsRequest;

  constructor(private dialogRef: NbDialogRef<JobDetailsComponent>) {}

  close() {
    this.dialogRef.close();
  }

  viewApplicants() {
    // Implement view applicants logic
    console.log('Viewing applicants for', this.job);
  }

  scheduleInterview() {
    // Implement schedule interview logic
    console.log('Scheduling interview for', this.job);
  }

  viewOfferDetails() {
    // Implement view offer details logic
    console.log('Viewing offer details for', this.job);
  }
}