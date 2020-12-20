import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {PostmanService} from './postman.service';

@Component({
  selector: 'app-postman',
  templateUrl: './postman.component.html',
  styleUrls: ['./postman.component.css']
})
export class PostmanComponent implements OnInit {
  requestForm: FormGroup;
  error = '';
  requestList$: Observable<any>;
  result: any;

  get headers(): FormArray {
    return this.requestForm.get('headers') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private postmanService: PostmanService) {
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
    this.postmanService.save(this.requestForm.getRawValue())
      .subscribe(() => {
          this.refreshListReq();
          this.error = '';
        },
        (error: HttpErrorResponse) => {
          this.error = error.error;
        });
  }

  refreshListReq(): void {
    this.requestList$ = this.postmanService.getRequestList();
  }

  send(requestId: string): void {
    this.postmanService.send(requestId)
      .subscribe((v) => {
          this.result = JSON.parse(v);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        });
  }

}
