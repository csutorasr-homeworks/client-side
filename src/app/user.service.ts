import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  public static SESSION_STORAGE_KEY = 'accessToken';
  private user: GoogleUser;
  private isLoggedInSubject = new BehaviorSubject(false);
  public isLoggedIn: Observable<boolean>;

  constructor(private googleAuth: GoogleAuthService, private zone: NgZone) {
    this.isLoggedIn = this.isLoggedInSubject.asObservable();
    this.isLoggedInSubject.next(this.isUserSignedIn());
  }

  public getToken(): string {
    const token = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
  }

  public signIn(): void {
    this.googleAuth.getAuth()
      .subscribe((auth) => {
        auth.signIn().then(res => this.signInSuccessHandler(res));
      });
  }

  public signOut(): void {
    this.googleAuth.getAuth().subscribe((auth) => {
      try {
        auth.signOut();
      } catch (e) {
        console.error(e);
      }
      sessionStorage.removeItem(UserService.SESSION_STORAGE_KEY);
      this.isLoggedInSubject.next(false);
    });
  }

  private isUserSignedIn(): boolean {
    return !!sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.zone.run(() => {
      this.user = res;
      sessionStorage.setItem(
        UserService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
      );
      this.isLoggedInSubject.next(true);
    });
  }
}
