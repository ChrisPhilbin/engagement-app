import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Employee,
  EmployeeAnniversary,
  EmployeeBirthday,
  EmployeeInteraction,
} from 'src/models/employee-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = new BehaviorSubject<Employee[]>([]);
  employee = new Subject<Employee>();
  employeeBirthdays = new Subject<EmployeeBirthday[]>();
  employeeAnniversaries = new Subject<EmployeeAnniversary[]>();
  employeeInteractions = new Subject<EmployeeInteraction[]>();

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

  createNewEmployee(employee: Employee) {
    this.http
      .post<Employee>(`${environment.firebaseApiUrl}/employees/`, employee)
      .subscribe((employee: Employee) => {
        this.employees.next(this.employees.getValue().concat(employee));
      });
  }

  updateExistingEmployee(employee: Employee, employeeId: string): void {
    this.http
      .put<Employee>(
        `${environment.firebaseApiUrl}/employees/${employeeId}`,
        employee
      )
      .subscribe((employee: Employee) => {
        this.employee.next(employee);
        this.employees.next(this.employees.getValue().concat(employee));
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

  getOutstandingInteractions() {
    this.http
      .get<EmployeeInteraction[]>(
        `${environment.firebaseApiUrl}/employees/interactions`
      )
      .subscribe((employeeInteractions: EmployeeInteraction[]) => {
        this.employeeInteractions.next(employeeInteractions);
      });
  }
}
