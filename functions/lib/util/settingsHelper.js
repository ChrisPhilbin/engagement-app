"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureUserAppSettings = exports.defaultAppSettings = void 0;
exports.defaultAppSettings = {
    lastInteractionThreshold: 7,
    birthdateThreshold: 7,
    workAnniversaryThreshold: 7,
    dailyDigest: false,
    weeklyDigest: false,
};
const configureUserAppSettings = (settingsObject) => {
    if (!settingsObject) {
        return exports.defaultAppSettings;
    }
    return settingsObject.data();
};
exports.configureUserAppSettings = configureUserAppSettings;
//# sourceMappingURL=settingsHelper.js.map