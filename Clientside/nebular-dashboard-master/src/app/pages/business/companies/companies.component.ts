import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CompanyRequest } from './company.model';
import { CompanyService } from './companies.service';
import { UpdateCompanyDialogComponent } from './update-company-dialog.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  companyRequests: CompanyRequest[] = [];
  allColumns = ['region', 'province', 'county', 'name', 'franchisee', 'phoneNumber', 'email', 'kraPin', 'actions'];

  constructor(
    private companyService: CompanyService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companyRequests = companies;
      },
      error: (error) => {
        console.error('Error loading companies', error);
      }
    });
  }

  navigateToCreateCompany(): void {
    this.router.navigate(['/pages/business/companies/maintenance/create']);
  }

  


  viewCompany(company: CompanyRequest): void {
    // Implement the logic to view a company
    console.log('View company:', company);
  }

  openUpdateModal(company: CompanyRequest): void {
    this.dialogService.open(UpdateCompanyDialogComponent, {
      context: {
        company: company
      },
    }).onClose.subscribe((updatedCompany: CompanyRequest) => {
      if (updatedCompany) {
        this.companyService.updateCompany(updatedCompany.id, updatedCompany).subscribe({
          next: (updatedCompany) => {
            const index = this.companyRequests.findIndex(c => c.id === updatedCompany.id);
            if (index !== -1) {
              this.companyRequests[index] = updatedCompany;
            }
          },
          error: (error) => {
            console.error('Error updating company', error);
          }
        });
      }
    });
  }

  deleteCompany(id: number): void {
    this.companyService.deleteCompany(id).subscribe({
      next: () => {
        this.companyRequests = this.companyRequests.filter(c => c.id !== id);
      },
      error: (error) => {
        console.error('Error deleting company', error);
      }
    });
  }
}