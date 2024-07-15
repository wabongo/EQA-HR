import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { FacilitiesComponent } from './facilities/facilities.component';
import { CompaniesComponent } from './companies/companies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbAlertModule, NbIconModule, NbButtonModule, NbDialogModule, NbInputModule } from '@nebular/theme';
import { CreateCompanyDialogComponent } from './companies/create-company-dialog.component';
import { UpdateCompanyDialogComponent } from './companies/update-company-dialog.component';


@NgModule({
  declarations: [
    FacilitiesComponent,
    CompaniesComponent,
    CreateCompanyDialogComponent, // Declare the create dialog component
    UpdateCompanyDialogComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    NbCardModule,
    NbAlertModule,
    NbIconModule,
    NbButtonModule,
    NbDialogModule.forChild(),
    NbInputModule,
    ReactiveFormsModule
  ]
})
export class BusinessModule { }
