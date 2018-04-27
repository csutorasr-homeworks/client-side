import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { TokenInterceptor } from './token.interceptor';
import { UserService } from './user.service';
import { DriveService } from './drive.service';
import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    UserService,
    DriveService,
    AuthGuard,
    UnauthGuard,
  ],
})
export class CoreModule { }
