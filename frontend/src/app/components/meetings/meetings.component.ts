import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/services/meeting.service';
import { Meeting } from 'src/models/meeting-model';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css'],
})
export class MeetingsComponent implements OnInit, OnChanges {
  @Input() employeeId: string = '';
  meetings: Meeting[] = [];

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    console.log(this.employeeId, 'EE id');
    this.meetingService.getEmployeeMeetings(this.employeeId);
    this.meetingService.meetings.subscribe((meetings: Meeting[]) => {
      this.meetings = meetings;
      console.log(this.meetings);
    });
  }
}
