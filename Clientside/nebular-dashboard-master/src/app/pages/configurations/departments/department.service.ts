import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../@auth/auth.service';
import { Department } from './department.model';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.recruitmentApi}departments`;

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

  getDepartments(): Observable<Department[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Raw response from getDepartments:', response);
        if (response && response.entity && Array.isArray(response.entity)) {
          return response.entity;
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching departments:', error);
        return throwError(() => error);
      })
    );
  }

  
  createDepartment(department: Partial<Department>): Observable<Department> {
    console.log('Creating department with data:', department);
    return this.http.post<{ data: Department }>(`${this.apiUrl}/create`, department, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      tap(response => console.log('Response from create department:', response)),
      catchError(error => {
        console.error('Error in create department:', error);
        return throwError(() => error);
      })
    );
  }

  getDepartment(id: number): Observable<Department> {
    return this.http.get<{ data: Department }>(`${this.apiUrl}/view/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      tap(response => console.log('Response from get department:', response)),
      catchError(error => {
        console.error('Error in get department:', error);
        return throwError(() => error);
      })
    );
  }

  updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
    return this.http.put<{ data: Department }>(`${this.apiUrl}/update/${id}`, department, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      tap(response => console.log('Response from update department:', response)),
      catchError(error => {
        console.error('Error in update department:', error);
        return throwError(() => error);
      })
    );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Department deleted successfully')),
      catchError(error => {
        console.error('Error in delete department:', error);
        return throwError(() => error);
      })
    );
  }
}