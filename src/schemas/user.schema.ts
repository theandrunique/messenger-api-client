export enum TerminateSessions {
  WEEK = "WEEK",
  MONTH = "MONTH",
  MONTH3 = "MONTH3",
  MONTH6 = "MONTH6",
  YEAR = "YEAR",
}

export interface UserSchema {
  id: string;
  username: string;
  globalName: string;
  bio: string | null;
  image: string | null;
  timestamp: Date;
  terminateSessions: TerminateSessions;
  twoFactorAuthentication: boolean;
  email: string;
  isEmailVerified: boolean;
}
