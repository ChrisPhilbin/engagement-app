import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadProfilePicture(profilePicture: File) {
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    });

    const options = { headers: headers };

    const formData = new FormData();
    formData.append('file', profilePicture);
    this.http
      .post<any>(
        `http://localhost:5001/ng-blog-574e0/us-central1/engagement/upload`,
        formData,
        options
      )
      .subscribe((profileUrl: string) => {
        console.log(profileUrl);
      });
  }
}
