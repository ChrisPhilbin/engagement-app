import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Settings } from 'src/models/settings-model';
import { AuthService } from './auth.service';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings = new Subject<Settings>();
  // user = new BehaviorSubject<User | null>(null);
  showSettingsModal = new BehaviorSubject<boolean>(false);
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  getAppSettings() {
    this.http
      .get<Settings>(`${environment.firebaseApiUrl}/user/settings`)
      .subscribe((settings: Settings) => {
        console.log(settings, 'Settings received from backend.');
        this.settings.next(settings);
      });
  }

  updateAppSettings(newSettings: Settings) {
    this.http
      .put<Settings>(`${environment.firebaseApiUrl}/user/settings`, newSettings)
      .subscribe((settings: Settings) => {
        this.cookieService.set(
          'birthdateThreshold',
          settings.birthdateThreshold.toString(),
          { path: '/' }
        );
        this.cookieService.set(
          'lastInteractionThreshold',
          settings.workAnniversaryThreshold.toString(),
          { path: '/' }
        );
        this.cookieService.set(
          'workAnniversaryThreshold',
          settings.workAnniversaryThreshold.toString(),
          { path: '/' }
        );
        this.settings.next(settings);
        this.successMessage = 'Settings sucessfully saved!';
        this.authService.setUpUser();
        setTimeout(() => {
          this.employeeService.getAllEmployees();
          this.showSettingsModal.next(false);
          this.successMessage = '';
        }, 3500);
      });
  }

  toggleSettingsModal() {
    this.showSettingsModal.next(!this.showSettingsModal.value);
  }
}
