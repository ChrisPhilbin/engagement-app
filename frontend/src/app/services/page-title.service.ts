import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  constructor() {}

  setPageTitle(title: string) {
    document.title = `${environment.appName} ${title}`;
  }
}
