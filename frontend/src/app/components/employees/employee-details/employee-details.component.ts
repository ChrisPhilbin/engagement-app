import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/models/employee-model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  providers: [MessageService],
})
export class EmployeeDetailsComponent implements OnInit {
  //@ts-ignore
  employee: Employee;
  meetingId: string = '';
  isLoading = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.meetingId = params['employeeId'];
      this.isLoading = true;
      this.employeeService.getSingleEmployeeDetails(this.meetingId);
      this.employeeService.employee.subscribe((employee: Employee) => {
        this.employee = employee;
        this.isLoading = false;
        document.title = `Engage - Viewing details for ${
          this.employee.firstName + ' ' + this.employee.lastName
        }`;
      });
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['edit'] === 'success') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Employee details have been successfully updated!',
        });
      }
    });
  }
}
