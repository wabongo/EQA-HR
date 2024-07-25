import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { FacilitiesComponent } from './facilities/facilities.component';
import { CompaniesComponent } from './companies/companies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbAlertModule, NbIconModule, NbButtonModule, NbDialogModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { CreateCompanyComponent } from './companies/maintenance/create-company.component';
import { UpdateCompanyDialogComponent } from './companies/update-company-dialog.component';
import { CreateFacilityComponent } from './facilities/maintenance/create-facility.component';
import { UpdateFacilityComponent } from './facilities/maintenance/update-facility.component';


@NgModule({
  declarations: [
    FacilitiesComponent,
    CompaniesComponent,
    CreateCompanyComponent,
    UpdateCompanyDialogComponent,
    CreateFacilityComponent,
    UpdateFacilityComponent
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
