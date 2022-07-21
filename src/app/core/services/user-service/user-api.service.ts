import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  url = environment.api + '/user';
  constructor(private http: HttpClient) {}

  saveContainer(container: User): Observable<User> {
    return this.http.post<User>(this.url, container);
  }
}
