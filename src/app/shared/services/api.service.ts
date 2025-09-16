import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost/api';
  // private baseUrl = 'https://azhalitsolutions.com/';

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  // Contact form
  postContact(body: any): Observable<any> {
    return this.post<any>('contact.php', body);
  }

  // ✅ Account registration (Step 1)
  postAccount(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/account/register.php`, data);
  }

  // ✅ Student profile registration (Step 2)
  postStudentRegistration(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/students/register.php`, data);
  }
  // ✅ Student profile registration (Step 2)
  postProfile(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/students/profile.php`, data);
  }
  postLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/account/login.php`, data);
  }

}
