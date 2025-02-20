// import { ErrorResponse, Response } from "@/types/Response";
// import { AxiosError } from "axios";
// import NextAuth from "next-auth";
// import { JWT } from "next-auth/jwt";
// import Credentials from "next-auth/providers/credentials";
// import { post } from "./api/handlers";

// type LoginResponse = {
//   accessToken: string;
//   accessTokenExpiresAt: string;
//   refreshToken: string;
//   refreshTokenExpiresAt: string;
//   user: {
//     email: string;
//     fullName: string;
//     userId: string;
//     phoneNumber: string;
//     profilePhoto: string | null;
//     role: string;
//   };
// };

// const refreshTokenHandler = async (
//   token: JWT,
// ): Promise<LoginResponse | null> => {
//   let response = await post<Response<LoginResponse>>(
//     "/auth/auth/token/refresh",
//     {
//       refresh_token: token.refreshToken,
//     },
//     {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   );

//   if (response.success) {
//     return response.data;
//   } else {
//     return null;
//   }
// };

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         phoneNumber: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         if (credentials === null) throw new Error("Missing credentials");

//         try {
//           let response = await post<Response<LoginResponse>>(
//             "/auth/auth/token",
//             {
//               phoneNumber: credentials.phoneNumber,
//               password: credentials.password,
//             },
//             {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//           );

//           if (response.success) {
//             // console.log("response", response.data.user.role);
//             if (response.data.user.role !== "ADMIN") {
//               throw new Error("You are not allowed!");
//             }
//             return response.data;
//           } else {
//             return null;
//           }
//         } catch (error) {
//           if (error instanceof AxiosError) {
//             if (error.code === "ECONNREFUSED") {
//               throw new Error("Server is not reachable!");
//             } else {
//               let axiosError = error as ErrorResponse;
//               throw new Error(axiosError.response?.data?.error!);
//             }
//           } else {
//             const err = error as Error;
//             throw new Error(err.message);
//           }
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user }) => {
//       // For the first time logging in token is empty, user contains the backend data.
//       if (user) {
//         // Put the backend data in the token.
//         token.accessToken = user.accessToken;
//         token.accessTokenExpiresAt = user.accessTokenExpiresAt;
//         token.refreshToken = user.refreshToken;
//         token.refreshTokenExpiresAt = user.refreshTokenExpiresAt;
//         token.user = user.user;
//       }

//       // Check token validity

//       if (Date.now() > new Date(token.accessTokenExpiresAt).getTime()) {
//         let refreshTokenHandlerResponse = await refreshTokenHandler(token);

//         if (refreshTokenHandlerResponse !== null) {
//           // Token refreshed, put the backend data in the token.
//           token.accessToken = refreshTokenHandlerResponse.accessToken;
//           token.accessToken = refreshTokenHandlerResponse.accessToken;
//           token.accessTokenExpiresAt =
//             refreshTokenHandlerResponse.accessTokenExpiresAt;
//           token.refreshToken = refreshTokenHandlerResponse.refreshToken;
//           token.refreshTokenExpiresAt =
//             refreshTokenHandlerResponse.refreshTokenExpiresAt;
//         } else {
//           // Refresh token expired, clearing tokens
//           token.accessToken = "";
//           token.accessToken = "";
//           token.accessTokenExpiresAt = "";
//           token.refreshToken = "";
//           token.refreshTokenExpiresAt = "";
//         }
//       }

//       // return the token with either backend token data or empty
//       return token;
//     },
//     session: ({ session, token }) => {
//       // Store the token in browser end
//       session.accessToken = token.accessToken;
//       session.accessTokenExpiresAt = token.accessTokenExpiresAt;
//       session.refreshToken = token.refreshToken;
//       session.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
//       session.user.userId = token.user.userId;
//       session.user.email = token.user.email;
//       session.user.name = token.user.fullName;
//       session.user.role = token.user.role;
//       session.user.profilePhoto = token.user.profilePhoto;

//       return session;
//     },
//     authorized: async ({ auth }) => {
//       // This is needed for middleware based route protection
//       return !!auth;
//     },
//   },
//   secret: process.env.AUTH_SECRET,
// });

import { ErrorResponse, Response } from "@/types/Response";
import { AxiosError } from "axios";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { post } from "./api/handlers";

type LoginResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: {
    email: string;
    fullName: string;
    userId: string;
    phoneNumber: string;
    profile: {
      profileId: string;
      profilePhoto: string;
      dateOfBirth: string;
      gender: string;
    };
    // profilePhoto: string | null;
    role: string;
  };
};

