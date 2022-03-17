import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
