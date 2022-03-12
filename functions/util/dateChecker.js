const moment = require("moment");

exports.hasUpcomingBirthday = (employeeBirthdate) => {
  if (!employeeBirthdate) {
    return false;
  }
  const now = moment();
  employeeBirthdate = new Date(employeeBirthdate._seconds * 1000).toUTCString();

  let birthday = moment(employeeBirthdate).year(now.year());
  let birthDayNextYear = moment(employeeBirthdate).year(now.year() + 1);
  let daysRemaining = Math.min(Math.abs(birthday.diff(now, "days")), Math.abs(birthDayNextYear.diff(now, "days")));

  if (daysRemaining >= 0 && daysRemaining <= 7) {
    return true;
  }

  return false;
};

exports.hasUpcomingWorkAnniversary = (employeeHireDate) => {
  if (!employeeHireDate) {
    return false;
  }

  const now = moment();
  employeeHireDate = new Date(employeeHireDate._seconds * 1000).toUTCString();

  let anniversary = moment(employeeHireDate).year(now.year());
  let anniversaryNextYear = moment(employeeHireDate).year(now.year() + 1);
  let daysRemaining = Math.min(
    Math.abs(anniversary.diff(now, "days")),
    Math.abs(anniversaryNextYear.diff(now, "days"))
  );

  if (daysRemaining >= 0 && daysRemaining <= 7) {
    return true;
  }

  return false;
};

exports.hasRecentInteraction = (employeeLastInteractionDate) => {
  if (!employeeLastInteractionDate) {
    return false;
  }

  const now = moment();
  const weekOld = now.clone().subtract(7, "days").startOf("day");

  employeeLastInteractionDate = new Date(employeeLastInteractionDate._seconds * 1000).toUTCString();

  let interaction = moment(employeeLastInteractionDate);

  return interaction.isAfter(weekOld);
};
