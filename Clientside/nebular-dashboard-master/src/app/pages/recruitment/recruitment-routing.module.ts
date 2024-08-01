import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobListingsComponent } from './job-listings/job-listings.component';

import { MyActionsComponent } from './my-actions/my-actions.component';
import { CandidatesComponent } from './candidate/candidates.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'job-listings', component: JobListingsComponent },
      { path: 'candidates', component: CandidatesComponent },
      { path: 'my-actions', component: MyActionsComponent },
      { path: '', redirectTo: 'job-listings', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruitmentRoutingModule {}
