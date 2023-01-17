import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  isAuthenticated: boolean = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    private cookieService: CookieService
  ) {
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  canActivate() {
    this.authService.isAuthenticated();

    if (!this.isAuthenticated && !this.cookieService.get('token')) {
      this.authService.logout();
      this.router.navigate(['login']);
      return false;
    }

    if (!this.isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['login'], {
        queryParams: { sessionExpired: true },
      });
      return false;
    }

    return true;
  }
}
