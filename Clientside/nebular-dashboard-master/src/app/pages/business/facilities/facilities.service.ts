import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FacilityRequest } from './facility.model';
import { AuthService } from '../../../@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {
  private apiUrl = `${environment.recruitmentApi}facilities`;

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

  getFacilities(): Observable<FacilityRequest[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Raw response from getFacilities:', response);
        if (response && response.entity && Array.isArray(response.entity)) {
          return response.entity;
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching facilities:', error);
        return throwError(() => error);
      })
    );
  }

  createFacility(facility: FacilityRequest): Observable<FacilityRequest> {
    console.log('Creating facility with data:', facility);
    return this.http.post<FacilityRequest>(`${this.apiUrl}/create`, facility, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from create facility:', response)),
      catchError(error => {
        console.error('Error in create facility:', error);
        return throwError(() => error);
      })
    );
  }

  updateFacility(id: number, facility: FacilityRequest): Observable<FacilityRequest> {
    return this.http.put<FacilityRequest>(`${this.apiUrl}/update/${id}`, facility, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from update facility:', response)),
      catchError(error => {
        console.error('Error in update facility:', error);
        return throwError(() => error);
      })
    );
  }

  deleteFacility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Facility deleted successfully')),
      catchError(error => {
        console.error('Error in delete facility:', error);
        return throwError(() => error);
      })
    );
  }

  getFacilityById(id: number): Observable<FacilityRequest> {
    return this.http.get<FacilityRequest>(`${this.apiUrl}/view/${id}`, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Response from get facility by id:', response)),
      catchError(error => {
        console.error('Error in get facility by id:', error);
        return throwError(() => error);
      })
    );
  }
}