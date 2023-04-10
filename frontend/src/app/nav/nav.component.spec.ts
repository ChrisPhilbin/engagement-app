import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, of } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';

import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let authService: AuthService;
  let settingsService: SettingsService;

  const authServiceStub = {
    testLogin: () => {},
    signup: () => {},
    logout: () => {},
    user: {
      subscribe: () => {},
    },
    isLoggedIn: new BehaviorSubject(false),
  };

  const settingsServiceStub = {
    showSettingsModal: new BehaviorSubject(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [HttpClientModule, AppRoutingModule],
      providers: [
        NavComponent,
        { provide: AuthService, useValue: authServiceStub },
        { provide: SettingsService, useValue: settingsServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    settingsService = TestBed.inject(SettingsService);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to showSettingsModal upon initialization', () => {
    expect(component.showSettingsModal).toBe(false);
    settingsService.showSettingsModal.next(true);
    component.ngOnInit();
    expect(component.showSettingsModal).toBe(true);
  });

  it('Should subscribe to isLoggedIn upon initialization', () => {
    expect(component.isLoggedIn).toBe(false);
    authService.isLoggedIn.next(true);
    component.ngOnInit();
    expect(component.isLoggedIn).toBe(true);
  });

  it('Should call authService.logout() when clicking the logout link', () => {
    const logoutSpy = spyOn(component, 'logout');
    component.isLoggedIn = true;
    fixture.detectChanges();
    const logoutElement = fixture.debugElement.query(By.css('#logout'));
    logoutElement.triggerEventHandler('click', {});
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('Component logout function should call authService.logout()', () => {
    const logoutSpy = spyOn(authService, 'logout');
    const mockEvent = new MouseEvent('click');
    component.logout(mockEvent);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
