import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/models/employee-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // fetchedPosts = new Subject<Post[]>();
  employees = new Subject<Employee[]>();
  employee = new Subject<Employee>();

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
}
