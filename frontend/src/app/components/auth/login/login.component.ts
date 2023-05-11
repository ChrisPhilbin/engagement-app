import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../../../services/auth.service';
import { skip } from 'rxjs/operators';

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

  isLoginMode = false;
  isLoading = false;
  error: string = '';
  sessionExpired = false;
  showDemoGreeting = false;
  demoGreetingMessage = '';
  email = '';
  password = '';

  // ngOnInit(): void {
  //   // this.route.paramMap.subscribe((params: Params) => {
  //   //   console.log(params, 'demo from login component');
  //   // });
  //   this.route.queryParams.pipe(skip(1)).subscribe((params: Params) => {
  //     console.log(params, 'Params from login component');
  //   });
  //   console.log(window.location.href);
  // }

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
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.error = 'Must provide valid credentials';
      return;
    }

    const { username, email, password, confirmPassword } = form.value;

    if (!this.isLoginMode && password !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      //@ts-ignore
      authObs = this.authService.testLogin(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        this.sessionExpired = false;
        this.authService.user.subscribe((user) => {});
        this.router.navigate(['/dashboard']);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
        this.sessionExpired = false;
      }
    );

    form.reset();
  }
}
