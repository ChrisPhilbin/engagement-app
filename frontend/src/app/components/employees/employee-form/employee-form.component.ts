import { Component, OnInit, QueryList } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  Employee,
  EmployeeInterest,
  EmployeeRelation,
  IPet,
} from 'src/models/employee-model';
import { relations } from 'src/models/relationship-model';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee;
  //@ts-ignore
  employeeForm: FormGroup;
  //@ts-ignore
  employeeId: string;
  editMode: boolean = false;
  initialValues = null;
  hasUploadedProfilePicture = false;
  uploadedPictureUrl = '';

  //@ts-ignore
  hireDate: Date;

  relations = relations;
  isLoading = false;
  urlRegEx =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.relations = this.relations.sort();
    this.route.params.subscribe((params: Params) => {
      this.employeeId = params['employeeId'];
      this.editMode = params['employeeId'] != null;
      document.title = 'Engage - Create a new employee record';
      if (this.editMode) {
        this.isLoading = true;
        this.employeeService.getSingleEmployeeDetails(this.employeeId);
        this.employeeService.employee.subscribe((employee: Employee): void => {
          this.employee = employee;
          document.title = `Engage - Editing details for ${this.employee.firstName} + ' ' + ${this.employee.lastName}`;
          this.initForm();
          this.initialValues = this.employeeForm.value;
          this.isLoading = false;
        });
      }
    });
  }

  private initForm() {
    let firstName = '';
    let lastName = '';
    let email = '';
    let profilePictureUrl = '';
    let profilePictureFile: File | null = null;
    let linkedInUrl = '';
    let facebookUrl = '';
    let hireDate;
    let birthDate;
    let lastInteraction;
    let employeeInterests = new FormArray([]);
    let employeeRelations = new FormArray([]);
    let employeeFavoriteSportsTeams = new FormArray([]);
    let employeePets = new FormArray([]);

    if (this.editMode && Object.keys(this.employee)) {
      firstName = this.employee.firstName;
      lastName = this.employee.lastName;
      email = this.employee.email;
      profilePictureUrl = this.employee.profilePictureUrl;
      linkedInUrl = this.employee.linkedInUrl;
      facebookUrl = this.employee.facebookUrl;
      hireDate = this.employee.hireDate
        ? new Date(this.employee.hireDate).toISOString().split('T')[0]
        : '';
      birthDate = this.employee.birthDate
        ? new Date(this.employee.birthDate).toISOString().split('T')[0]
        : '';
      lastInteraction = this.employee.lastInteraction
        ? new Date(this.employee.lastInteraction).toISOString().split('T')[0]
        : '';
      if (this.employee.interests) {
        for (let interest of this.employee.interests) {
          employeeInterests.push(
            new FormGroup({
              name: new FormControl(interest, Validators.required),
            })
          );
        }
      }
      if (this.employee.relations) {
        for (let relation of this.employee.relations) {
          employeeRelations.push(
            new FormGroup({
              name: new FormControl(relation.name, Validators.required),
              type: new FormControl(relation.type, Validators.required),
            })
          );
        }
      }
      if (this.employee.sportsTeams) {
        for (let team of this.employee.sportsTeams) {
          employeeFavoriteSportsTeams.push(
            new FormGroup({
              teamName: new FormControl(team, Validators.required),
            })
          );
        }
      }
      if (this.employee.pets) {
        for (let pet of this.employee.pets) {
          employeePets.push(
            new FormGroup({
              name: new FormControl(pet.name, Validators.required),
              type: new FormControl(pet.type, Validators.required),
            })
          );
        }
      }
    }

    this.employeeForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      email: new FormControl(email, [Validators.required, Validators.email]),
      profilePictureUrl: new FormControl(profilePictureUrl, [
        Validators.pattern(this.urlRegEx),
      ]),
      profilePictureFile: new FormControl(profilePictureFile),
      linkedInUrl: new FormControl(linkedInUrl, [
        Validators.pattern(this.urlRegEx),
      ]),
      facebookUrl: new FormControl(facebookUrl, [
        Validators.pattern(this.urlRegEx),
      ]),
      hireDate: new FormControl(hireDate),
      birthDate: new FormControl(birthDate),
      lastInteraction: new FormControl(lastInteraction),
      interests: employeeInterests,
      relations: employeeRelations,
      sportsTeams: employeeFavoriteSportsTeams,
      pets: employeePets,
    });
  }

  onSubmit() {
    const newEmployee = {
      firstName: this.employeeForm.value['firstName'],
      lastName: this.employeeForm.value['lastName'],
      email: this.employeeForm.value['email'],
      profilePictureUrl: this.employeeForm.value['profilePictureUrl'],
      linkedInUrl: this.employeeForm.value['linkedInUrl'],
      facebookUrl: this.employeeForm.value['facebookUrl'],
      hireDate: new Date(this.employeeForm.value['hireDate']),
      birthDate: new Date(this.employeeForm.value['birthDate']),
      lastInteraction: new Date(this.employeeForm.value['lastInteraction']),
      interests: this.employeeForm.value['interests'].map(
        (intObj: EmployeeInterest) => {
          return intObj.name;
        }
      ),
      relations: this.employeeForm.value['relations'].map(
        (relObj: EmployeeRelation) => {
          return { name: relObj.name, type: relObj.type };
        }
      ),
      sportsTeams: this.employeeForm.value['sportsTeams'].map(
        (teamObj: any) => {
          return teamObj.teamName;
        }
      ),
      pets: this.employeeForm.value['pets'].map((pet: IPet) => {
        return pet;
      }),
    };

    if (this.editMode) {
      //@ts-ignore
      this.employeeService.updateExistingEmployee(newEmployee, this.employeeId);
      this.router.navigate(['/employees', this.employeeId], {
        queryParams: { edit: 'success' },
      });
    } else {
      //@ts-ignore
      this.employeeService.createNewEmployee(newEmployee);
      this.router.navigate(['/dashboard']);
    }
  }

  onAddInterest(): void {
    (<FormArray>this.employeeForm.get('interests')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
      })
    );
  }

  onDeleteInterest(index: number): void {
    (<FormArray>this.employeeForm.get('interests')).removeAt(index);
  }

  get interestControls() {
    return (<FormArray>this.employeeForm.get('interests')).controls;
  }

  onAddRelation(): void {
    (<FormArray>this.employeeForm.get('relations')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        type: new FormControl(null, Validators.required),
      })
    );
  }

  onDeleteRelation(index: number): void {
    (<FormArray>this.employeeForm.get('relations')).removeAt(index);
  }

  get relationControls() {
    return (<FormArray>this.employeeForm.get('relations')).controls;
  }

  onDeleteSportsTeam(index: number): void {
    (<FormArray>this.employeeForm.get('sportsTeams')).removeAt(index);
  }

  onAddSportsTeam(): void {
    (<FormArray>this.employeeForm.get('sportsTeams')).push(
      new FormGroup({
        teamName: new FormControl(null, Validators.required),
      })
    );
  }

  get sportsTeamControls() {
    return (<FormArray>this.employeeForm.get('sportsTeams')).controls;
  }

  onDeletePet(index: number): void {
    (<FormArray>this.employeeForm.get('pets')).removeAt(index);
  }

  onAddPet(): void {
    (<FormArray>this.employeeForm.get('pets')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        type: new FormControl(null, Validators.required),
      })
    );
  }

  get petControls() {
    return (<FormArray>this.employeeForm.get('pets')).controls;
  }

  cancelEntry() {
    if (confirm('Are you sure? All changes will be lost.')) {
      this.employeeForm.reset();
      if (this.editMode) {
        this.router.navigate(['/employees', this.employee.employeeId]);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  resetFormToInitialValues() {
    if (confirm('Are you sure you want to revert all form fields?')) {
      this.employeeForm.reset(this.initialValues);
    }
  }

  uploadProfilePicture($event: Event) {
    const profilePictureUuid = uuid();
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    this.employeeService
      .uploadEmployeeProfilePicture(file, profilePictureUuid)
      .subscribe((incomingProfilePictureUrl) => {
        this.hasUploadedProfilePicture = true;
        this.uploadedPictureUrl = incomingProfilePictureUrl.profilePictureUrl;
        this.employeeForm.patchValue({
          profilePictureUrl: this.uploadedPictureUrl,
        });
      });
  }

  get f() {
    return this.employeeForm.controls;
  }
}
