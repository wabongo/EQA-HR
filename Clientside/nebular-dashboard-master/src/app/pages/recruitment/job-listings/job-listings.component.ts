import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { JobListingsService } from './job-listings.service';
import { JoblistingsRequest } from './job-listings.model';
import { CreateJobDialogComponent } from './create-job-dialog.component';
import { UpdateJobDialogComponent } from './update-job-dialog.component';
import { ViewJobDialogComponent } from './view-job-dialog.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';
import { JobDetailsComponent } from './job-details.component';

interface JobFilters {
  department?: string;
  jobType?: string;
  designation?: string;
}

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.scss']
})

export class JobListingsComponent implements OnInit {
  jobPosts: JoblistingsRequest[] = [];
  filteredJobPosts: JoblistingsRequest[] = [];
  appliedJobs: JoblistingsRequest[] = [];
  offeredJobs: JoblistingsRequest[] = [];
  currentPage = 1;
  pageSize = 6;
  rangeSize = 5;
  totalJobs = 0;
  totalPages = 0;

  departments: string[] = [];
  jobTypes: string[] = [];
  designations: string[] = [];
  selectedDepartment: string = '';
  selectedJobType: string = '';
  selectedDesignation: string = '';

  constructor(
    private jobListingsService: JobListingsService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.loadJobPosts();
    this.loadFilterOptions();
  }

  loadJobPosts(): void {
    this.jobListingsService.getAllJobPosts().subscribe({
      next: (data) => {
        this.jobPosts = data;
        this.totalJobs = this.jobPosts.length;
        this.totalPages = Math.ceil(this.totalJobs / this.pageSize);
        this.applyFiltersAndPagination();
      },
      error: (error) => {
        console.error('Error fetching job posts:', error);
      }
    });
  }

  loadFilterOptions(): void {
    this.jobListingsService.getDepartments().subscribe(depts => this.departments = depts);
    this.jobListingsService.getJobTypes().subscribe(types => this.jobTypes = types);
    this.jobListingsService.getDesignations().subscribe(desigs => this.designations = desigs);
  }

  onTabChange(event: any): void {
    const tabId = event.tabId;
    if (tabId === 'applied') {
      this.loadAppliedJobs();
    } else if (tabId === 'offered') {
      this.loadOfferedJobs();
    } else {
      // 'all' tab or default case
      this.loadAllJobs();
    }
  }
  
  showJobDetails(job: JoblistingsRequest): void {
    this.dialogService.open(JobDetailsComponent, {
      context: {
        job: job
      }
    });
  }

  loadAllJobs(): void {
    // Your existing logic to load all jobs
    this.loadJobPosts();
  }

  loadAppliedJobs(): void {
    this.jobListingsService.getJobsByStatus('APPLIED').subscribe({
      next: (data) => {
        this.appliedJobs = data;
      },
      error: (error) => {
        console.error('Error fetching applied jobs:', error);
      }
    });
  }

  loadOfferedJobs(): void {
    this.jobListingsService.getJobsByStatus('OFFERED').subscribe({
      next: (data) => {
        this.offeredJobs = data;
      },
      error: (error) => {
        console.error('Error fetching offered jobs:', error);
      }
    });
  }




  

  searchJobs(): void {
    const filters: JobFilters = {
      department: this.selectedDepartment || undefined,
      jobType: this.selectedJobType || undefined,
      designation: this.selectedDesignation || undefined
    };
    
    this.jobListingsService.searchJobs(filters).subscribe({
      next: (data) => {
        this.jobPosts = data;
        this.totalJobs = this.jobPosts.length;
        this.totalPages = Math.ceil(this.totalJobs / this.pageSize);
        this.currentPage = 1;
        this.applyFiltersAndPagination();
      },
      error: (error) => {
        console.error('Error searching job posts:', error);
      }
    });
  }

  applyFiltersAndPagination(): void {
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredJobPosts = this.jobPosts.slice(startIndex, endIndex);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.applyFiltersAndPagination();
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

  acceptOffer(job: JoblistingsRequest) {
    // Implement the logic to accept the job offer
    console.log('Accepting offer for job:', job);
    // You might want to call a service method here
  }

  declineOffer(job: JoblistingsRequest) {
    // Implement the logic to decline the job offer
    console.log('Declining offer for job:', job);
    // You might want to call a service method here
  }

  viewOfferDetails(job: JoblistingsRequest){
    // Implement the logic to view the application
    console.log('Viewing offer for job:', job);

  }

  viewApplicants(job: JoblistingsRequest){
    // Implement the logic to view the application
    console.log('Viewing application for job:', job);

  }
  scheduleInterview(job: JoblistingsRequest){
    // Implement the logic to view the application
    console.log('Scheduling interview for job:', job);

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
    this.dialogService.open(ConfirmDeleteDialogComponent)
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.jobListingsService.deleteJobPost(id).subscribe(
            () => {
              this.loadJobPosts();
            },
            (error) => {
              console.error('Error deleting job post:', error);
            }
          );
        }
      });
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