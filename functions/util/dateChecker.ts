import moment from "moment";
import { defaultAppSettings } from "./settingsHelper";
import { Timestamp } from "firebase/firestore";

// const moment = require("moment");
// const { defaultAppSettings } = require("./settingsHelper");

export const hasUpcomingBirthday = (
  employeeBirthdate: Timestamp,
  threshold = defaultAppSettings.birthdateThreshold
): boolean => {
  if (!employeeBirthdate) {
    return false;
  }
  const now = moment();
  //@ts-ignore
  const convertedEmployeeBirthdate = new Date(employeeBirthdate._seconds * 1000).toUTCString();
  let birthday = moment(convertedEmployeeBirthdate).year(now.year());
  let birthDayNextYear = moment(convertedEmployeeBirthdate).year(now.year() + 1);
  let daysRemaining = Math.min(birthday.diff(now, "days"), birthDayNextYear.diff(now, "days"));

  if (daysRemaining >= 0 && daysRemaining <= threshold) {
    return true;
  }

  return false;
};

export const hasUpcomingWorkAnniversary = (
  employeeHireDate: Timestamp,
  threshold = defaultAppSettings.workAnniversaryThreshold
): boolean => {
  if (!employeeHireDate) {
    return false;
  }

  const now = moment();
  //@ts-ignore
  const convertedEmployeeHireDate = new Date(employeeHireDate._seconds * 1000).toUTCString();

  let anniversary = moment(convertedEmployeeHireDate).year(now.year());
  let anniversaryNextYear = moment(convertedEmployeeHireDate).year(now.year() + 1);
  let daysRemaining = Math.min(anniversary.diff(now, "days"), anniversaryNextYear.diff(now, "days"));

  if (daysRemaining >= 0 && daysRemaining <= threshold) {
    return true;
  }

  return false;
};

export const hasRecentInteraction = (
  employeeLastInteractionDate: Timestamp,
  threshold = defaultAppSettings.lastInteractionThreshold
): boolean => {
  if (!employeeLastInteractionDate) {
    return false;
  }
  const now = moment();
  const weekOld = now.clone().subtract(threshold, "days").startOf("day");

  //@ts-ignore
  const convertedEmployeeLastInteractionDate = new Date(employeeLastInteractionDate._seconds * 1000).toUTCString();

  let interaction = moment(convertedEmployeeLastInteractionDate);

  return interaction.isAfter(weekOld);
};
