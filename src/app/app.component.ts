import {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RequestService} from './request.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  requestForm: FormGroup;
  error = '';
  requestList$: Observable<any>;
  result: any;

  get headers(): FormArray {
    return this.requestForm.get('headers') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      name: new FormControl(''),
      url: new FormControl(''),
      method: new FormControl(''),
      params: new FormControl(''),
      contentType: new FormControl(''),
      body: new FormControl(''),
      headers: this.fb.array([])
    });
    this.refreshListReq();
  }

  addParam(): void {
    this.headers.push(
      this.fb.group({
        key: new FormControl(''),
        value: new FormControl(''),
      }));
  }

  deleteHeaderGroup(index: number): void {
    this.headers.removeAt(index);
  }

  save(): void {
    this.requestService.save(this.requestForm.getRawValue())
      .subscribe(() => {
          this.refreshListReq();
          this.error = '';
        },
        (error: HttpErrorResponse) => {
          this.error = error.error;
        });
  }

  refreshListReq(): void {
    this.requestList$ = this.requestService.getRequestList();
  }

  send(requestId: string): void {
    this.requestService.send(requestId)
      .subscribe((v) => {
          this.result = JSON.parse(v);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        });
  }

}
