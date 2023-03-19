export const getAppSettingsFromHeader = (requestHeader) => {
  const configData = {
    birthdatethreshold: requestHeader.birthdatethreshold,
    lastinteractionthreshold: requestHeader.lastinteractionthreshold,
    workanniversarythreshold: requestHeader.workanniversarythreshold,
  };
  return configData;
};
