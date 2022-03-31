import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/models/employee-model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  //@ts-ignore
  employeeForm: FormGroup;
  //@ts-ignore
  employeeId: number;
  editMode: boolean = false;

  //@ts-ignore
  hireDate: Date;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
      hireDate: new FormControl(hireDate),
      birthDate: new FormControl(birthDate),
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

    const newEmployee: Employee = {
      firstName: this.employeeForm.value['firstName'] as string,
      lastName: this.employeeForm.value['lastName'] as string,
      email: this.employeeForm.value['email'] as string,
      hireDate: this.employeeForm.value['hireDate'],
      birthDate: this.employeeForm.value['birthDate'] as string,
      lastInteraction: this.employeeForm.value['lastInteraction'] as string,
      interests: this.employeeForm.value['interests'] as string[],
    };

    console.log(newEmployee, 'new employee...');

    this.employeeService.createNewEmployee(newEmployee);

    // if (this.editMode) {
    //   //invoke method from within employeeService to update employee record/update app state
    //   //need access to employeeId in order to update single employee record
    // } else {
    //   //invoke method to create a new employee and update the app state

    //   //@ts-ignore
    //   this.employeeService.createNewEmployee(newEmployee);
    // }
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

  get controls() {
    return (<FormArray>this.employeeForm.get('interests')).controls;
  }
}
