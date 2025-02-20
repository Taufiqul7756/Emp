export interface Token {
  accessToken: string;
  accessTokenExpiresAt?: number;
  refreshToken: string;
  refreshTokenExpiresAt?: number;
}
