import { Component, OnInit, QueryList } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  Employee,
  EmployeeInterest,
  EmployeeRelation,
} from 'src/models/employee-model';
import { relations } from 'src/models/relationship-model';

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

  //@ts-ignore
  hireDate: Date;

  relations = relations;
  isLoading = false;

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
    let hireDate;
    let birthDate;
    let lastInteraction;
    let employeeInterests = new FormArray([]);
    let employeeRelations = new FormArray([]);

    if (this.editMode && Object.keys(this.employee)) {
      firstName = this.employee.firstName;
      lastName = this.employee.lastName;
      email = this.employee.email;
      hireDate = this.employee.hireDate ? new Date(this.employee.hireDate) : '';
      birthDate = this.employee.birthDate
        ? new Date(this.employee.birthDate)
        : '';
      lastInteraction = this.employee.lastInteraction
        ? new Date(this.employee.lastInteraction)
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
    }

    this.employeeForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      email: new FormControl(email, [Validators.required, Validators.email]),
      hireDate: new FormControl(hireDate),
      birthDate: new FormControl(birthDate),
      lastInteraction: new FormControl(lastInteraction),
      interests: employeeInterests,
      relations: employeeRelations,
    });
  }

  onSubmit() {
    const newEmployee = {
      firstName: this.employeeForm.value['firstName'],
      lastName: this.employeeForm.value['lastName'],
      email: this.employeeForm.value['email'],
      hireDate: this.employeeForm.value['hireDate'],
      birthDate: this.employeeForm.value['birthDate'],
      lastInteraction: this.employeeForm.value['lastInteraction'],
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

  cancelEntry() {
    if (confirm('Are you sure? All changes will be lost.')) {
      this.employeeForm.reset();
      this.router.navigate(['/dashboard']);
    }
  }

  resetFormToInitialValues() {
    if (confirm('Are you sure you want to revert all form fields?')) {
      this.employeeForm.reset(this.initialValues);
    }
  }

  get f() {
    return this.employeeForm.controls;
  }
}
