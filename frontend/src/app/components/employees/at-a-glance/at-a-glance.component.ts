import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  EmployeeBirthday,
  EmployeeAnniversary,
  Employee,
  EmployeeInteraction,
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
  outstandingInteractions: EmployeeInteraction[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.employeeService.getOutstandingInteractions();

    combineLatest(
      this.employeeService.employees,
      this.employeeService.employeeBirthdays,
      this.employeeService.employeeAnniversaries,
      this.employeeService.employeeInteractions
    ).subscribe(([employees, birthdays, anniversaries, interactions]) => {
      this.employees = employees;
      this.upcomingBirthdays = birthdays;
      this.upcomingAnniversaries = anniversaries;
      this.outstandingInteractions = interactions;
      this.isLoading = false;
    });

    // this.employeeService.employees.subscribe((employees: Employee[]) => {
    //   this.employees = employees;
    // });

    // this.employeeService.employeeBirthdays.subscribe(
    //   (birthdays: EmployeeBirthday[]) => {
    //     this.upcomingBirthdays = birthdays;
    //   }
    // );

    // this.employeeService.employeeAnniversaries.subscribe(
    //   (anniversaries: EmployeeAnniversary[]) => {
    //     this.upcomingAnniversaries = anniversaries;
    //   }
    // );

    // this.employeeService.employeeInteractions.subscribe(
    //   (interactions: EmployeeInteraction[]) => {
    //     this.outstandingInteractions = interactions;
    //   }
    // );
  }
}
