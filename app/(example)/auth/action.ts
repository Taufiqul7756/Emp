"use server";

import { post } from "@/lib/api/handlers";
import { signIn, signOut } from "@/lib/auth";
import { ErrorResponse, Response } from "@/types/Response";
import { AxiosError } from "axios";
import { AuthError } from "next-auth";

const register = async (formData: FormData) => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phoneNumber = formData.get("phoneNumber");

    let response = await post<
      Response<{
        userId: string;
        name: string;
        email: string;
        phoneNumber: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >("/auth/register", {
      name,
      email,
      password,
      phoneNumber,
    });

    return {
      errors: null,
      data: response.message,
      extras: response,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorResponse = error as ErrorResponse;

      return {
        errors: errorResponse.response?.data?.error!,
        data: null,
      };
    } else {
      return {
        errors: "An unexpected error occurred.",
        data: null,
        extras: null,
      };
    }
  }
};

const loginHandler = async (formData: FormData) => {
  const phoneNumber = formData.get("phoneNumber");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      phoneNumber,
      password,
      // redirect: false,
      // redirectTo: "/protected/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return { error: error.cause.err.message };
      }

      switch (error.type) {
        case "CallbackRouteError":
          return { error: "Something went wrong. Please try again later." };

        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
};

const signOutHandler = async () => {
  await signOut({ redirectTo: "/" });
};

export { loginHandler, register, signOutHandler };
