import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  EmployeeBirthday,
  EmployeeAnniversary,
  Employee,
} from 'src/models/employee-model';

@Component({
  selector: 'app-at-a-glance',
  templateUrl: './at-a-glance.component.html',
  styleUrls: ['./at-a-glance.component.css'],
})
export class AtAGlanceComponent implements OnInit {
  constructor(private employeeService: EmployeeService) {}

  upcomingBirthdays: EmployeeBirthday[] = [];
  upcomingAnniversaries: EmployeeAnniversary[] = [];
  employees: Employee[] = [];

  ngOnInit(): void {
    this.employeeService.employees.subscribe((employees: Employee[]) => {
      this.employees = employees;
    });

    this.employeeService.employeeBirthdays.subscribe(
      (birthdays: EmployeeBirthday[]) => {
        this.upcomingBirthdays = birthdays;
      }
    );

    this.employeeService.employeeAnniversaries.subscribe(
      (anniversaries: EmployeeAnniversary[]) => {
        this.upcomingAnniversaries = anniversaries;
      }
    );
  }
}
