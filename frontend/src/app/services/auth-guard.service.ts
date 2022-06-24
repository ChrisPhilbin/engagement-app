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
    this.authService.isAuthenticated();
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
