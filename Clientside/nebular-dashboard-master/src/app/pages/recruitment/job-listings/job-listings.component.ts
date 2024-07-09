import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { JobListingsService } from './job-listings.service';
import { JoblistingsRequest } from './job-listings.model';
import { CreateJobDialogComponent } from './create-job-dialog.component';
import { UpdateJobDialogComponent } from './update-job-dialog.component';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.scss']
})
export class JobListingsComponent implements OnInit {
  jobPosts: JoblistingsRequest[] = [];

  constructor(
    private jobListingsService: JobListingsService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.loadJobPosts();
  }

  loadJobPosts(): void {
    console.log('Loading job posts...');
    this.jobListingsService.getAllJobPosts().subscribe({
      next: (data) => {
        console.log('Received job posts:', data);
        this.jobPosts = data;
      },
      error: (error) => {
        console.error('Error fetching job posts:', error);
      }
    });
  }

  openCreateModal() {
    this.dialogService.open(CreateJobDialogComponent)
      .onClose.subscribe((result: JoblistingsRequest | null) => {
        if (result) {
          this.createJobPost(result);
        }
      });
  }

  openUpdateModal(job: JoblistingsRequest) {
    this.dialogService.open(UpdateJobDialogComponent, {
      context: { job }
    }).onClose.subscribe((result: JoblistingsRequest | null) => {
      if (result && job.id !== undefined) {
        this.updateJobPost(job.id, result);
      }
    });
  }

  createJobPost(jobPost: JoblistingsRequest) {
    console.log('Attempting to create job post:', jobPost);
    this.jobListingsService.createJobPost(jobPost).subscribe(
      (response) => {
        console.log('Job post created successfully:', response);
        // Add the new job post to the local array
        if (response.entity) {
          this.jobPosts.push(response.entity);
        }
        // Alternatively, you can refresh the entire list
        this.loadJobPosts();
      },
      (error) => {
        console.error('Error creating job post:', error);
      }
    );
  }





  updateJobPost(id: number, jobPost: JoblistingsRequest) {
    this.jobListingsService.updateJobPost(id, jobPost).subscribe(
      () => {
        this.loadJobPosts();
      },
      (error) => {
        console.error('Error updating job post', error);
      }
    );
  }

  deleteJob(id: number) {
    this.jobListingsService.deleteJobPost(id).subscribe(
      () => {
        this.loadJobPosts();
      },
      (error) => {
        console.error('Error deleting job post', error);
      }
    );
  }

  viewJob(job: JoblistingsRequest) {
    // Implement view logic if necessary
    console.log('Viewing job:', job);
  }
}
