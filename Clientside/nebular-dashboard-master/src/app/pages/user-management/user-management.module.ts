import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbListModule } from '@nebular/theme';


@NgModule({
  declarations: [
    UserManagementComponent,
    UserListComponent,
    UserCreateComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbListModule,
    NbAlertModule,
    NbIconModule
  ]
})
export class UserManagementModule { }
