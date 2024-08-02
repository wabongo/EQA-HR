import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserListComponent } from './user-list/user-list.component';

// const routes: Routes = [
//   { path: 'users', component: UserManagementComponent },
//   { path: 'users/create-user', component: UserCreateComponent }
// ];

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'users/create-user', component: UserCreateComponent},
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
