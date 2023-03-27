"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRecentInteraction = exports.hasUpcomingWorkAnniversary = exports.hasUpcomingBirthday = void 0;
const moment_1 = __importDefault(require("moment"));
const settingsHelper_1 = require("./settingsHelper");
// const moment = require("moment");
// const { defaultAppSettings } = require("./settingsHelper");
const hasUpcomingBirthday = (employeeBirthdate, threshold = settingsHelper_1.defaultAppSettings.birthdateThreshold) => {
    if (!employeeBirthdate) {
        return false;
    }
    const now = (0, moment_1.default)();
    //@ts-ignore
    const convertedEmployeeBirthdate = new Date(employeeBirthdate._seconds * 1000).toUTCString();
    let birthday = (0, moment_1.default)(convertedEmployeeBirthdate).year(now.year());
    let birthDayNextYear = (0, moment_1.default)(convertedEmployeeBirthdate).year(now.year() + 1);
    let daysRemaining = Math.min(birthday.diff(now, "days"), birthDayNextYear.diff(now, "days"));
    if (daysRemaining >= 0 && daysRemaining <= threshold) {
        return true;
    }
    return false;
};
exports.hasUpcomingBirthday = hasUpcomingBirthday;
const hasUpcomingWorkAnniversary = (employeeHireDate, threshold = settingsHelper_1.defaultAppSettings.workAnniversaryThreshold) => {
    if (!employeeHireDate) {
        return false;
    }
    const now = (0, moment_1.default)();
    //@ts-ignore
    const convertedEmployeeHireDate = new Date(employeeHireDate._seconds * 1000).toUTCString();
    let anniversary = (0, moment_1.default)(convertedEmployeeHireDate).year(now.year());
    let anniversaryNextYear = (0, moment_1.default)(convertedEmployeeHireDate).year(now.year() + 1);
    let daysRemaining = Math.min(anniversary.diff(now, "days"), anniversaryNextYear.diff(now, "days"));
    if (daysRemaining >= 0 && daysRemaining <= threshold) {
        return true;
    }
    return false;
};
exports.hasUpcomingWorkAnniversary = hasUpcomingWorkAnniversary;
const hasRecentInteraction = (employeeLastInteractionDate, threshold = settingsHelper_1.defaultAppSettings.lastInteractionThreshold) => {
    if (!employeeLastInteractionDate) {
        return false;
    }
    const now = (0, moment_1.default)();
    const weekOld = now.clone().subtract(threshold, "days").startOf("day");
    //@ts-ignore
    const convertedEmployeeLastInteractionDate = new Date(employeeLastInteractionDate._seconds * 1000).toUTCString();
    let interaction = (0, moment_1.default)(convertedEmployeeLastInteractionDate);
    return interaction.isAfter(weekOld);
};
exports.hasRecentInteraction = hasRecentInteraction;
//# sourceMappingURL=dateChecker.js.map