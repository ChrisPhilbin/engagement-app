import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private employeeService: EmployeeService,
    private router: Router
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
  }

  editEmployee(employeeId: string) {
    console.log(employeeId);
    this.router.navigate(['/employees', employeeId, 'edit']);
  }
}
