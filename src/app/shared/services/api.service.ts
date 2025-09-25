import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // private baseUrl = 'http://localhost/api';
  private baseUrl = 'https://azhalitsolutions.com/api';

  constructor(private http: HttpClient) { }
  getBaseUrl(): string {
    return this.baseUrl;
  }

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

  postAccount(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register.php`, body);
  }

  postFormData(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register.php`, body);
  }
  postLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register.php`, data);
  }
  getHomeContent(): Observable<any[]> {
    return this.get<any[]>('home_content.php');
  }
  getAboutSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/about_content.php`);
  }

  getAboutItems(sectionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/about_items.php?section_id=${sectionId}`);
  }

  getServiceContents(): Observable<any[]> {
    return this.get<any[]>('services_content.php');
  }

}
