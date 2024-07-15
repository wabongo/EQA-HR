import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { JobListingsService } from './job-listings.service';
import { JoblistingsRequest } from './job-listings.model';
import { CreateJobDialogComponent } from './create-job-dialog.component';
import { UpdateJobDialogComponent } from './update-job-dialog.component';
import { ViewJobDialogComponent } from './view-job-dialog.component';

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
    this.jobListingsService.getAllJobPosts().subscribe({
      next: (data) => {
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

  openUpdateModal(job: JoblistingsRequest): void {
    const dialogRef = this.dialogService.open(UpdateJobDialogComponent, {
      context: { job }
    });

    dialogRef.onClose.subscribe((updatedJob: JoblistingsRequest | null) => {
      if (updatedJob && updatedJob.id) {
        this.updateJobPost(updatedJob.id, updatedJob);
      }
    });
  }

  createJobPost(jobPost: JoblistingsRequest) {
    this.jobListingsService.createJobPost(jobPost).subscribe(
      (response) => {
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

  updateJobPost(id: string, jobPost: JoblistingsRequest) {
    this.jobListingsService.updateJobPost(id, jobPost).subscribe(
      () => {
        this.loadJobPosts();
      },
      (error) => {
        console.error('Error updating job post', error);
      }
    );
  }

  deleteJob(id: string) {
    this.jobListingsService.deleteJobPost(id).subscribe(
      () => {
        this.loadJobPosts();
      },
      (error) => {
        console.error('Error deleting job post:', error);
      }
    );
  }

  viewJob(job: JoblistingsRequest) {
    if (job && job.id) {
      this.jobListingsService.getJobPostById(job.id).subscribe(
        (jobDetails) => {
          if (jobDetails) {
            this.dialogService.open(ViewJobDialogComponent, {
              context: { job: jobDetails }
            });
          } else {
            console.error(`No job details found for ID ${job.id}`);
            // Handle error or notify user
          }
        },
        (error) => {
          console.error('Error fetching job details:', error);
          // Handle error or notify user
        }
      );
    } else {
      console.error('Invalid job ID or job object');
      // Handle error or notify user
    }
  }
}  