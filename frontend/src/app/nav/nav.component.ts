import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) {}

  isLoggedIn = false;
  showMobileMenu = false;
  items: MenuItem[];

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;

      this.items = [
        {
          label: 'Main menu',
          items: [
            {
              label: 'Home',
              icon: 'pi pi-home',
              command: () => this.router.navigate(['/']),
            },
            {
              label: 'Dashboard',
              icon: 'pi pi-th-large',
              visible: this.isLoggedIn,
              command: () => this.router.navigate(['/dashboard']),
            },
            {
              label: 'Create Employee',
              icon: 'pi pi-user',
              visible: this.isLoggedIn,
              command: () => this.router.navigate(['/employees/new']),
            },
            {
              label: 'Settings',
              icon: 'pi pi-fw pi-cog',
              visible: this.isLoggedIn,
            },
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              visible: this.isLoggedIn,
              command: () => this.authService.logout(),
            },
            {
              label: 'Signin',
              icon: 'pi pi-sign-in',
              visible: !this.isLoggedIn,
              command: () => this.router.navigate(['/login']),
            },
          ],
        },
      ];
    });
  }

  logout($event: Event) {
    $event.preventDefault();
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    console.log(this.showMobileMenu);
  }
}
