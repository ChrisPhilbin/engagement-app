import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isLoginMode = true;
  isLoading = false;
  error: string = '';

  ngOnInit(): void {
    // console.log(this.authError)
    // this.authService.errorMessage.subscribe((error) => {
    //   this.authError = error
    //   console.log(this.authError, "auth error")
    // })
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
        this.authService.user.subscribe((user) => {
          console.log(user);
        });
        this.router.navigate(['/dashboard']);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
