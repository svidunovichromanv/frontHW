import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Variants {
  question: string;
  answers: Answers[];
}

export interface Answers {
  value: number;
  label: string;
}

export interface Stat {
  'winter': number;
  'spring': number;
  'summer': number;
  'autumn': number;
}

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  constructor(private http: HttpClient) {
  }

  variants(): Observable<Variants> {
    return this.http.get<Variants>('api/variants');
  }

  stat(): Observable<any> {
    return this.http.get<Stat>('api/stat');
  }

  vote(value: number): Observable<any> {
    return this.http.post('api/vote', {value},
      {responseType: 'text'});
  }

  stateFiles(format): Observable<any> {
    const responseType = format === 'text/html' || format === 'application/xml' ? 'text' : 'json';
    return this.http.get('api/file-state', {responseType: responseType as any, headers: {Accept: format}});
  }
}
