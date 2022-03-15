import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Employee,
  EmployeeAnniversary,
  EmployeeBirthday,
} from 'src/models/employee-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = new Subject<Employee[]>();
  employee = new Subject<Employee>();
  employeeBirthdays = new Subject<EmployeeBirthday[]>();
  employeeAnniversaries = new Subject<EmployeeAnniversary[]>();

  constructor(private http: HttpClient) {}

  getAllEmployees() {
    this.http
      .get<Employee[]>(`${environment.firebaseApiUrl}/employees`)
      .subscribe((employees: Employee[]) => {
        this.employees.next(employees);
      });
  }

  getSingleEmployeeDetails(employeeId: string) {
    this.http
      .get<Employee>(`${environment.firebaseApiUrl}/employees/${employeeId}`)
      .subscribe((employee: Employee) => {
        this.employee.next(employee);
      });
  }

  getUpcomingBirthdays() {
    this.http
      .get<EmployeeBirthday[]>(
        `${environment.firebaseApiUrl}/employees/birthdays`
      )
      .subscribe((employeeBirtdays: EmployeeBirthday[]) => {
        this.employeeBirthdays.next(employeeBirtdays);
      });
  }

  getUpcomingAnniversaries() {
    this.http
      .get<EmployeeAnniversary[]>(
        `${environment.firebaseApiUrl}/employees/anniversaries`
      )
      .subscribe((employeeAnniversaries: EmployeeAnniversary[]) => {
        this.employeeAnniversaries.next(employeeAnniversaries);
      });
  }
}
