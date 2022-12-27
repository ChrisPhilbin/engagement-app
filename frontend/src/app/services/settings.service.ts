import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Settings } from 'src/models/settings-model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings = new Subject<Settings>();
  // user = new BehaviorSubject<User | null>(null);
  showSettingsModal = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
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
          settings.birthdateThreshold.toString()
        );
        this.cookieService.set(
          'lastInteractionThreshold',
          settings.workAnniversaryThreshold.toString()
        );
        this.cookieService.set(
          'workAnniversaryThreshold',
          settings.workAnniversaryThreshold.toString()
        );
        this.settings.next(settings);
      });
  }

  toggleSettingsModal($event: Event) {
    $event.preventDefault();
    this.showSettingsModal.next(!this.showSettingsModal.value);
  }
}
