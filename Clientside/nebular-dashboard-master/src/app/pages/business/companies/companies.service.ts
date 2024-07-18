import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyRequest } from './company.model';
import { AuthService } from '../../../@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private userApi = `${environment.recruitmentApi}llcs`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('No access token available');
      throw new Error('No access token available');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCompanies(): Observable<CompanyRequest[]> {
    return this.http.get<any>(this.userApi, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Raw response from getCompanies:', response);
        if (response && response.entity && Array.isArray(response.entity)) {
          return response.entity;
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching companies:', error);
        return throwError(() => error);
      })
    );
  }



  
  createCompany(company: CompanyRequest): Observable<CompanyRequest> {
    console.log('Creating company with data:', company);
    return this.http.post<CompanyRequest>(`${this.userApi}/create`, company, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from create company:', response)),
      catchError(error => {
        console.error('Error in create company:', error);
        return throwError(() => error);
      })
    );
  }

  updateCompany(id: number, company: CompanyRequest): Observable<CompanyRequest> {
    return this.http.put<CompanyRequest>(`${this.userApi}/update/${id}`, company, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from update company:', response)),
      catchError(error => {
        console.error('Error in update company:', error);
        return throwError(() => error);
      })
    );
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userApi}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Company deleted successfully')),
      catchError(error => {
        console.error('Error in delete company:', error);
        return throwError(() => error);
      })
    );
  }

  getCompanyById(id: number): Observable<CompanyRequest> {
    return this.http.get<CompanyRequest>(`${this.userApi}/view/${id}`, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from get company by id:', response)),
      catchError(error => {
        console.error('Error in get company by id:', error);
        return throwError(() => error);
      })
    );
  }
}