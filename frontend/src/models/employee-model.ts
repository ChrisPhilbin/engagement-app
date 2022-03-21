export interface Employee {
  birthDate: string;
  createdAt: string;
  hireDate: string;
  email: string;
  firstName: string;
  lastName: string;
  interests: string[];
  lastInteraction: string;
  sportsTeams: string[];
  userId: string;
  employeeId: string;
  hasUpcomingBirthday: boolean;
  hasUpcomingWorkAnniversary: boolean;
  hasRecentInteraction: boolean;
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
