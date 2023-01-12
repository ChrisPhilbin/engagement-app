import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { Employee } from 'src/models/employee-model';
import { Meeting } from 'src/models/meeting-model';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css'],
})
export class MeetingDetailsComponent implements OnInit {
  employeeId: string = '';
  meetingId: string = '';
  //@ts-ignore
  meeting: Meeting;
  employeeRecord: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    public sanitizer: DomSanitizer,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.employeeId = params['employeeId'];
      this.meetingId = params['meetingId'];
      this.meetingService.getSingleEmployeeMeeting(
        this.employeeId,
        this.meetingId
      );
      this.meetingService.meeting.subscribe((meeting: Meeting) => {
        this.meeting = meeting;
      });
      this.employeeService.employees.subscribe((employees) => {
        this.employeeRecord = employees.find((employee) => {
          return employee.employeeId === this.employeeId;
        });
      });
    });
  }

  deleteMeeting(meetingId: string) {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.meetingService.deleteMeeting(this.employeeId, meetingId);
      this.router.navigate(['/employees', this.employeeId]);
    }
  }
}
