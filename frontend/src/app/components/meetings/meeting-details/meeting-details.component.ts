import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MeetingService } from 'src/app/services/meeting.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService
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
        console.log(this.meeting, 'meeting');
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
