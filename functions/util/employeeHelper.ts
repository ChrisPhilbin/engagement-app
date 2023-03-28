import { IAppHeader } from "../api/models/app-headers-model";
import { IAppRequest } from "../api/models/app-request-model";
import { IEmployee } from "../api/models/employee-model";
import { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } from "./dateChecker";
import { getInterestUpdates } from "./getNews";
import { getAppSettingsFromHeader } from "./headerHelper";

export const setupEmployeeObject = (
  employeeDocument: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
  configHeaders: IAppRequest
): IEmployee => {
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
  employeeDocument: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
  configHeaders: IAppHeader
): Promise<IEmployee> => {
  //@ts-ignore
  const employeeData = setupEmployeeObject(employeeDocument, configHeaders);

  await getInterestUpdates(employeeDocument.data()?.interests).then((interests) => {
    employeeData.newsFeed = interests;
  });
  await getInterestUpdates(employeeDocument.data()?.sportsTeams).then((sportsNews) => {
    employeeData.sportsNews = sportsNews;
  });

  return employeeData;
};
