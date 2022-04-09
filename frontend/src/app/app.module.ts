import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoadingComponent } from './components/util/loading/loading.component';
import { EmployeeDetailsComponent } from './components/employees/employee-details/employee-details.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { UpcomingBirthdaysComponent } from './components/employees/upcoming-birthdays/upcoming-birthdays.component';
import { UpcomingAnniversariesComponent } from './components/employees/upcoming-anniversaries/upcoming-anniversaries.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { MeetingDetailsComponent } from './components/meetings/meeting-details/meeting-details.component';
import { EmployeeFormComponent } from './components/employees/employee-form/employee-form.component';
import { MeetingFormComponent } from './components/meetings/meeting-form/meeting-form.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { AtAGlanceComponent } from './components/employees/at-a-glance/at-a-glance.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LoadingComponent,
    EmployeeDetailsComponent,
    EmployeesComponent,
    UpcomingBirthdaysComponent,
    UpcomingAnniversariesComponent,
    MeetingsComponent,
    MeetingDetailsComponent,
    EmployeeFormComponent,
    MeetingFormComponent,
    HeaderComponent,
    AtAGlanceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    PanelModule,
    CalendarModule,
    CardModule,
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
