import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './app-auth-guard.service';

const routes: Routes = [
  {
    path: 'pages',
    // canActivate: [AuthGuard],  // Uncomment this to enable the AuthGuard
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./@auth/auth.module')
      .then(m => m.NgxAuthModule),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full'},  // Redirect to login by default
  { path: '**', redirectTo: 'auth/login' },  // Redirect any unknown paths to login
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
