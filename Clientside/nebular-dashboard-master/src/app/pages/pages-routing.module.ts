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
      component: HomeComponent
    },

    {
      path: 'recruitment',
      loadChildren: () => import('./recruitment/recruitment.module').then(m => m.RecruitmentModule),
    },

    

    {
      path: 'business',
      loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
    },



    {
      path: 'reset-password',
      component: NgxResetPasswordComponent
    },

    {
      path: '**',
      component: NotFoundComponent,
    },

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
