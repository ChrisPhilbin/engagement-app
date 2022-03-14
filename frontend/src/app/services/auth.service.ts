import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from '../../models/user-model';

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
  errorMessage = new Subject();

  constructor(private http: HttpClient) {}

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
            console.log(responseData, 'response data');
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

  refreshToken() {
      //implement timer from rxjs
        return this.http
        .post<any>(
          'https://securetoken.googleapis.com/v1/token?key=AIzaSyBhJGSfs_u0THw9gg1q-4CH9ohcyy6PUco',
          {
            grant_type: 'refresh_token',
            refresh_token: this.user.subscribe((user) => {
                console.log(user?.refreshToken, "user refresh token");
                return user?.refreshToken;
            }),
          }
        )
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
    localStorage.setItem('AuthToken', `Bearer ${token}`);
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
