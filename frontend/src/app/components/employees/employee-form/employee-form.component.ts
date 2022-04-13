import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee, EmployeeInterest } from 'src/models/employee-model';

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

  //@ts-ignore
  hireDate: Date;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params: Params) => {
      this.employeeId = params['employeeId'];
      this.editMode = params['employeeId'] != null;
      this.employeeService.getSingleEmployeeDetails(this.employeeId);
      this.employeeService.employee.subscribe((employee: Employee): void => {
        this.employee = employee;
        this.initForm();
        document.title = `Editing ${this.employee.firstName} ${this.employee.lastName}'s information`;
      });
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

    if (this.editMode && Object.keys(this.employee)) {
      firstName = this.employee.firstName;
      lastName = this.employee.lastName;
      email = this.employee.email;
      hireDate = this.employee.hireDate ? new Date(this.employee.hireDate) : '';
      birthDate = this.employee.birthDate ? new Date(this.employee.birthDate) : '';
      lastInteraction = this.employee.lastInteraction ? new Date(this.employee.lastInteraction) : '';
      if (this.employee.interests) {
        for (let interest of this.employee.interests) {
          employeeInterests.push(
            new FormGroup({
              name: new FormControl(interest, Validators.required),
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
    };

    console.log(newEmployee, 'new employee...');

    if (this.editMode) {
      //@ts-ignore
      this.employeeService.updateExistingEmployee(newEmployee, this.employeeId);
    } else {
      //@ts-ignore
      this.employeeService.createNewEmployee(newEmployee);
      console.log(newEmployee, "new employee...")
    }
    this.router.navigate(['/dashboard']);
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
