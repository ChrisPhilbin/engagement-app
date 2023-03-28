export interface ISetting {
  authorization?: string;
  lastInteractionThreshold: number;
  birthdateThreshold: number;
  workAnniversaryThreshold: number;
  dailyDigest?: boolean;
  weeklyDigest?: boolean;
}
