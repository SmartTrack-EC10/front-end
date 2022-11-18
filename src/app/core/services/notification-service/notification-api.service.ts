import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  urlBroker = environment.apiPython + '/notifications';
  constructor(private http: HttpClient) { }

  getNotification(id: string): Observable<any[]> {
    let httpParams = new HttpParams().set('type', 'Truck').set('id', id)

    let options = { params: httpParams };
    return this.http.get<any[]>(this.urlBroker, options)
  }
}
