import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../models/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = `${environment.apiUrl}/files`; // ← /files here

  constructor(private http: HttpClient) {}

  // Upload
  uploadFile(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    return this.http.post(
      `${this.apiUrl}/upload`,          // → /api/files/upload
      formData,
      { responseType: 'text' }
    );
  }

  // Get user files
  getUserFiles(
    userId: number,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse>(
      `${this.apiUrl}/user/${userId}`,   // → /api/files/user/6
      { params }
    );
  }

  // Download
  downloadFile(
    fileId: number,
    userId: number
  ): Observable<Blob> {
    const params = new HttpParams()
      .set('userId', userId.toString());

    return this.http.get(
      `${this.apiUrl}/download/${fileId}`, // → /api/files/download/1
      { params, responseType: 'blob' }
    );
  }

  // Delete
  deleteFile(
    fileId: number,
    userId: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString());

    return this.http.delete(
      `${this.apiUrl}/${fileId}`,          // → /api/files/1
      { params, responseType: 'text' }
    );
  }
}