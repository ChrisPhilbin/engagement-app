import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MeetingService } from 'src/app/services/meeting.service';
import { environment } from 'src/environments/environment';
import { AgreedUponAction, Meeting } from 'src/models/meeting-model';

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
    let meetingAgreedUponActions = new FormArray([]);

    if (this.editMode && Object.keys(this.meeting)) {
      notes = this.meeting.notes;
      meetingDate = this.meeting.meetingDate
        ? new Date(this.meeting.meetingDate)
        : '';
      if (this.meeting.agreedUponActions) {
        for (let action of this.meeting.agreedUponActions) {
          meetingAgreedUponActions.push(
            new FormGroup({
              notes: new FormControl(action.notes, Validators.required),
              isComplete: new FormControl(
                action.isComplete,
                Validators.required
              ),
            })
          );
        }
      }
    }

    this.meetingForm = new FormGroup({
      notes: new FormControl(notes, Validators.required),
      meetingDate: new FormControl(meetingDate, Validators.required),
      agreedUponActions: meetingAgreedUponActions,
    });
  }

  onSubmit() {
    const newMeeting = {
      meetingDate: this.meetingForm.value['meetingDate'],
      notes: this.meetingForm.value['notes'],
      agreedUponActions: this.meetingForm.value['agreedUponActions'].map(
        (actionObj: AgreedUponAction) => {
          return actionObj;
        }
      ),
      hasOutstandingActionItems: false,
    };

    newMeeting.hasOutstandingActionItems =
      this.checkMeetingForOutstandingActions(newMeeting.agreedUponActions);

    if (this.editMode) {
      this.meetingService.updateExistingMeeting(
        this.employeeId,
        this.meetingId,
        newMeeting
      );
    } else {
      this.meetingService.createNewMeeting(this.employeeId, newMeeting);
    }
    this.router.navigate(['/employees', this.employeeId]);
  }

  addAgreedUponAction() {
    console.log('Adding new agreed upon action');
    (<FormArray>this.meetingForm.get('agreedUponActions')).push(
      new FormGroup({
        notes: new FormControl(null, Validators.required),
        isComplete: new FormControl(false, Validators.required),
      })
    );
  }

  deleteAgreedUponAction(index: number): void {
    if (confirm('Are you sure you want to delete this agreed upon action?')) {
      (<FormArray>this.meetingForm.get('agreedUponActions')).removeAt(index);
    }
  }

  get agreedUponActionControls() {
    return (<FormArray>this.meetingForm.get('agreedUponActions')).controls;
  }

  get agreedUponActionValues() {
    return this.meetingForm.get('agreedUponActions')!.value;
  }

  confirmCancel() {
    if (
      confirm('Are you sure you want to cancel? Changes will not be saved.')
    ) {
      this.router.navigate(['/employees', this.employeeId]);
    }
    return;
  }

  checkMeetingForOutstandingActions(
    agreedUponActions: AgreedUponAction[]
  ): boolean {
    let hasOutstanding = false;
    agreedUponActions.forEach((actionObj) => {
      if (!actionObj.isComplete) {
        hasOutstanding = true;
      }
    });

    return hasOutstanding;
  }
}
