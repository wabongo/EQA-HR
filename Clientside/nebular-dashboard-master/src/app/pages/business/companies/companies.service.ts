import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyRequest } from './company.model';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private userApi = `${environment.recruitmentApi}job-posts`;// Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<CompanyRequest[]> {
    return this.http.get<CompanyRequest[]>(this.userApi);
  }

  createCompany(company: CompanyRequest): Observable<CompanyRequest> {
    return this.http.post<CompanyRequest>(this.userApi, company);
  }

  updateCompany(id: number, company: CompanyRequest): Observable<CompanyRequest> {
    const url = `${this.userApi}/${id}`;
    return this.http.put<CompanyRequest>(url, company);
  }

  deleteCompany(id: number): Observable<void> {
    const url = `${this.userApi}/${id}`;
    return this.http.delete<void>(url);
  }
}