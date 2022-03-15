import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/models/employee-model';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  //@ts-ignore
  employee: Employee;
  meetingId: string = '';
  isLoading = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.meetingId = params['id'];
      this.isLoading = true;
      this.employeeService.getSingleEmployeeDetails(this.meetingId);
      this.employeeService.employee.subscribe((employee: Employee) => {
        this.employee = employee;
      });
    });
  }
}
