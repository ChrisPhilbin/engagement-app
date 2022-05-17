import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/models/employee-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  isAuthenticated = false;
  employees: Employee[] = [];

  constructor() {}

  ngOnInit(): void {}
}
