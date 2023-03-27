import { IEmployee } from "../api/models/employee-model";
import { ISetting } from "../api/models/setting-model";
import { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } from "./dateChecker";
import { getInterestUpdates } from "./getNews";
import { getAppSettingsFromHeader } from "./headerHelper";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const setupEmployeeObject = (employeeDocument: QueryDocumentSnapshot, configHeaders: ISetting): IEmployee => {
  const { birthdatethreshold, lastinteractionthreshold, workanniversarythreshold } =
    getAppSettingsFromHeader(configHeaders);

  const employeeObject: IEmployee = {
    employeeId: employeeDocument.id,
    firstName: employeeDocument.data().firstName,
    lastName: employeeDocument.data().lastName,
    email: employeeDocument.data().email,
    linkedInUrl: employeeDocument.data().linkedInUrl,
    facebookUrl: employeeDocument.data().facebookUrl,
    profilePictureUrl: employeeDocument.data().profilePictureUrl,
    createdAt: employeeDocument.data().createdAt,
    hireDate: employeeDocument.data().hireDate ? employeeDocument.data().hireDate.toDate() : "",
    birthDate: employeeDocument.data().birthDate ? employeeDocument.data().birthDate.toDate() : "",
    hasUpcomingBirthday: hasUpcomingBirthday(employeeDocument.data().birthDate, birthdatethreshold),
    hasUpcomingWorkAnniversary: hasUpcomingWorkAnniversary(employeeDocument.data().hireDate, workanniversarythreshold),
    hasRecentInteraction: hasRecentInteraction(employeeDocument.data().lastInteraction, lastinteractionthreshold),
    lastInteraction: employeeDocument.data().lastInteraction ? employeeDocument.data().lastInteraction.toDate() : "",
    interests: employeeDocument.data().interests,
    sportsTeams: employeeDocument.data().sportsTeams,
    pets: employeeDocument.data().pets ? employeeDocument.data().pets : null,
    relations: employeeDocument.data().relations,
  };

  return employeeObject;
};

export const setupEmployeeObjectWithNews = async (
  employeeDocument: QueryDocumentSnapshot,
  configHeaders: ISetting
): Promise<IEmployee> => {
  const employeeData = setupEmployeeObject(employeeDocument, configHeaders);

  await getInterestUpdates(employeeDocument.data().interests).then((interests) => {
    employeeData.newsFeed = interests;
  });
  await getInterestUpdates(employeeDocument.data().sportsTeams).then((sportsNews) => {
    employeeData.sportsNews = sportsNews;
  });

  return employeeData;
};
