import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/models/employee-model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  isLoading = false;
  isAuthenticated = false;
  employees: Employee[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    if (this.authService.getTokenFromLocalStorage()) {
      this.isAuthenticated = true;
      this.isLoading = true;
      this.employeeService.getAllEmployees();
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
        this.isLoading = false;
      });
    }
    // this.authService.user.subscribe((user) => {
    //   this.isAuthenticated = !user ? false : true;
    //   if (this.isAuthenticated) {
    //     this.isLoading = true;
    //     this.employeeService.getAllEmployees();
    //     this.employeeService.employees.subscribe((employees) => {
    //       this.employees = employees;
    //       this.isLoading = false;
    //       console.log(this.employees);
    //     });
    //   }
    // });
  }
}
