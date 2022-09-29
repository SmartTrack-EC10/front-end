import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TruckApiService {
  url = environment.apiIoT + '/devices';
  urlBroker = environment.apiBroker + '/entities';
  constructor(private http: HttpClient) {}

  getTrucks(offset: number): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/'
    });

    let httpParams = new HttpParams().set('type', 'Truck').set('options', 'keyValues').set('offset', offset).set('limit', 5);

    let options = { headers: httpHeaders, params: httpParams};

    return this.http.get<any>(this.urlBroker, options);
  }

  getAllTrucks(): Observable<any[]> {
    let httpHeaders = new HttpHeaders({
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/'
    });
    let options = { headers: httpHeaders};
    return this.http.get<any[]>(this.urlBroker+'?type=Truck', options)
  }

  saveTruck(truck: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'fiware-service': 'helixiot',
      'fiware-servicepath': '/'
    });
    let options = { headers: httpHeaders };

    console.log(truck)
    return this.http.post<any>(this.url, truck, options);
  }
}
