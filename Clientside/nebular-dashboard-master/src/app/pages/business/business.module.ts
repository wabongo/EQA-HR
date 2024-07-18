import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { FacilitiesComponent } from './facilities/facilities.component';
import { CompaniesComponent } from './companies/companies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbAlertModule, NbIconModule, NbButtonModule, NbDialogModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { CreateCompanyDialogComponent } from './companies/create-company-dialog.component';
import { UpdateCompanyDialogComponent } from './companies/update-company-dialog.component';
import { CreateFacilityDialogComponent } from './facilities/create-facility-dialog.component';
import { UpdateFacilityDialogComponent } from './facilities/update-facility-dialog.component';


@NgModule({
  declarations: [
    FacilitiesComponent,
    CompaniesComponent,
    CreateCompanyDialogComponent, // Declare the create dialog component
    UpdateCompanyDialogComponent,
    CreateFacilityDialogComponent,
    UpdateFacilityDialogComponent
  
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
    ReactiveFormsModule,
    NbSelectModule

  ]
})
export class BusinessModule { }
