import { ISetting } from "../api/models/setting-model";

export const defaultAppSettings: ISetting = {
  lastInteractionThreshold: 7,
  birthdateThreshold: 7,
  workAnniversaryThreshold: 7,
  dailyDigest: false,
  weeklyDigest: false,
};

export const configureUserAppSettings = (settingsObject): ISetting => {
  if (!settingsObject) {
    return defaultAppSettings;
  }

  return settingsObject.data() as ISetting;
};
