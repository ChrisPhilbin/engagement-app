import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeDetailsComponent } from './components/employees/employee-details/employee-details.component';
import { MeetingDetailsComponent } from './components/meetings/meeting-details/meeting-details.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees/:employeeId', component: EmployeeDetailsComponent },
  {
    path: 'employees/:employeeId/meetings/:meetingId',
    component: MeetingDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
