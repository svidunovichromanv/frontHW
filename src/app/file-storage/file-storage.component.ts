import {Component, OnInit} from '@angular/core';
import {FileStorageService, FileStored} from './file-storage.service';
import {v4 as uuidv4} from 'uuid';
import {Observable, of} from 'rxjs';
import {catchError, filter, map, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-file-storage',
  templateUrl: './file-storage.component.html',
  styleUrls: ['./file-storage.component.css']
})
export class FileStorageComponent implements OnInit {

  fileToUpload: File = null;
  uploadProgress$: Observable<string>;
  userId: string;
  files$: Observable<FileStored[]>;

  description = '';

  constructor(private fileStorageService: FileStorageService) {
  }

  ngOnInit(): void {
    this.files$ = this.fileStorageService.getFiles();
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity(): void {
    this.userId = uuidv4();
    this.fileStorageService.startWS();
    this.uploadProgress$ = this.fileStorageService.messages.asObservable()
      .pipe(
        map(message => message.data),
        tap(message => {
          if (message === 'init') {
            this.fileStorageService.messages.next(this.userId);
          }
        }),
        tap(message => {
          if (message === 'destroy') {
            this.fileStorageService.messages.complete();
            this.uploadProgress$ = null;
          }
        }),
        filter((message: string) => message.includes('%')),
        catchError(() => {
          this.uploadProgress$ = null;
          return of('error');
        })
      );
    this.fileStorageService.postFile(this.fileToUpload, this.userId, this.description).subscribe(data => {
      this.uploadProgress$ = null;
    }, error => {
      this.uploadProgress$ = null;
    });
  }

  download(storageName: string, userName: string): void {
    this.fileStorageService.download(storageName, userName).subscribe();
  }

}
