import { Component } from '@angular/core';
import { UserService } from './core/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  signedIn = this.userService.isLoggedIn;

  constructor(private userService: UserService) { }

  public signIn() {
    this.userService.signIn();
  }

  public signOut() {
    this.userService.signOut();
  }
}
