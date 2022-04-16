import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
