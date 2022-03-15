import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Meeting } from 'src/models/meeting-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  meeting = new Subject<Meeting>();
  meetings = new Subject<Meeting[]>();

  constructor(private http: HttpClient) {}

  getSingleEmployeeMeeting(employeeId: string, meetingId: string) {
    this.http
      .get<Meeting>(
        `${environment.firebaseApiUrl}/employees/${employeeId}/meetings/${meetingId}`
      )
      .subscribe((meeting: Meeting) => {
        this.meeting.next(meeting);
      });
  }

  getEmployeeMeetings(employeeId: string) {
    this.http
      .get<Meeting[]>(
        `${environment.firebaseApiUrl}/employees/${employeeId}/meetings`
      )
      .subscribe((meetings: Meeting[]) => {
        this.meetings.next(meetings);
      });
  }
}
