import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeesComponent } from './employees.component';
import { UpcomingBirthdaysComponent } from './upcoming-birthdays/upcoming-birthdays.component';
import { UpcomingAnniversariesComponent } from './upcoming-anniversaries/upcoming-anniversaries.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { AtAGlanceComponent } from './at-a-glance/at-a-glance.component';
import { EmployeeCardComponent } from './employee-card/employee-card.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmployeeDetailsComponent,
    EmployeesComponent,
    UpcomingBirthdaysComponent,
    UpcomingAnniversariesComponent,
    EmployeeFormComponent,
    AtAGlanceComponent,
    EmployeeCardComponent,
    EmployeeTableComponent,
  ],
  exports: [
    EmployeeDetailsComponent,
    EmployeesComponent,
    UpcomingBirthdaysComponent,
    UpcomingAnniversariesComponent,
    EmployeeFormComponent,
    AtAGlanceComponent,
    EmployeeCardComponent,
    EmployeeTableComponent,
  ],
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class EmployeesModule {}
