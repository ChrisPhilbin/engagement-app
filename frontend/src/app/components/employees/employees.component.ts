import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environments/environment';
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
  searchTerm: string = '';
  filterByBirthday: boolean = false;
  filterByOverdueInteractions: boolean = false;
  filterByUpcomingAnniversaries: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    document.title = `${environment.appName} Viewing all employees`;
    this.employeeService.getAllEmployees();
    this.employeeService.employees.subscribe((employees) => {
      this.employees = employees;
      this.isLoading = false;
    });
  }

  editEmployee(employeeId: string) {
    this.router.navigate(['/employees', employeeId, 'edit']);
  }

  onFilterChange(name: string) {
    this.employeeService.filterByName(name).subscribe((employees) => {
      this.employees = employees;
    });
  }

  onFilterByBirthday(): void {
    if (this.filterByBirthday) {
      this.employeeService.filterByUpComingBirthday().subscribe((employees) => {
        this.employees = employees;
      });
    } else {
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
      });
    }
  }

  onFilterByOverdueInteractions() {
    if (this.filterByOverdueInteractions) {
      this.employeeService
        .filterByOverdueInteractions()
        .subscribe((employees) => {
          this.employees = employees;
        });
    } else {
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
      });
    }
  }

  onFilterByUpcomingAnniversaries() {
    if (this.filterByUpcomingAnniversaries) {
      this.employeeService
        .filterByUpcomingAnniversaries()
        .subscribe((employees) => {
          this.employees = employees;
        });
    } else {
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
      });
    }
  }
}
