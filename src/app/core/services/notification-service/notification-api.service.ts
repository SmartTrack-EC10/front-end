import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  url = environment.api + '/notifications';
  constructor(private http: HttpClient) {}

  getNotification(): Observable<any[]> {
    return this.http.get<any[]>(this.url)
  }
}
