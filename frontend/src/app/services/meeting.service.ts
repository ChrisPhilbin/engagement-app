import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Subject } from 'rxjs';
import { Meeting } from 'src/models/meeting-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  meeting = new Subject<Meeting>();
  meetings = new BehaviorSubject<Meeting[]>([]);

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

  createNewMeeting(employeeId: string, newMeeting: Meeting) {
    this.http
      .post<Meeting>(
        `${environment.firebaseApiUrl}/employees/${employeeId}/meetings`,
        newMeeting
      )
      .subscribe((meeting: Meeting) => {
        this.meetings.next(this.meetings.getValue().concat(meeting));
      });
  }

  updateExistingMeeting(
    employeeId: string,
    meetingId: string,
    meeting: Meeting
  ) {
    this.http
      .put<Meeting>(
        `${environment.firebaseApiUrl}/employees/${employeeId}/meetings/${meetingId}`,
        meeting
      )
      .subscribe((meeting: Meeting) => {
        //find existing meeting that has the same ID as the meeting coming back from the API call and replace it.
        this.meetings.next(
          this.meetings
            .getValue()
            .filter((m) => m.meetingId !== meeting.meetingId)
        );
        this.meetings.next(this.meetings.getValue().concat(meeting));
      });
  }
}
