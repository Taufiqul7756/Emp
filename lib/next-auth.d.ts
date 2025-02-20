import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    user: {
      email: string;
      name: string;
      userId: string;
      phoneNumber: string;
      profilePhoto: string | null;
      role: string;
    };
  }

  interface User {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    user: {
      email: string;
      fullName: string;
      userId: string;
      phoneNumber: string;
      profilePhoto: string | null;
      role: string;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    user: {
      email: string;
      fullName: string;
      userId: string;
      phoneNumber: string;
      profilePhoto: string | null;
      role: string;
    };
  }
}
