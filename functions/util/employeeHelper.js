const { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } = require("../util/dateChecker");
const { fetchInterests, getInterestUpdates } = require("../util/getNews");

exports.setupEmployeeObject = (employeeDocument, configInfo) => {
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
    hasUpcomingBirthday: hasUpcomingBirthday(employeeDocument.data().birthDate, configInfo.birthdatethreshold),
    hasUpcomingWorkAnniversary: hasUpcomingWorkAnniversary(
      employeeDocument.data().hireDate,
      configInfo.workanniversarythreshold
    ),
    hasRecentInteraction: hasRecentInteraction(
      employeeDocument.data().lastInteraction,
      configInfo.lastinteractionthreshold
    ),
    lastInteraction: employeeDocument.data().lastInteraction ? employeeDocument.data().lastInteraction.toDate() : "",
    interests: employeeDocument.data().interests,
    sportsTeams: employeeDocument.data().sportsTeams,
    pets: employeeDocument.data().pets ? employeeDocument.data().pets : null,
    relations: employeeDocument.data().relations,
  };

  return employeeObject;
};

exports.setupEmployeeObjectWithNews = async (employeeDocument, configInfo) => {
  let employeeData = this.setupEmployeeObject(employeeDocument, configInfo);

  await getInterestUpdates(employeeDocument.data().interests).then((interests) => {
    employeeData.newsFeed = interests;
  });
  await getInterestUpdates(employeeDocument.data().sportsTeams).then((sportsNews) => {
    employeeData.sportsNews = sportsNews;
  });

  return employeeData;
};
