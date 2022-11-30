import { NewsFeedItem } from './newsfeed-model';
import { Meeting } from './meeting-model';

export interface Employee {
  birthDate: string;
  createdAt: string;
  hireDate: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  linkedInUrl: string;
  facebookUrl: string;
  interests: string[];
  lastInteraction: string;
  sportsTeams: string[];
  relations: [{ type: string; name: string }];
  userId?: string;
  employeeId: string;
  hasUpcomingBirthday: boolean;
  hasUpcomingWorkAnniversary: boolean;
  hasRecentInteraction?: boolean;
  newsFeed: NewsFeedItem[];
  meetings: Meeting[];
}

export interface EmployeeInterest {
  name: string;
}

export interface EmployeeRelation {
  name: string;
  type: string;
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
