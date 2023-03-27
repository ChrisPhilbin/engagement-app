"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppSettingsFromHeader = void 0;
const getAppSettingsFromHeader = (requestHeader) => {
    const configData = {
        birthdatethreshold: requestHeader.birthdatethreshold,
        lastinteractionthreshold: requestHeader.lastinteractionthreshold,
        workanniversarythreshold: requestHeader.workanniversarythreshold,
    };
    return configData;
};
exports.getAppSettingsFromHeader = getAppSettingsFromHeader;
//# sourceMappingURL=headerHelper.js.map