export interface Employee {
  birthdate: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  interests: string[];
  lastInteraction: string;
  sportsTeams: string[];
  userId: string;
}

export interface EmployeeBirthday {
  employeeId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface EmployeeAnniversary {
  employeeId: string;
  firstName: string;
  lastName: string;
  hiredate: string;
}