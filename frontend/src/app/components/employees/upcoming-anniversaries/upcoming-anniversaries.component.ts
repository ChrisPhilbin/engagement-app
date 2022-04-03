import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeAnniversary } from 'src/models/employee-model';

@Component({
  selector: 'app-upcoming-anniversaries',
  templateUrl: './upcoming-anniversaries.component.html',
  styleUrls: ['./upcoming-anniversaries.component.css'],
})
export class UpcomingAnniversariesComponent implements OnInit {
  anniversaries: EmployeeAnniversary[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.employeeService.getUpcomingAnniversaries();
    this.employeeService.employeeAnniversaries.subscribe(
      (anniversaries: EmployeeAnniversary[]) => {
        this.anniversaries = anniversaries;
        this.isLoading = false;
      }
    );
  }
}
