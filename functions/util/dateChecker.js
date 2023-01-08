const moment = require("moment");
const { defaultAppSettings } = require("./settingsHelper");

exports.hasUpcomingBirthday = (employeeBirthdate, threshold = defaultAppSettings.birthdateThreshold) => {
  if (!employeeBirthdate) {
    return false;
  }
  const now = moment();
  employeeBirthdate = new Date(employeeBirthdate._seconds * 1000).toUTCString();
  let birthday = moment(employeeBirthdate).year(now.year());
  let birthDayNextYear = moment(employeeBirthdate).year(now.year() + 1);
  let daysRemaining = Math.min(birthday.diff(now, "days"), birthDayNextYear.diff(now, "days"));

  if (daysRemaining >= 0 && daysRemaining <= threshold) {
    return true;
  }

  return false;
};

exports.hasUpcomingWorkAnniversary = (employeeHireDate, threshold = defaultAppSettings.workAnniversaryThreshold) => {
  if (!employeeHireDate) {
    return false;
  }

  const now = moment();
  employeeHireDate = new Date(employeeHireDate._seconds * 1000).toUTCString();

  let anniversary = moment(employeeHireDate).year(now.year());
  let anniversaryNextYear = moment(employeeHireDate).year(now.year() + 1);
  let daysRemaining = Math.min(anniversary.diff(now, "days"), anniversaryNextYear.diff(now, "days"));

  if (daysRemaining >= 0 && daysRemaining <= threshold) {
    return true;
  }

  return false;
};

exports.hasRecentInteraction = (
  employeeLastInteractionDate,
  threshold = defaultAppSettings.lastInteractionThreshold
) => {
  if (!employeeLastInteractionDate) {
    return false;
  }
  const now = moment();
  const weekOld = now.clone().subtract(threshold, "days").startOf("day");

  employeeLastInteractionDate = new Date(employeeLastInteractionDate._seconds * 1000).toUTCString();

  let interaction = moment(employeeLastInteractionDate);

  return interaction.isAfter(weekOld);
};
