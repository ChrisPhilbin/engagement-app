import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/models/employee-model';
import { Meeting } from 'src/models/meeting-model';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
})
export class EmployeeCardComponent implements OnInit {
  constructor(public employeeService: EmployeeService) {}

  @Input() employee: Employee;

  ngOnInit(): void {}

  employeeHasOutstandingActionItems(meetings: Meeting[]) {
    return meetings.some(
      (meeting) => meeting.hasOutstandingActionItems === true
    );
  }
}
