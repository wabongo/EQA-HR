import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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


  getDepartments(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.userApi}/departments`, { headers: this.getHeaders() })
      .pipe(map(response => response.entity));
  }

  getJobTypes(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.userApi}/job-types`, { headers: this.getHeaders() })
      .pipe(map(response => response.entity));
  }

  getDesignations(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.userApi}/designations`, { headers: this.getHeaders() })
      .pipe(map(response => response.entity));
  }

  searchJobs(filters: any): Observable<JoblistingsRequest[]> {
    let params = new HttpParams();
    if (filters.department) params = params.set('department', filters.department);
    if (filters.jobType) params = params.set('jobType', filters.jobType);
    if (filters.designation) params = params.set('designation', filters.designation);

    return this.http.get<ApiResponse<JoblistingsRequest[]>>(`${this.userApi}/search`, { 
      headers: this.getHeaders(),
      params: params
    }).pipe(map(response => response.entity));
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
        return throwError(() => error);
      })
    );
  }

  getJobPostById(id: string): Observable<JoblistingsRequest> {
    return this.http.get<any>(`${this.userApi}/view/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.entity) {
          return response.entity as JoblistingsRequest;
        } else {
          console.error('Unexpected response structure:', response);
          throw new Error('Unexpected response structure');
        }
      }),
      catchError(error => {
        console.error('Error fetching job post by ID:', error);
        return throwError(() => error);
      })
    );
  }  

  createJobPost(jobPost: JoblistingsRequest): Observable<any> {
    return this.http.post(`${this.userApi}/create`, jobPost, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from create job post:', response)),
      catchError(error => {
        console.error('Error in create job post:', error);
        return throwError(() => error);
      })
    );
  }

  updateJobPost(id: string, jobPost: JoblistingsRequest): Observable<any> {
    return this.http.put(`${this.userApi}/update/${id}`, jobPost, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from update job post:', response)),
      catchError(error => {
        console.error('Error updating job post:', error);
        return throwError(() => error);
      })
    );
  }    

  getJobsByStatus(status: string): Observable<JoblistingsRequest[]> {
    console.log(`Fetching jobs with status: ${status}`);
    return this.http.get<ApiResponse<JoblistingsRequest[]>>(`${this.userApi}/status/${status}`, 
      { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Raw response:', response)),
        map(response => {
          if (response && response.entity && Array.isArray(response.entity)) {
            console.log('Mapped response:', response.entity);
            return response.entity;
          } else {
            console.error('Unexpected response structure:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error(`Error fetching jobs with status ${status}:`, error);
          return throwError(() => error);
        })
      );
  }




  getJobRequisitions(): Observable<JoblistingsRequest[]> {
    return this.http.get<ApiResponse<JoblistingsRequest[]>>(`${this.userApi}/requisitions`, 
      { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.entity && Array.isArray(response.entity)) {
            return response.entity;
          } else {
            console.error('Unexpected response structure:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error('Error fetching job requisitions:', error);
          return throwError(() => error);
        })
      );
  }

  getApprovedJobPosts(): Observable<JoblistingsRequest[]> {
    return this.http.get<ApiResponse<JoblistingsRequest[]>>(`${this.userApi}`, 
      { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.entity && Array.isArray(response.entity)) {
            return response.entity;
          } else {
            console.error('Unexpected response structure:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error('Error fetching approved job posts:', error);
          return throwError(() => error);
        })
      );
  }

  approveJobRequest(id: string): Observable<any> {
    return this.http.put(`${this.userApi}/approve/${id}`, {}, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from approve job request:', response)),
      catchError(error => {
        console.error('Error approving job request:', error);
        return throwError(() => error);
      })
    );
  }



  deleteJobPost(id: string): Observable<any> {
    return this.http.delete(`${this.userApi}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error deleting job post:', error);
        return throwError(() => error);
      })
    );
  }

}

interface ApiResponse<T> {
  message: string;
  entity: T;
  statusCode: number;
}
