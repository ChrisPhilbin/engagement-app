import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeBirthday } from 'src/models/employee-model';

@Component({
  selector: 'app-upcoming-birthdays',
  templateUrl: './upcoming-birthdays.component.html',
  styleUrls: ['./upcoming-birthdays.component.css'],
})
export class UpcomingBirthdaysComponent implements OnInit {
  birthdays: EmployeeBirthday[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.employeeService.getUpcomingBirthdays();
    this.employeeService.employeeBirthdays.subscribe(
      (birthdays: EmployeeBirthday[]) => {
        this.birthdays = birthdays;
        console.log(this.birthdays);
        this.isLoading = false;
      }
    );
  }
}
