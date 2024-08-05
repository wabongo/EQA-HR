import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { CandidateService } from '../candidate.service';
import { JobListingsService } from '../../job-listings/job-listings.service';
import { JoblistingsRequest } from '../../job-listings/job-listings.model';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.scss']
})
export class CreateCandidateComponent implements OnInit {
  @ViewChild('jobLookupDialog', { static: true }) jobLookupDialog: TemplateRef<any>;

  candidateForm: FormGroup;
  jobLookupForm: FormGroup;
  cv: File | null = null;
  coverLetter: File | null = null;
  license: File | null = null;
  certificate: File | null = null;

  cvError: string | null = null;
  coverLetterError: string | null = null;
  licenseError: string | null = null;
  certificateError: string | null = null;

  departments: string[] = [];
  jobTypes: string[] = [];
  designations: string[] = [];
  searchResults: JoblistingsRequest[] = [];
  dialogRef: NbDialogRef<any>;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private jobListingsService: JobListingsService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  initForms(): void {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      jobPostId: ['', Validators.required],
      facility: ['', Validators.required],
      idNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });

    this.jobLookupForm = this.fb.group({
      department: [''],
      jobType: [''],
      designation: [''],
    });
  }

  loadFilterOptions(): void {
    this.jobListingsService.getDepartments().subscribe(depts => this.departments = depts);
    this.jobListingsService.getJobTypes().subscribe(types => this.jobTypes = types);
    this.jobListingsService.getDesignations().subscribe(desigs => this.designations = desigs);
  }

  openJobLookupDialog(): void {
    this.dialogRef = this.dialogService.open(this.jobLookupDialog, {
      context: {
        title: 'Job Lookup',
      },
    });
  }

  searchJobs(): void {
    if (this.isSearchValid()) {
      const filters = this.jobLookupForm.value;
      console.log('Searching with filters:', filters);
      this.jobListingsService.searchJobs(filters).subscribe(
        jobs => {
          console.log('Received search results:', jobs);
          this.searchResults = jobs;
          if (jobs.length === 0) {
            console.log('No results found');
          }
        },
        error => {
          console.error('Error searching jobs:', error);
          // Optionally, display an error message to the user
        }
      );
    } else {
      console.log('Search is not valid. Please select at least two parameters.');
    }
  }

  isSearchValid(): boolean {
    const form = this.jobLookupForm;
    const filledFields = ['department', 'jobType', 'designation'].filter(field => form.get(field).value).length;
    console.log('Filled fields:', filledFields);
    return filledFields >= 2;
  }



  selectJob(job: JoblistingsRequest): void {
    this.candidateForm.patchValue({
      designation: job.designation,
      jobPostId: job.id,
      facility: job.facility,
    });
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onFileChange(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    switch (fileType) {
      case 'cv':
        this.cv = file;
        this.cvError = this.validateFile(file);
        break;
      case 'coverLetter':
        this.coverLetter = file;
        this.coverLetterError = this.validateFile(file);
        break;
      case 'license':
        this.license = file;
        this.licenseError = this.validateFile(file);
        break;
      case 'certificate':
        this.certificate = file;
        this.certificateError = this.validateFile(file);
        break;
    }
  }

  validateFile(file: File): string | null {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      return 'File size exceeds 5MB.';
    }
    return null;
  }

  onSubmit(): void {
    if (this.candidateForm.invalid || this.cvError || this.coverLetterError || this.licenseError || this.certificateError) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.candidateForm.value).forEach(key => {
      formData.append(key, this.candidateForm.get(key).value);
    });

    if (this.cv) formData.append('cv', this.cv);
    if (this.coverLetter) formData.append('coverLetter', this.coverLetter);
    if (this.license) formData.append('license', this.license);
    if (this.certificate) formData.append('certificate', this.certificate);

    this.candidateService.createCandidate(formData).subscribe({
      next: () => this.router.navigate(['/pages/recruitment/candidates/']),
      error: (err) => console.error('Error creating candidate', err),
    });
  }
}