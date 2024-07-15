import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <nb-card>
      <nb-card-header>Confirm Deletion</nb-card-header>
      <nb-card-body>Are you sure you want to delete this job post?</nb-card-body>
      <nb-card-footer>
        <button nbButton status="danger" (click)="confirm()">Delete</button>
        <button nbButton status="basic" (click)="dismiss()">Cancel</button>
      </nb-card-footer>
    </nb-card>
  `
})
export class ConfirmDeleteDialogComponent {
  constructor(protected ref: NbDialogRef<ConfirmDeleteDialogComponent>) {}

  confirm() {
    this.ref.close(true);
  }

  dismiss() {
    this.ref.close(false);
  }
}
