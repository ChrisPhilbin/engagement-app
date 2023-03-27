"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEmployeeObjectWithNews = exports.setupEmployeeObject = void 0;
const dateChecker_1 = require("./dateChecker");
const getNews_1 = require("./getNews");
const headerHelper_1 = require("./headerHelper");
const setupEmployeeObject = (employeeDocument, configHeaders) => {
    const { birthdatethreshold, lastinteractionthreshold, workanniversarythreshold } = (0, headerHelper_1.getAppSettingsFromHeader)(configHeaders);
    const employeeObject = {
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
        hasUpcomingBirthday: (0, dateChecker_1.hasUpcomingBirthday)(employeeDocument.data().birthDate, birthdatethreshold),
        hasUpcomingWorkAnniversary: (0, dateChecker_1.hasUpcomingWorkAnniversary)(employeeDocument.data().hireDate, workanniversarythreshold),
        hasRecentInteraction: (0, dateChecker_1.hasRecentInteraction)(employeeDocument.data().lastInteraction, lastinteractionthreshold),
        lastInteraction: employeeDocument.data().lastInteraction ? employeeDocument.data().lastInteraction.toDate() : "",
        interests: employeeDocument.data().interests,
        sportsTeams: employeeDocument.data().sportsTeams,
        pets: employeeDocument.data().pets ? employeeDocument.data().pets : null,
        relations: employeeDocument.data().relations,
    };
    return employeeObject;
};
exports.setupEmployeeObject = setupEmployeeObject;
const setupEmployeeObjectWithNews = async (employeeDocument, configHeaders) => {
    const employeeData = (0, exports.setupEmployeeObject)(employeeDocument, configHeaders);
    await (0, getNews_1.getInterestUpdates)(employeeDocument.data().interests).then((interests) => {
        employeeData.newsFeed = interests;
    });
    await (0, getNews_1.getInterestUpdates)(employeeDocument.data().sportsTeams).then((sportsNews) => {
        employeeData.sportsNews = sportsNews;
    });
    return employeeData;
};
exports.setupEmployeeObjectWithNews = setupEmployeeObjectWithNews;
//# sourceMappingURL=employeeHelper.js.map