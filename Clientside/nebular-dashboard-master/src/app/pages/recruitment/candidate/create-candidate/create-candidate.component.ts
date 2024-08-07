import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { CandidateService } from '../candidate.service';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.scss']
})
export class CreateCandidateComponent implements OnInit {
  candidateForm: FormGroup;
  cv: File | null = null;
  cvError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {
    this.initForms();
  }

  ngOnInit(): void {}

  initForms(): void {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      idNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
  }

  onFileChange(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (fileType === 'cv') {
      this.cv = file;
      this.cvError = this.validateFile(file);
    }
  }

  validateFile(file: File): string | null {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      return 'File size exceeds 5MB.';
    }
    return null;
  }

  onSubmit(): void {
    if (this.candidateForm.invalid || this.cvError) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.candidateForm.value).forEach(key => {
      formData.append(key, this.candidateForm.get(key).value);
    });

    if (this.cv) formData.append('cv', this.cv);

    this.candidateService.createCandidate(formData).subscribe({
      next: () => this.router.navigate(['/pages/recruitment/candidates/']),
      error: (err) => console.error('Error creating candidate', err),
    });
  }
}