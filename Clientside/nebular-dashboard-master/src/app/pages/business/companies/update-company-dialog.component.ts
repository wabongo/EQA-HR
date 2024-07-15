import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { CompanyRequest } from './company.model';


@Component({
  selector: 'app-update-company-dialog',
  template: `
    <nb-card>
      <nb-card-header>Update Company</nb-card-header>
      <nb-card-body>
        <form [formGroup]="companyForm" (ngSubmit)="submit()">
          <!-- Form fields as in CreateCompanyDialogComponent -->
          <div class="button-group">
            <button nbButton status="primary" type="submit" [disabled]="!companyForm.valid">Update</button>
            <button nbButton status="basic" type="button" (click)="cancel()">Cancel</button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `,
  styles: [`
    /* Styles as in CreateCompanyDialogComponent */
  `]
})
export class UpdateCompanyDialogComponent {
  @Input() company: CompanyRequest;
  companyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<UpdateCompanyDialogComponent>
  ) {
    this.companyForm = this.formBuilder.group({
      region: ['', Validators.required],
      province: [''],
      county: [''],
      name: [''],
      franchisee: [''],
      phoneNumber: [''],
      email: [''],
      kraPin: ['']
    });
  }

  ngOnInit() {
    if (this.company) {
      this.companyForm.patchValue(this.company);
    }
  }

  submit() {
    if (this.companyForm.valid) {
      this.dialogRef.close(this.companyForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}