const { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } = require("../util/dateChecker");
const { fetchInterests, getInterestUpdates } = require("../util/getNews");
const { getAppSettingsFromHeader } = require("./headerHelper");

exports.setupEmployeeObject = (employeeDocument, configHeaders) => {
  const { birthdatethreshold, lastinteractionthreshold, workanniversarythreshold } =
    getAppSettingsFromHeader(configHeaders);

  let employeeObject = {
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

exports.setupEmployeeObjectWithNews = async (employeeDocument, configHeaders) => {
  let employeeData = this.setupEmployeeObject(employeeDocument, configHeaders);

  await getInterestUpdates(employeeDocument.data().interests).then((interests) => {
    employeeData.newsFeed = interests;
  });
  await getInterestUpdates(employeeDocument.data().sportsTeams).then((sportsNews) => {
    employeeData.sportsNews = sportsNews;
  });

  return employeeData;
};
