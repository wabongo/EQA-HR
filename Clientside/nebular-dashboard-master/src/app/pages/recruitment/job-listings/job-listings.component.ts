import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { JobListingsService } from './job-listings.service';
import { JoblistingsRequest } from './job-listings.model';
import { CreateJobDialogComponent } from './create-job-dialog.component';
import { JobDetailsComponent } from './job-details.component';
import { NgIfContext } from '@angular/common';

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
  requisitionJobs: JoblistingsRequest[] = [];
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
noJobs: TemplateRef<NgIfContext<boolean>>;
noRequisitionJobs: TemplateRef<NgIfContext<boolean>>;
  toastrService: any;

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
    switch (tabId) {
      case 'all':
        this.loadAllJobs();
        break;
      case 'requisition':
        this.loadRequisitionJobs();
        break;
      case 'applied':
        this.loadAppliedJobs();
        break;
      case 'offered':
        this.loadOfferedJobs();
        break;
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
    this.loadJobPosts();
  }

  loadRequisitionJobs(): void {
    this.jobListingsService.getJobsByStatus('REQUISITION').subscribe({
      next: (data) => {
        console.log('Received requisition jobs:', data);
        if (Array.isArray(data)) {
          this.requisitionJobs = data;
          console.log('Requisition jobs set:', this.requisitionJobs);
        } else {
          console.error('Received data is not an array:', data);
          this.requisitionJobs = [];
        }
      },
      error: (error) => {
        console.error('Error fetching Requisitions:', error);
        this.requisitionJobs = [];
      }
    });
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

  createJobPost(jobPost: JoblistingsRequest) {
    this.jobListingsService.createJobPost(jobPost).subscribe(
      (response) => {
        if (response.entity) {
          this.jobPosts.push(response.entity);
        }
        this.loadJobPosts();
      },
      (error) => {
        console.error('Error creating job post:', error);
      }
    );
  }

  approveRequisition(job: JoblistingsRequest): void {
    this.jobListingsService.approveJobRequest(job.id.toString()).subscribe({
      next: (response) => {
        console.log('Job approved successfully:', response);
        // Remove the job from requisitionJobs and add it to jobPosts
        this.requisitionJobs = this.requisitionJobs.filter(j => j.id !== job.id);
        job.status = 'OPEN';
        this.jobPosts.push(job);
        this.loadRequisitionJobs();
        this.loadAllJobs();
        // Optionally, you can show a success message to the user
      },
      error: (error) => {
        console.error('Error approving job:', error);
        // Optionally, you can show an error message to the user
      }
    });
  }
}