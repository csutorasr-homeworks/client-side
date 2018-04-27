import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isLoggedIn.pipe(map(x => !x), tap(x => {
      if (!x) {
        this.router.navigateByUrl('/');
      }
    }));
  }
}
