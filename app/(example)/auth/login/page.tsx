"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { loginHandler } from "../action";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const loginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
  });

  type LoginFormFields = z.infer<typeof loginSchema>;

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    setError: setErrorLogin,
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "manas@techanalyticaltd.com",
      password: "Abcd@1234",
    },
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await loginHandler(formData);
      if (!result?.error) {
        toast({
          title: "Login successful!",
          tw: "w-full h-full bg-blue-200",
        });
        router.push("/protected");
      } else {
        setServerError(result?.error);
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form onSubmit={handleSubmitLogin(onSubmit)}>
        <Card className="w-[350px] min-h-fit">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Lorena.Veum@example.org"
                required
                {...registerLogin("email")}
              />
              {loginErrors.email && (
                <span className="text-red-500 text-sm">
                  {loginErrors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Abcd@1234"
                required
                {...registerLogin("password")}
              />
              {loginErrors.password && (
                <span className="text-red-500 text-sm">
                  {loginErrors.password.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <Button className="w-full" type="submit">
              {isLoginSubmitting ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/auth/register"} className="hover:underline">
                register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
