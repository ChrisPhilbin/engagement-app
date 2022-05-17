import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  isAuthenticated: boolean = false;
  constructor(public authService: AuthService, public router: Router) {
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  canActivate() {
    if (!this.isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
