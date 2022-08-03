import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  urlBroker = environment.apiBroker + '/notifications';
  constructor(private http: HttpClient) {}

  getNotification(): Observable<any[]> {
    return this.http.get<any[]>(this.urlBroker)
  }
}
