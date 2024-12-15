import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  createTask(body: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/tasks`, body);
  }

  getTasks(queryParams?: any): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/tasks`, { params: queryParams });
  }

  getDeletedTasks(queryParams?: any): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/tasks/deleted`, { params: queryParams });
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/tasks/${taskId}`);
  }

  updateTask(taskId: string, body: any): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/tasks/${taskId}`, body);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/tasks/${taskId}`);
  }

  restoreTask(taskId: string): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/tasks/${taskId}/restore`, {});
  }
}
