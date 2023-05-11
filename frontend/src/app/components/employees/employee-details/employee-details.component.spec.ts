import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthService } from 'src/app/services/auth.service';

import { EmployeeDetailsComponent } from './employee-details.component';
import { Employee } from 'src/models/employee-model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Subject } from 'rxjs';
import { PageTitleService } from 'src/app/services/page-title.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppModule } from 'src/app/app.module';

const authServiceStub = {
  testLogin: () => {},
  signup: () => {},
  user: {
    subscribe: () => {},
    pipe: () => {},
  },
};

const employeeServiceStub = {
  employee: new Subject(),
  getSingleEmployeeDetails: () => {},
};

const titleServiceStub = {
  setPageTitle: () => {},
};

describe('EmployeeDetailsComponent', () => {
  let component: EmployeeDetailsComponent;
  let authService: AuthService;
  let employeeService: EmployeeService;
  let titleService: PageTitleService;
  let fixture: ComponentFixture<EmployeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeDetailsComponent],
      imports: [HttpClientModule, AppRoutingModule, FormsModule, AppModule],
      providers: [
        EmployeeDetailsComponent,
        { provide: AuthService, useValue: authServiceStub },
        { provide: EmployeeService, useValue: employeeServiceStub },
        { provide: PageTitleService, useValue: titleServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    employeeService = TestBed.inject(EmployeeService);
    titleService = TestBed.inject(PageTitleService);
  });

  it('Employee Details Component should be successfully created/mounted', () => {
    expect(component).toBeTruthy();
  });

  //   it('Should have a dynamically set page title upon componnent load', async () => {
  //     const testEmployee = <Employee>{
  //       firstName: 'Sam',
  //       lastName: 'Smith',
  //     };
  //     expect(component.employee).toBeUndefined();
  //     expect(fixture.debugElement.componentInstance.title).toBeUndefined();
  //     component.ngOnInit();
  //     employeeService.employee.next(testEmployee);
  //     component.ngOnInit();
  //     fixture.detectChanges();
  //     await fixture.whenStable().then(() => {
  //       expect(fixture.nativeElement.title).toContain('Sam Smith');
  //     });
  //   });
});
