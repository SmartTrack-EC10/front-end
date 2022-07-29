import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SmartRuleApiService {
  url = environment.apiBroker + '/subscriptions';
  constructor(private http: HttpClient) {}

  saveContainer(rule: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/',
    });
    let options = { headers: httpHeaders };

    return this.http.post<any>(this.url, rule, options);
  }

  getSmartRules(): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/',
    });
    let options = { headers: httpHeaders };

    return this.http.get<any>(this.url, options);
  }
}
