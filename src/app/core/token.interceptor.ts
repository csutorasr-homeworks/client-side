import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  /**
   * Constructor of the interceptor.
   * @param userService UserService to provide token.
   */
  constructor(private userService: UserService) { }

  /**
   * If the token is set, adds authorization header to the request.
   * @param request httpRequest
   * @param next The next handler.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getToken();
    if (token != null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
