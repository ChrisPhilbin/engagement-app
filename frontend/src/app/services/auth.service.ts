import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { User } from '../../models/user-model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  public isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public jwtHelper: JwtHelperService,
    public router: Router
  ) {
    this.isLoggedIn.next(this.isAuthenticated());
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBhJGSfs_u0THw9gg1q-4CH9ohcyy6PUco',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.refreshToken,
            responseData.idToken,
            +responseData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBhJGSfs_u0THw9gg1q-4CH9ohcyy6PUco',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.refreshToken,
            responseData.idToken,
            +responseData.expiresIn
          );
        })
      );
  }

  public logout() {
    this.cookieService.delete('email', '/');
    this.cookieService.delete('userId', '/');
    this.cookieService.delete('token', '/');
    this.cookieService.delete('expirationDate', '/');
    this.cookieService.delete('refreshToken', '/');
    this.user.next(null);
    this.isLoggedIn.next(false);
    this.router.navigate(['login']);
  }

  public isAuthenticated(): boolean {
    //need to set cookie with user info upon initial auth
    //then get the token from the cookie and see if it is active
    //@ts-ignore
    const token: string = this.cookieService.get('token');

    if (this.jwtHelper.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    let localUser;

    this.user.subscribe((user) => {
      localUser = user;
    });
    if (!this.jwtHelper.isTokenExpired(token) && localUser === null) {
      //if token is still valid get the user data from the cookie and then set set user.next to value of newly created user object
      //@ts-ignore
      let user = new User(
        this.cookieService.get('email'),
        this.cookieService.get('userId'),
        this.cookieService.get('refreshToken'),
        this.cookieService.get('token'),
        //@ts-ignore
        this.cookieService.get('expirationDate')
      );
      this.user.next(user);
    }

    //in future, can setup an option in cookie indicating whether or not user should stay signed in
    //if so, use the refreshToken to request a new AuthToken from Firebase
    return !this.jwtHelper.isTokenExpired(token);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    refreshToken: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, refreshToken, token, expirationDate);
    this.user.next(user);
    this.cookieService.set('email', email);
    this.cookieService.set('userId', userId);
    this.cookieService.set('refreshToken', refreshToken);
    this.cookieService.set('token', token);
    this.cookieService.set(
      'expirationDate',
      JSON.stringify(expirationDate.toString())
    );
    this.isLoggedIn.next(true);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email has already been taken';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password not valid';
        break;
    }
    return throwError(errorMessage);
  }
}
