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
  '0': number;
  '1': number;
  '2': number;
  '3': number;
}

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  constructor(private http: HttpClient) {
  }

  variants(): Observable<Variants> {
    return this.http.get<Variants>('/api/variants');
  }

  stat(): Observable<any> {
    return this.http.get<Stat>('/api/stat');
  }

  vote(value: number): Observable<any> {
    return this.http.post('/api/vote', {value},
      {responseType: 'text'});
  }
}
