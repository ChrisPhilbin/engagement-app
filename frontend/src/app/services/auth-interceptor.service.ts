import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { exhaustMap, take, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return next.handle(req);
        }
        const modifiedRequest = req.clone({
          headers: new HttpHeaders().set(
            'authorization',
            `Bearer ${user.token}`
          ),
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
