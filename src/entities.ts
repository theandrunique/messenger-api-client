export enum TerminateSessions {
  Week,
  Month,
  Month3,
  Month6,
  Year,
}

export type Email = {
  data: string;
  isVerified: boolean;
  isPublic: boolean;
  addedAt: Date;
};

export type Phone = {
  data: string;
  isVerified: boolean;
  addedAt: Date;
};

export type File = {
  id: string;
  ownerId: string;
  contentType: string;
  fileName: string;
  url: string;
  size: number;
  displaySize: string;
  sha256: string;
  uploadedAt: Date;
};

export type User = {
  id: string;
  username: string;
  usernameUpdatedAt: Date;
  bio: string;
  globalName: string;
  createdAt: Date;
  passwordUpdatedAt: Date;
  terminateSessions: TerminateSessions;
  twoFactorAuthentication: boolean;
  emails: Email[];
  phones: Phone[];
};

export class ServiceError {
  title: string;
  errors?: Record<string, string[]>;

  constructor(title: string, errors?: Record<string, string[]>) {
    this.title = title;
    this.errors = errors;
  }
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type RefreshTokenResponse = {
  refreshToken: string;
};
