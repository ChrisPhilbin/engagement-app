import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/models/employee-model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PageTitleService } from 'src/app/services/page-title.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  providers: [MessageService],
})
export class EmployeeDetailsComponent implements OnInit, OnChanges {
  //@ts-ignore
  employee: Employee;
  meetingId: string = '';
  isLoading = false;

  constructor(
    public employeeService: EmployeeService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private titleService: PageTitleService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.titleService.setPageTitle(
      `Viewing details for ${this.employee.firstName} ${this.employee.lastName}`
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.meetingId = params['employeeId'];
      this.isLoading = true;
      this.employeeService.getSingleEmployeeDetails(this.meetingId);
      this.employeeService.employee.subscribe((employee: Employee) => {
        this.employee = employee;
        this.isLoading = false;
        document.title =
          'Viewing details for ${this.employee.firstName} ${this.employee.lastName}';
        // this.titleService.setPageTitle(
        //   `Viewing details for ${this.employee.firstName} ${this.employee.lastName}`
        // );
      });
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['edit'] === 'success') {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Employee details have been successfully updated!',
          });
        }, 500);
      }
    });
  }
}
