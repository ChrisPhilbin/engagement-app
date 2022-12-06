import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private AuthService: AuthService, private router: Router) {}

  items: MenuItem[] = [];
  showSettingsModal: boolean = false;

  ngOnInit() {
    this.AuthService.isLoggedIn.subscribe((isLoggedIn) => {
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          command: () => this.router.navigate(['/dashboard']),
        },
        {
          label: 'Employees',
          icon: 'pi pi-fw pi-user',
          visible: isLoggedIn,
          items: [
            {
              label: 'New',
              icon: 'pi pi-fw pi-user-plus',
              command: () => this.router.navigate(['/employees/new']),
            },
            {
              label: 'View All',
              icon: 'pi pi-fw pi-list',
              command: () => this.router.navigate(['/dashboard']),
            },
          ],
        },
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-cog',
          visible: isLoggedIn,
          command: () => this.toggleSettingsModal(),
        },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-sign-out',
          visible: isLoggedIn,
          command: () => this.AuthService.logout(),
        },
        {
          label: 'Sign In',
          icon: 'pi pi-fw pi-sign-in',
          visible: !this.AuthService.isLoggedIn,
          command: () => this.redirectToLogin(),
        },
      ];
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  toggleSettingsModal() {
    this.showSettingsModal = !this.showSettingsModal;
    console.log('Toggle settings modal');
  }
}
