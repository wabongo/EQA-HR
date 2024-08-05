import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Candidate } from './candidate.model';
import { UpdateCandidateDialogComponent } from './update-candidate-dialog.component';
import { Column } from '../../../shared/smart-table/smart-table.component';
import { CandidateService } from './candidate.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  columns: Column[] = [
    { key: 'name', title: 'Name' },
    { key: 'designation', title: 'Designation' },
    { key: 'facility', title: 'Facility' },
    { key: 'idNumber', title: 'ID Number' },
    { key: 'email', title: 'Email' },
    { key: 'phoneNumber', title: 'Phone Number' },
    { key: 'status', title: 'Status' }
  ];

  constructor(
    private candidateService: CandidateService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
      },
      error: (error) => {
        console.error('Error loading candidates', error);
      }
    });
  }

  navigateToCreateCandidate(): void {
    this.router.navigate(['/pages/recruitment/candidates/create']);
  }

  openUpdateModal(event: { data: Candidate }): void {
    const candidate = event.data;
    this.dialogService.open(UpdateCandidateDialogComponent, {
      context: {
        candidate: {...candidate}
      },
    }).onClose.subscribe((updatedCandidate: Candidate) => {
      if (updatedCandidate) {
        this.candidateService.updateCandidate(updatedCandidate.id, updatedCandidate).subscribe({
          next: (result) => {
            const index = this.candidates.findIndex(c => c.id === result.id);
            if (index !== -1) {
              this.candidates[index] = result;
            }
          },
          error: (error) => {
            console.error('Error updating candidate', error);
          }
        });
      }
    });
  }

  deleteCandidate(event: { data: Candidate }): void {
    const candidate = event.data;
    if (candidate.id) {
      this.candidateService.deleteCandidate(candidate.id).subscribe({
        next: () => {
          this.candidates = this.candidates.filter(c => c.id !== candidate.id);
        },
        error: (error) => {
          console.error('Error deleting candidate', error);
        }
      });
    }
  }
}