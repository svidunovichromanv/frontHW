import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VotesComponent } from './votes/votes.component';

@NgModule({
  declarations: [
    AppComponent,
    VotesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    MatRadioModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
