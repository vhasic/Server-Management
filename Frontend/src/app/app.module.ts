import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NotificationModule } from './notification.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ // importing modules that are used in app.component.html
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NotificationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
