import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Employee } from 'src/models/employee-model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [MessageService],
})
export class EmployeesComponent implements OnInit {
  isLoading = false;
  employees: Employee[] = [];
  searchTerm: string = '';
  filterByBirthday: boolean = false;
  filterByOverdueInteractions: boolean = false;
  filterByUpcomingAnniversaries: boolean = false;

  constructor(
    public employeeService: EmployeeService,
    private messageService: MessageService,
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
        this.showFilterMessage('Filtering by upcoming birthdays!');
      });
    } else {
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
        this.clearFilterMessages();
      });
    }
  }

  onFilterByOverdueInteractions() {
    if (this.filterByOverdueInteractions) {
      this.employeeService
        .filterByOverdueInteractions()
        .subscribe((employees) => {
          this.employees = employees;
          this.showFilterMessage('Filtering by overdue interactions!');
        });
    } else {
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
        this.clearFilterMessages();
      });
    }
  }

  onFilterByUpcomingAnniversaries() {
    if (this.filterByUpcomingAnniversaries) {
      this.employeeService
        .filterByUpcomingAnniversaries()
        .subscribe((employees) => {
          this.employees = employees;
          this.showFilterMessage('Filtering by upcoming work anniversaries!');
        });
    } else {
      this.employeeService.employees.subscribe((employees) => {
        this.employees = employees;
        this.clearFilterMessages();
      });
    }
  }

  showFilterMessage(filterMessageDetails: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Filter Applied',
      detail: filterMessageDetails,
    });
  }

  clearFilterMessages() {
    this.messageService.clear();
    this.showFilterMessage('Displaying all employees without filters applied!');
  }

  removeEmployee(employeeId: string) {
    if (confirm('Are you sure you want to remove this employee?')) {
      this.employeeService.deleteEmployeeById(employeeId);
    }
  }
}
