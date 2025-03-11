export interface TokenPairSchema {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  issuedAt: Date;
}

export interface MfaEnableResponseSchema {
  otpAuthUrl: string;
}
