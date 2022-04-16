import { NewsFeedItem } from './newsfeed-model';

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
  userId?: string;
  employeeId: string;
  hasUpcomingBirthday: boolean;
  hasUpcomingWorkAnniversary: boolean;
  hasRecentInteraction?: boolean;
  newsFeed: NewsFeedItem[];
}

export interface EmployeeInterest {
  name: string;
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

export interface EmployeeInteraction {
  employeeId: string;
  firstName: string;
  lastName: string;
  lastInteraction: string;
}
