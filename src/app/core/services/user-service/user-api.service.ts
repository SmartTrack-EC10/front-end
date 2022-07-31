import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  url = environment.apiBroker + '/entities';
  constructor(private http: HttpClient) {}

  getPerson(offset: number): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/'
    });

    let httpParams = new HttpParams().set('type', 'Person').set('options', 'keyValues').set('offset', offset).set('limit', 5);

    let options = { headers: httpHeaders, params: httpParams };

    return this.http.get<any>(this.url, options);
  }

  saveContainer(container: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/',
    });
    let options = { headers: httpHeaders };

    return this.http.post<any>(this.url, container, options);
  }
}
