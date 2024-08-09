import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { Candidate } from './candidate.model';



@Component({
  selector: 'app-update-candidate-dialog',
  template: `
    <nb-card>
      <nb-card-header>Update Candidate</nb-card-header>
      <nb-card-body>
        <form (ngSubmit)="submit()" #form="ngForm">
          <input [(ngModel)]="candidate.name" name="name" type="text" nbInput fullWidth placeholder="Name">

          <input [(ngModel)]="candidate.idNumber" name="idNumber" type="text" nbInput fullWidth placeholder="ID Number">
          <input [(ngModel)]="candidate.email" name="email" type="email" nbInput fullWidth placeholder="Email">
          <input [(ngModel)]="candidate.phoneNumber" name="phoneNumber" type="tel" nbInput fullWidth placeholder="Phone Number">
          

          <button nbButton status="primary" type="submit">Update</button>
        </form>
      </nb-card-body>
    </nb-card>
  `,
})
export class UpdateCandidateDialogComponent {
  @Input() candidate: Candidate;
  // applicationStatuses = Object.values(ApplicationStatus);

  constructor(protected ref: NbDialogRef<UpdateCandidateDialogComponent>) {}

  submit() {
    this.ref.close(this.candidate);
  }
}