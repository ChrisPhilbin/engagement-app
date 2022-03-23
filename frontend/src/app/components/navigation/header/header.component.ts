import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnChanges {
  constructor(private AuthService: AuthService, private router: Router) {}

  items: MenuItem[] = [];

  @Input() isAuthenticated = false;

  ngOnChanges() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
      },
      {
        label: 'Employees',
        icon: 'pi pi-fw pi-user',
        visible: this.isAuthenticated,
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus',
          },
          {
            label: 'View All',
            icon: 'pi pi-fw pi-list',
            command: () => this.router.navigate(['/dashboard']),
          },
        ],
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        visible: this.isAuthenticated,
        command: () => this.handleLogOut(),
      },
      {
        label: 'Sign In',
        icon: 'pi pi-fw pi-sign-in',
        visible: !this.isAuthenticated,
        command: () => this.redirectToLogin(),
      },
    ];
  }

  isLoggedIn() {
    return this.AuthService.isAuthenticated();
  }

  handleLogOut() {
    this.AuthService.logout();
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
