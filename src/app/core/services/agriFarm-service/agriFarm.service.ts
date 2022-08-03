import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgriFarmApiService {
  url = environment.apiIoT + '/devices';
  urlBroker = environment.apiBroker + '/entities';
  constructor(private http: HttpClient) {}

  getFarms(offset: number): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/'
    });

    let httpParams = new HttpParams().set('type', 'AgriFarm').set('options', 'keyValues').set('offset', offset).set('limit', 5);
    
    let options = { headers: httpHeaders, params: httpParams };

    return this.http.get<any>(this.urlBroker, options);
  }

  savefarms(farms: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/',
      'Access-Control-Allow-Origin': '*'
    });
    let options = { headers: httpHeaders };

    return this.http.post<any>(this.url, farms, options);
  }
}
