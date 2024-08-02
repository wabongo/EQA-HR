import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../@auth/auth.service';
import { Candidate } from './candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = `${environment.recruitmentApi}candidates`;

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

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Raw response from getCandidates:', response);
        if (response && response.entity && Array.isArray(response.entity)) {
          return response.entity;
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching candidates:', error);
        return throwError(() => error);
      })
    );
  }

  createCandidate(formData: FormData): Observable<any> {
    console.log('Creating candidate with data:', formData);
    return this.http.post<Candidate>(`${this.apiUrl}`, formData, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from create candidate:', response)),
      catchError(error => {
        console.error('Error in create candidate:', error);
        return throwError(() => error);
      })
    );
  }

  updateCandidate(id: number, candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, candidate, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from update candidate:', response)),
      catchError(error => {
        console.error('Error in update candidate:', error);
        return throwError(() => error);
      })
    );
  }

  deleteCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Candidate deleted successfully')),
      catchError(error => {
        console.error('Error in delete candidate:', error);
        return throwError(() => error);
      })
    );
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from get candidate by id:', response)),
      catchError(error => {
        console.error('Error in get candidate by id:', error);
        return throwError(() => error);
      })
    );
  }
}