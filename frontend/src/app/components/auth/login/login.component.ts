import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  loginSuccess = false;
  isLoginMode = false;
  isLoading = false;
  error: string = '';
  sessionExpired = false;
  showDemoGreeting = false;
  demoGreetingMessage = '';
  email = '';
  password = '';
  loginButton: HTMLElement;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['sessionExpired']) {
        this.sessionExpired = true;
      }
      if (params['demo'] === 'true') {
        this.isLoginMode = true;
        this.showDemoGreeting = true;
        this.demoGreetingMessage =
          '<strong>Welcome!</strong> Looks like this app is in demo mode given the route query params! Please use the following credentials to login:<br /> <strong>Username:</strong> chris@test.com<br /> <strong>Password:</strong> password123';
      }
    });
  }

  prePopulateFields() {
    this.email = 'chris@test.com';
    this.password = 'password123';
    this.onSubmit();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form?: NgForm) {
    let authObs: Observable<AuthResponseData>;

    if (!form && this.isLoginMode && this.email && this.password) {
      this.isLoading = true;
      //@ts-ignore
      authObs = this.authService.testLogin(this.email, this.password);
    } else if (!form?.valid) {
      this.error = 'Must provide valid credentials';
      return;
    } else {
      const { username, email, password, confirmPassword } = form?.value;

      if (!this.isLoginMode && password !== confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
      }

      this.isLoading = true;

      if (this.isLoginMode) {
        //@ts-ignore
        authObs = this.authService.testLogin(email, password);
      } else {
        authObs = this.authService.signup(email, password);
      }
    }

    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        this.loginSuccess = true;
        this.sessionExpired = false;
        this.authService.user.subscribe((user) => {});
        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 2000);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
        this.sessionExpired = false;
      }
    );

    form?.reset();
  }
}
