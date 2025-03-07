export interface TokenPairSchema {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  issuedAt: Date;
}
