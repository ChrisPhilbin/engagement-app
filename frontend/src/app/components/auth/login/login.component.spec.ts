import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import {
  AuthResponseData,
  AuthService,
  UserResponseData,
} from 'src/app/services/auth.service';

import { LoginComponent } from './login.component';

const authServiceStub = {
  testLogin: () => {},
  signup: () => {},
  user: {
    subscribe: () => {},
  },
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      providers: [
        LoginComponent,
        { provide: AuthService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  it('Login Component should be successfully created/mounted', () => {
    expect(component).toBeTruthy();
  });

  it('Should call authService.testLogin when given a username and password', () => {
    const authSpy = spyOn(authService, 'testLogin').and.returnValue(
      of(
        {} as { authResponseData: AuthResponseData; userData: UserResponseData }
      )
    );
    //@ts-ignore
    const testFormData = <NgForm>{
      valid: true,
      value: {
        email: 'test@test.com',
        password: 'testpass',
      },
      reset: () => {},
    };
    component.onSubmit(testFormData);
    expect(authSpy).toHaveBeenCalledTimes(1);
  });

  it('Should not attempt to authenticate user if the form is invalid', () => {
    const authSpy = spyOn(authService, 'testLogin');
    const testFormData = <NgForm>{
      valid: false,
      value: {
        email: '',
        password: '',
      },
    };
    component.onSubmit(testFormData);
    fixture.detectChanges();
    expect(authSpy).toHaveBeenCalledTimes(0);
  });

  it('Should run authService.signup method if the form is in signup mode', () => {
    const signUpSpy = spyOn(authService, 'signup').and.returnValue(
      of({} as AuthResponseData)
    );
    const testFormData = <NgForm>{
      valid: true,
      value: {
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      },
      reset: () => {},
    };
    component.isLoginMode = false;
    component.onSubmit(testFormData);
    expect(signUpSpy).toHaveBeenCalledTimes(1);
  });

  it('Should not allow a user to sign up if the password and confirmPassword do not match', () => {
    const signUpSpy = spyOn(authService, 'signup').and.returnValue(
      of({} as AuthResponseData)
    );
    const testFormData = <NgForm>{
      valid: true,
      value: {
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password123',
      },
      reset: () => {},
    };
    component.isLoginMode = false;
    component.onSubmit(testFormData);
    expect(signUpSpy).toHaveBeenCalledTimes(0);
  });

  it('Should display a div that contains an error message in the event of a user error during login', () => {
    const testFormData = <NgForm>{
      valid: false,
      value: {
        email: '',
        password: '',
      },
      reset: () => {},
    };
    component.onSubmit(testFormData);
    fixture.detectChanges();
    const loginElement: HTMLElement = fixture.nativeElement;
    const errorContainer = loginElement.querySelector('error-container');
    expect(errorContainer).toBeDefined();
  });
});
