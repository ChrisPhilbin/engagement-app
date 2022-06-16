import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MeetingService } from 'src/app/services/meeting.service';
import { environment } from 'src/environments/environment';
import { Meeting } from 'src/models/meeting-model';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.css'],
})
export class MeetingFormComponent implements OnInit {
  meeting: Meeting;
  meetingForm: FormGroup;
  meetingId: string;
  employeeId: string;
  editMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params: Params) => {
      this.employeeId = params['employeeId'];
      this.meetingId = params['meetingId'];
      this.editMode =
        params['employeeId'] != null && params['meetingId'] != null;
      document.title = `${environment.appName} Create a new meeting`;

      if (this.editMode) {
        this.isLoading = true;
        this.meetingService.getSingleEmployeeMeeting(
          this.employeeId,
          this.meetingId
        );
        this.meetingService.meeting.subscribe((meeting: Meeting) => {
          this.meeting = meeting;
          document.title = `${environment.appName} Editing meeting`;
          this.initForm();
          this.isLoading = false;
        });
      }
    });
  }

  config: AngularEditorConfig = {
    sanitize: false,
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  initForm() {
    let notes = '';
    let meetingDate;

    if (this.editMode && Object.keys(this.meeting)) {
      notes = this.meeting.notes;
      meetingDate = this.meeting.meetingDate
        ? new Date(this.meeting.meetingDate)
        : '';
    }

    this.meetingForm = new FormGroup({
      notes: new FormControl(notes, Validators.required),
      meetingDate: new FormControl(meetingDate, Validators.required),
    });
  }

  onSubmit() {
    const newMeeting = {
      meetingDate: this.meetingForm.value['meetingDate'],
      notes: this.meetingForm.value['notes'],
    };

    if (this.editMode) {
      this.meetingService.updateExistingMeeting(
        this.employeeId,
        this.meetingId,
        //@ts-ignore
        newMeeting
      );
    } else {
      //@ts-ignore
      this.meetingService.createNewMeeting(this.employeeId, newMeeting);
    }
    this.router.navigate(['/employees', this.employeeId]);
  }

  confirmCancel() {
    if (
      confirm('Are you sure you want to cancel? Changes will not be changed.')
    ) {
      this.router.navigate(['/employees', this.employeeId]);
    }
    return;
  }
}
