// // base-api.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class BaseApiService {
//   protected apiUrl = environment.apiUrl;

//   constructor(protected http: HttpClient) {}

//   protected get<T>(endpoint: string, params?: any): Observable<T> {
//     return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params });
//   }

//   protected post<T>(endpoint: string, body: any, options?: any): Observable<HttpEvent<T>> {
//     return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, options);
//   }

//   protected put<T>(endpoint: string, body: any): Observable<T> {
//     return this.http.put<T>(`${this.apiUrl}${endpoint}`, body);
//   }

//   protected patch<T>(endpoint: string, body: any): Observable<T> {
//     return this.http.patch<T>(`${this.apiUrl}${endpoint}`, body);
//   }

//   protected delete<T>(endpoint: string): Observable<T> {
//     return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
//   }
// }
