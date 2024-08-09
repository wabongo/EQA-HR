import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { SharedModule } from '../../shared/shared.module';
import { UpdateDepartmentDialogComponent } from './departments/update-department-dialog/update-department-dialog.component';
import { UpdateDesignationDialogComponent } from './designations/update-designation-dialog/update-designation-dialog.component';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';
import { CreateDesignationComponent } from './designations/create-designation/create-designation.component';



@NgModule({
  declarations: [
    DepartmentsComponent,
    DesignationsComponent,
    UpdateDepartmentDialogComponent,
    UpdateDesignationDialogComponent,
    CreateDepartmentComponent,
    CreateDesignationComponent
  ],
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    SharedModule
  ]
})
export class ConfigurationsModule { }
