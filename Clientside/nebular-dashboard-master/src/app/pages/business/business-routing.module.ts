import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { FacilitiesComponent } from './facilities/facilities.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'companies', component: CompaniesComponent },
      { path: 'facilities', component: FacilitiesComponent},
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
