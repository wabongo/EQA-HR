import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../@theme/components';
import { HomeComponent } from './home/home.component';
import { NgxResetPasswordComponent } from '../@auth/reset-password/reset-password.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: 'home',
      component: HomeComponent,
      data: { breadcrumb: 'Home' }
    },


    {
      path: 'recruitment',
      loadChildren: () => import('./recruitment/recruitment.module').then(m => m.RecruitmentModule),
      data: { breadcrumb: 'job' }
    },


    {
      path: 'business',
      loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
      data: { breadcrumb: 'Business' }
    },
    {
      path: 'user-management',
      loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
      data: { breadcrumb: 'User Management' }
    },
    {
      path: 'reset-password',
      component: NgxResetPasswordComponent,
      data: { breadcrumb: 'Reset Password' }
    },
    {
      path: '**',
      component: NotFoundComponent,
      data: { breadcrumb: 'Not Found' }
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }