import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {WS} from './ws';
import {Subject} from 'rxjs/internal/Subject';
import {catchError, tap} from 'rxjs/operators';
import {saveAs} from 'file-saver';

export interface FileStored {
  userName: string;
  storageName: string;
  description: string;
}


const CHAT_URL = 'ws://localhost:3003';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  messages: Subject<any>;

  constructor(private http: HttpClient,
              private ws: WS) {
  }

  postFile(fileToUpload: File, id: string, description: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    formData.append('fileDescription', description);
    formData.append('fileName', fileToUpload.name);
    const headers: HttpHeaders = new HttpHeaders().append('Authorization', id);
    return this.http.post('api/upload', formData, {headers});
  }

  getFiles(): Observable<FileStored[]> {
    return this.http.get('api/files') as Observable<FileStored[]>;
  }

  startWS(): void {
    this.messages = this.ws.connect(CHAT_URL) as Subject<any>;
  }

  download(storageName: string, userName: string): Observable<any> {
    const params = new HttpParams().set('storageName', storageName);
    return this.http.get('api/file', {params, responseType: 'blob'})
      .pipe(
        tap(blob => {
          saveAs(blob, userName);
        }),
        catchError(err => err)
      );
  }
}
