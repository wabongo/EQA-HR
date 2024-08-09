import { NgModule } from '@angular/core';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateDesignationComponent } from './designations/create-designation/create-designation.component';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'departments', component: DepartmentsComponent },
      { path: 'designations', component: DesignationsComponent },
      { path: 'departments/create-department/create', component: CreateDepartmentComponent},
      { path: 'designations/create-designation/create', component: CreateDesignationComponent},
      { path: '', redirectTo: 'departments', pathMatch: 'full' },
    ],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { 
  
}
