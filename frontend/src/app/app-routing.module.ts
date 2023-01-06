import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeDetailsComponent } from './components/employees/employee-details/employee-details.component';
import { EmployeeFormComponent } from './components/employees/employee-form/employee-form.component';
import { MeetingDetailsComponent } from './components/meetings/meeting-details/meeting-details.component';
import { MeetingFormComponent } from './components/meetings/meeting-form/meeting-form.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/new',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId',
    component: EmployeeDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId/edit',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId/meetings/new',
    component: MeetingFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId/meetings/:meetingId',
    component: MeetingDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId/meetings/:meetingId/edit',
    component: MeetingFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
