"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register as signupHandler } from "../action";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheck } from "lucide-react";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(30, "Name can not be more than 30 characters"),
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,32}$/,
      "Password must be 6-32 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)."
    ),
  phone: z
    .string()
    .min(10, "Invalid phone number.")
    .startsWith("0", "Phone number must start with 0")
    .max(11, "Invalid phone number."),
});

type SignupFormFields = z.infer<typeof signupSchema>;

export default function FormTabs() {
  const [successMsg, setSuccessMsg] = useState<string>("");

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    setError: setErrorSignup,
  } = useForm<SignupFormFields>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "Manas",
      email: "manas@techanalyticaltd.com",
      password: "Abcd@1234",
      phone: "01515212628",
    },
  });

  const onSubmitSignup: SubmitHandler<SignupFormFields> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);

    const { data: success, errors, extras } = await signupHandler(formData);

    if (success) {
      setSuccessMsg(success);
    }
    if (errors) {
      setErrorSignup("root", { message: errors });
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form onSubmit={handleSubmitSignup(onSubmitSignup)}>
        <Card className={`w-[350px] min-h-fit`}>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create a new account here. Already have an account?{" "}
              <Link href={"/auth/login"} className="underline">
                Login
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="signup-name">Name</Label>
              <Input
                id="signup-name"
                placeholder="John Doe"
                {...registerSignup("name")}
              />
              {signupErrors.name && (
                <span className="text-red-500 text-sm">
                  {signupErrors.name.message}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="m@example.com"
                {...registerSignup("email")}
              />
              {signupErrors.email && (
                <span className="text-red-500 text-sm">
                  {signupErrors.email.message}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                {...registerSignup("password")}
              />
              {signupErrors.password && (
                <span className="text-red-500 text-sm">
                  Password must be 6-32 characters and include at least one
                  <ul>
                    <li>- uppercase letter</li>
                    <li>- lowercase letter</li>
                    <li>- number</li>
                    <li>- special character (!@#$%^&*)</li>
                  </ul>
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-phone">Phone Number</Label>
              <Input
                id="signup-phone"
                type="tel"
                {...registerSignup("phone")}
                maxLength={11}
              />
              {signupErrors.phone && (
                <span className="text-red-500 text-sm">
                  {signupErrors.phone.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {signupErrors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-500 ">Error</AlertTitle>
                <AlertDescription className="text-red-500 text-sm">
                  {signupErrors.root.message}
                </AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              type="submit"
              disabled={isSignupSubmitting}
            >
              {isSignupSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
            {successMsg && (
              <Alert variant="default">
                <CircleCheck className="h-4 w-4" />
                <AlertTitle className="text-green-500 ">Success</AlertTitle>
                <AlertDescription className="text-green-500 text-sm">
                  {successMsg}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
