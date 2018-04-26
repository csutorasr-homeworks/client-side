import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NG_GAPI_CONFIG, GoogleApiModule } from 'ng-gapi';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { gapiClientConfig } from './gapi.config';
import { CoreModule } from './core/core.module';
import { FileListComponent } from './file-list/file-list.component';
import { RefreshButtonComponent } from './refresh-button/refresh-button.component';


@NgModule({
  declarations: [
    AppComponent,
    FileListComponent,
    RefreshButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    CoreModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    HttpClientModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