const refreshTokenHandler = async (
  token: JWT,
): Promise<LoginResponse | null> => {
  let response = await post<Response<LoginResponse>>(
    "/auth/auth/token/refresh",
    {
      refresh_token: token.refreshToken,
    },
    {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  );

  if (response.success) {
    return response.data;
  } else {
    return null;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phoneNumber: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials === null) throw new Error("Missing credentials");

        try {
          let response = await post<Response<LoginResponse>>(
            "/auth/auth/token",
            {
              phoneNumber: credentials.phoneNumber,
              password: credentials.password,
            },
            {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          );

          if (response.success) {
            if (response.data.user.role !== "ADMIN") {
              throw new Error("You are not allowed!");
            }

            return {
              accessToken: response.data.accessToken,
              accessTokenExpiresAt: response.data.accessTokenExpiresAt,
              refreshToken: response.data.refreshToken,
              refreshTokenExpiresAt: response.data.refreshTokenExpiresAt,
              user: {
                userId: response.data.user.userId,
                email: response.data.user.email,
                fullName: response.data.user.fullName,
                phoneNumber: response.data.user.phoneNumber,
                role: response.data.user.role,
                profilePhoto: response.data.user.profile?.profilePhoto || null,
              },
            };
          } else {
            return null;
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.code === "ECONNREFUSED") {
              throw new Error("Server is not reachable!");
            } else {
              let axiosError = error as ErrorResponse;
              throw new Error(axiosError.response?.data?.error!);
            }
          } else {
            const err = error as Error;
            throw new Error(err.message);
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // For the first time logging in token is empty, user contains the backend data.
      if (user) {
        // Put the backend data in the token.
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.refreshToken = user.refreshToken;
        token.refreshTokenExpiresAt = user.refreshTokenExpiresAt;
        token.user = {
          userId: user.user.userId,
          email: user.user.email,
          phoneNumber: user.user.phoneNumber,
          fullName: user.user.fullName,
          role: user.user.role,
          profilePhoto: user.user.profilePhoto,
        };
      }

      // Check token validity

      if (Date.now() > new Date(token.accessTokenExpiresAt).getTime()) {
        let refreshTokenHandlerResponse = await refreshTokenHandler(token);

        if (refreshTokenHandlerResponse !== null) {
          // Token refreshed, put the backend data in the token.
          token.accessToken = refreshTokenHandlerResponse.accessToken;
          token.accessToken = refreshTokenHandlerResponse.accessToken;
          token.accessTokenExpiresAt =
            refreshTokenHandlerResponse.accessTokenExpiresAt;
          token.refreshToken = refreshTokenHandlerResponse.refreshToken;
          token.refreshTokenExpiresAt =
            refreshTokenHandlerResponse.refreshTokenExpiresAt;
          token.user = {
            userId: refreshTokenHandlerResponse.user.userId,
            email: refreshTokenHandlerResponse.user.email,
            fullName: refreshTokenHandlerResponse.user.fullName,
            phoneNumber: user.user.phoneNumber,
            role: refreshTokenHandlerResponse.user.role,
            profilePhoto: refreshTokenHandlerResponse.user.profile.profilePhoto,
          };
        } else {
          // Refresh token expired, clearing tokens
          token.accessToken = "";
          token.accessToken = "";
          token.accessTokenExpiresAt = "";
          token.refreshToken = "";
          token.refreshTokenExpiresAt = "";
        }
      }

      // return the token with either backend token data or empty
      return token;
    },
    session: ({ session, token }) => {
      // Store the token in browser end
      session.accessToken = token.accessToken;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      session.refreshToken = token.refreshToken;
      session.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
      session.user.userId = token.user.userId;
      session.user.email = token.user.email;
      session.user.name = token.user.fullName;
      session.user.role = token.user.role;
      session.user.profilePhoto = token.user.profilePhoto ?? null;

      return session;
    },
    authorized: async ({ auth }) => {
      // This is needed for middleware based route protection
      return !!auth;
    },
  },
  secret: process.env.AUTH_SECRET,
});
