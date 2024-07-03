import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, pipe, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JoblistingsRequest } from './job-listings.model';

@Injectable({
  providedIn: 'root'
})
export class JobListingsService {
  private userApi =`${environment.userApi}/recruitment`;

  constructor(private http: HttpClient) {}

  getAllJobPosts(): Observable<JoblistingsRequest[]> {
    return this.http.get<JoblistingsRequest[]>(`${this.userApi}/job-posts`, { withCredentials: true })
    .pipe(
      catchError(error => {
        console.error('Error fetching job posts:', error);
        if (error.status === 401 || error.status === 403) {
          // Redirect to login page or show login modal
        }
        return throwError(() => new Error('Failed to fetch job posts'));
      })
    );
}

  // Apply the same change to other methods
  getJobPostById(id: number): Observable<JoblistingsRequest> {
    return this.http.get<JoblistingsRequest>(`${this.userApi}/${id}`, { withCredentials: true });
  }

  createJobPost(jobPost: JoblistingsRequest): Observable<any> {
    return this.http.post(`${this.userApi}/create`, jobPost, { withCredentials: true });
  }

  updateJobPost(id: number, jobPost: JoblistingsRequest): Observable<any> {
    return this.http.put(`${this.userApi}/${id}`, jobPost, { withCredentials: true });
  }

  deleteJobPost(id: number): Observable<any> {
    return this.http.delete(`${this.userApi}/${id}`, { withCredentials: true });
  }
}
