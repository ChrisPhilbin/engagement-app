exports.defaultAppSettings = {
  lastInteractionThreshold: 7,
  birthdateThreshold: 7,
  workAnniversaryThreshold: 7,
  dailyDigest: false,
  weeklyDigest: false,
};

exports.configureUserAppSettings = (settingsObject) => {
  if (!settingsObject) {
    return this.defaultAppSettings;
  }

  return settingsObject.data();
};
