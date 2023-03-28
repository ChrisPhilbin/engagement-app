import { IMeeting } from "./meeting-model";
import { INews } from "./news-model";
import { IRelationship } from "./relationship-model";

export interface IEmployee {
  id?: string;
  userId?: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedInUrl: string;
  facebookUrl: string;
  profilePictureUrl: string;
  createdAt: string;
  hireDate: Date;
  birthDate: Date;
  hasUpcomingBirthday?: boolean;
  hasUpcomingWorkAnniversary?: boolean;
  hasRecentInteraction?: boolean;
  lastInteraction: Date;
  interests: string[];
  sportsTeams: string[];
  pets: string[];
  relations: IRelationship[];
  newsFeed?: INews[] | null;
  sportsNews?: INews[] | null;
  meetings?: IMeeting[];
}
