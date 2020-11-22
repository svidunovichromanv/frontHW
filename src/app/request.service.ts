import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {
  }

  save(value: any): Observable<any> {
    return this.http.post('api/save', {value},
      {responseType: 'text'});
  }

  getRequestList(): Observable<any> {
    return this.http.get('api/requests');
  }

  send(requestId: string): Observable<any> {
    return this.http.post('api/start', {id: requestId},
      {responseType: 'text'});
  }
}
