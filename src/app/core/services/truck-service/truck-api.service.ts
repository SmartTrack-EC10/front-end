import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TruckApiService {
  url = environment.apiIoT + '/devices';
  constructor(private http: HttpClient) {}

  saveTruck(truck: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/',
      'Access-Control-Allow-Origin': '*'
    });
    let options = { headers: httpHeaders };

    return this.http.post<any>(this.url, truck, options);
  }
}
