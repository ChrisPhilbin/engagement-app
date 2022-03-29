import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Employee } from 'src/models/employee-model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: number;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.employeeId = +params['employeeId'];
      this.editMode = params['employeeId'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let firstName = '';
    let lastName = '';
    let email = '';
    let hireDate = '';
    let birthDate = '';
    let lastInteraction = '';
    let employeeInterests = new FormArray([]);

    //future: if this.editMode... setup logic to take existing employee data and populate the form with the data

    this.employeeForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      email: new FormControl(email, [Validators.required, Validators.email]),
      hireDate: new FormControl(hireDate, Validators.required),
      birthDate: new FormControl(birthDate, Validators.required),
      lastInteraction: new FormControl(lastInteraction),
      interests: employeeInterests,
    });
  }

  onSubmit() {
    // birthDate: string;
    // createdAt: string;
    // hireDate: string;
    // email: string;
    // firstName: string;
    // lastName: string;
    // interests: string[];
    // lastInteraction: string;
    // sportsTeams: string[];
    // userId: string;
    // employeeId: string;
    // hasUpcomingBirthday: boolean;
    // hasUpcomingWorkAnniversary: boolean;
    // hasRecentInteraction: boolean;

    const newEmployee = {
      firstName: this.employeeForm.value['firstName'],
      lastName: this.employeeForm.value['lastName'],
      email: this.employeeForm.value['email'],
      hireDate: this.employeeForm.value['hireDate'],
      birthDate: this.employeeForm.value['birthDate'],
      lastInteraction: this.employeeForm.value['lastInteraction'],
      interests: this.employeeForm.value['employeeInterests'],
    };

    if (this.editMode) {
      //invoke method from within employeeService to update employee record/update app state
    } else {
      //invoke method to create a new employee and update the app state
    }
  }

  onAddInterest() {
    (<FormArray>this.employeeForm.get('interests')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
      })
    );
  }
}
