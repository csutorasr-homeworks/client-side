import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  private static SESSION_STORAGE_KEY = 'accessToken';
  private user: GoogleUser;
  private isLoggedInSubject = new BehaviorSubject(false);
  /**
   * Observable to show if the user is logged in.
   */
  public isLoggedIn: Observable<boolean>;

  /**
   * Constructor of the user service
   * @param googleAuth GoogleAuthService to auth Google
   * @param zone Zone to run Google promises in the Angular Zone
   * @param router The router to change routes on login
   */
  constructor(private googleAuth: GoogleAuthService, private zone: NgZone, private router: Router) {
    this.isLoggedIn = this.isLoggedInSubject.asObservable();
    this.isLoggedInSubject.next(this.isUserSignedIn());
    this.isLoggedIn.subscribe(loggedIn => this.router.navigateByUrl(loggedIn ? '/' : '/login'));
  }

  /**
   * Gets the token of the Google auth.
   */
  public getToken(): string {
    const token = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
  }

  /**
   * Logs in the user.
   */
  public signIn(): void {
    this.googleAuth.getAuth()
      .subscribe((auth) => {
        auth.signIn().then(res => this.signInSuccessHandler(res));
      });
  }

  /**
   * Signs the user out.
   */
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

  /**
   * Checks if the user is logged in.
   */
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
