import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../candidate.service';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.scss']
})
export class CreateCandidateComponent implements OnInit {
  candidateForm: FormGroup;
  cv: File | null = null;
  coverLetter: File | null = null;
  license: File | null = null;
  certificate: File | null = null;

  cvError: string | null = null;
  coverLetterError: string | null = null;
  licenseError: string | null = null;
  certificateError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      facility: ['', Validators.required],
      idNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

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
    formData.append('name', this.candidateForm.get('name')?.value);
    formData.append('designation', this.candidateForm.get('designation')?.value);
    formData.append('facility', this.candidateForm.get('facility')?.value);
    formData.append('idNumber', this.candidateForm.get('idNumber')?.value);
    formData.append('email', this.candidateForm.get('email')?.value);
    formData.append('phoneNumber', this.candidateForm.get('phoneNumber')?.value);
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
