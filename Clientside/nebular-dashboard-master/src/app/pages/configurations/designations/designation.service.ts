import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../@auth/auth.service';
import { Designation } from './designation.model';


@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private apiUrl = `${environment.recruitmentApi}designations`;

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


  getDesignations(): Observable<Designation[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Raw response from getDesignations:', response);
        if (response && response.entity && Array.isArray(response.entity)) {
          return response.entity;
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching designations:', error);
        return throwError(() => error);
      })
    );
  }

  createDesignation(designation: Partial<Designation>): Observable<Designation> {
    console.log('Creating designation with data:', designation);
    return this.http.post<{ data: Designation }>(`${this.apiUrl}/create`, designation, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      tap(response => console.log('Response from create designation:', response)),
      catchError(error => {
        console.error('Error in create designation:', error);
        return throwError(() => error);
      })
    );
  }

  getDesignation(id: number): Observable<Designation> {
    return this.http.get<{ data: Designation }>(`${this.apiUrl}/view/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      tap(response => console.log('Response from get designation:', response)),
      catchError(error => {
        console.error('Error in get designation:', error);
        return throwError(() => error);
      })
    );
  }

  updateDesignation(id: number, designation: Partial<Designation>): Observable<Designation> {
    return this.http.put<{ data: Designation }>(`${this.apiUrl}/update/${id}`, designation, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      tap(response => console.log('Response from update designation:', response)),
      catchError(error => {
        console.error('Error in update designation:', error);
        return throwError(() => error);
      })
    );
  }

  deleteDesignation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Designation deleted successfully')),
      catchError(error => {
        console.error('Error in delete designation:', error);
        return throwError(() => error);
      })
    );
  }
}