import { INews } from "./news-model";

export interface IEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedInUrl: string;
  facebookUrl: string;
  profilePictureUrl: string;
  createdAt: string;
  hireDate: string;
  birthDate: string;
  hasUpcomingBirthday: boolean;
  hasUpcomingWorkAnniversary: boolean;
  hasRecentInteraction: boolean;
  lastInteraction: string;
  interests: string[];
  sportsTeams: string[];
  pets: string[];
  relations: string[];
  newsFeed?: INews[] | null;
  sportsNews?: INews[] | null;
}
