import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';

import { NbAlertModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbListModule, NbDialogModule } from '@nebular/theme';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserListComponent,
    UserCreateComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbListModule,
    NbAlertModule,
    NbIconModule,
    NbDialogModule.forChild()
  ]
})
export class UserManagementModule { }