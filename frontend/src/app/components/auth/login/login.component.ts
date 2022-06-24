import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  isLoginMode = true;
  isLoading = false;
  error: string = '';
  sessionExpired = false;

  ngOnInit(): void {
    // console.log(this.authError)
    // this.authService.errorMessage.subscribe((error) => {
    //   this.authError = error
    //   console.log(this.authError, "auth error")
    // })
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params, 'params passed in to login component');
      if (params['sessionExpired']) {
        this.sessionExpired = true;
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
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
      authObs = this.authService.login(email, password);
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
