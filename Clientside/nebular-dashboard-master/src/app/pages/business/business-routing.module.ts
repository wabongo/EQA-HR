import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { CreateCompanyComponent } from './companies/maintenance/create-company.component';
import { CreateFacilityComponent } from './facilities/maintenance/create-facility.component';
import { UpdateFacilityComponent } from './facilities/maintenance/update-facility.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'companies', component: CompaniesComponent },
      { path: 'companies/maintenance/create', component: CreateCompanyComponent },
      { path: 'facilities', component: FacilitiesComponent},
      { path: 'facilities/maintenance/create', component: CreateFacilityComponent },
      { path: 'facilities/maintenance/update/:id', component: UpdateFacilityComponent },
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
