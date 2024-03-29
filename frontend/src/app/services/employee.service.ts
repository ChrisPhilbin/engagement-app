import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Employee,
  EmployeeAnniversary,
  EmployeeBirthday,
  EmployeeInteraction,
} from 'src/models/employee-model';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

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

  resetEmployeeServiceState() {
    this.employees.next([]);
    this.employee = new Subject<Employee>();
    this.employeeBirthdays.next([]);
    this.employeeAnniversaries.next([]);
    this.employeeInteractions.next([]);
  }

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
      });
  }

  updateEmployeeLastInteraction(employee: Employee): void {
    this.http
      .put<Employee>(
        `${environment.firebaseApiUrl}/employees/${employee.employeeId}`,
        {
          firstName: employee.firstName,
          birthDate: employee.birthDate,
          hireDate: employee.hireDate,
          lastInteraction: new Date(),
        }
      )
      .subscribe((employee: Employee) => {
        this.getAllEmployees();
        this.getOutstandingInteractions();
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

  uploadEmployeeProfilePicture(file: File, uniqueId: string) {
    const formData = new FormData();
    formData.append('inboundProfilePicture', file);
    formData.append('uniqueId', uniqueId);

    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );

    return this.http.post<any>(
      `${environment.firebaseApiUrl}/files`,
      formData,
      {
        headers: headers,
      }
    );
  }

  filterByName(name: string): Observable<Employee[]> {
    return this.employees.pipe(
      map((employees): Employee[] =>
        employees.filter(
          (employee) =>
            employee.firstName.toLowerCase().includes(name.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(name.toLowerCase())
        )
      )
    );
  }

  filterByUpComingBirthday() {
    return this.employees.pipe(
      map((employees): Employee[] =>
        employees.filter((employee) => employee.hasUpcomingBirthday === true)
      )
    );
  }

  filterByOverdueInteractions() {
    return this.employees.pipe(
      map((employees): Employee[] =>
        employees.filter((employee) => employee.hasRecentInteraction === false)
      )
    );
  }

  filterByUpcomingAnniversaries() {
    return this.employees.pipe(
      map((employees): Employee[] =>
        employees.filter(
          (employee) => employee.hasUpcomingWorkAnniversary === true
        )
      )
    );
  }

  deleteEmployeeById(employeeId: string) {
    if (confirm('Are you sure you want to remove this employee?')) {
      this.http
        .delete(`${environment.firebaseApiUrl}/employees/${employeeId}`)
        .subscribe((employeeId) => {
          this.employees.next(
            this.employees
              .getValue()
              .filter((employee) => employee.employeeId !== employeeId)
          );
        });
    }
  }
}
