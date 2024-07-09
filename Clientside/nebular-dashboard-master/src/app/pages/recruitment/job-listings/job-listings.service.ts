import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { JoblistingsRequest } from './job-listings.model';
import { AuthService } from '../../../@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobListingsService {
  private userApi = `${environment.recruitmentApi}job-posts`;

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

  getAllJobPosts(): Observable<JoblistingsRequest[]> {
    return this.http.get<any>(`${this.userApi}`).pipe(
      map(response => {
        console.log('Raw response from getAllJobPosts:', response);
        if (response && response.entity && Array.isArray(response.entity)) {
          return response.entity;
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching job posts:', error);
        throw error;
      })
    );
  }

  // Apply similar changes to other methods
  getJobPostById(id: number): Observable<JoblistingsRequest> {
    return this.http.get<JoblistingsRequest>(`${this.userApi}/${id}`, { headers: this.getHeaders() });
  }

  createJobPost(jobPost: JoblistingsRequest): Observable<any> {
    console.log('Creating job post with data:', jobPost);
    console.log('API endpoint:', `${this.userApi}/create`);
    return this.http.post(`${this.userApi}/create`, jobPost, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from create job post:', response)),
      catchError(error => {
        console.error('Error in create job post:', error);
        return throwError(() => error);
      })
    );
  }

  updateJobPost(id: number, jobPost: JoblistingsRequest): Observable<any> {
    return this.http.put(`${this.userApi}/${id}`, jobPost, { headers: this.getHeaders() });
  }

  deleteJobPost(id: number): Observable<any> {
    return this.http.delete(`${this.userApi}/${id}`, { headers: this.getHeaders() });
  }
}
