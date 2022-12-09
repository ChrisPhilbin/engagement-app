import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Settings } from 'src/models/settings-model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings = new Subject<Settings>();
  showSettingsModal = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getAppSettings() {
    this.http
      .get<Settings>(`${environment.firebaseApiUrl}/user/settings`)
      .subscribe((settings: Settings) => {
        this.settings.next(settings);
      });
  }

  updateAppSettings(newSettings: Settings) {
    this.http
      .put<Settings>(`${environment.firebaseApiUrl}/user/settings`, newSettings)
      .subscribe((settings: Settings) => {
        this.settings.next(settings);
      });
  }

  toggleSettingsModal($event: Event) {
    $event.preventDefault();
    this.showSettingsModal.next(!this.showSettingsModal.value);
  }
}
