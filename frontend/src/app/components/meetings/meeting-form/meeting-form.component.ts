import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MeetingService } from 'src/app/services/meeting.service';
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

      //if editMode is true - get existing meeting details from backend
      //if editMode is false - simply load a blank form
      // this.employeeService.getSingleEmployeeDetails(this.employeeId);
      // this.employeeService.employee.subscribe((employee: Employee): void => {
      //   this.employee = employee;
      //   this.initForm();
      //   document.title = `Editing ${this.employee.firstName} ${this.employee.lastName}'s information`;
      // });
    });
  }

  config: AngularEditorConfig = {
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
    let meetingDate = new Date();
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
      //@ts-ignore
      // this.employeeService.updateExistingEmployee(newEmployee, this.employeeId);
    } else {
      //@ts-ignore
      this.meetingService.createNewMeeting(this.employeeId, newMeeting);
    }
    this.router.navigate(['/dashboard']);
  }
}
