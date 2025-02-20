"use client"

import { Button } from "@/components/ui/button";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string({ required_error: "Is required" }).email({}),
  password: z.string({ required_error: "Is required" }).min(6),
});

interface FormField extends z.infer<typeof schema> {}

const BasicForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<FormField>({
    defaultValues: {
      email: "test@email.com",
      password: "123456",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      await new Promise((res) => setTimeout(res, 3000));
      //   throw new Error("Email");
      alert(JSON.stringify(data));
    } catch (error) {
      setError("email", {
        message: "Email went wrong",
      });
    }
  };

  return (
    <div className=" border border-white p-4 rounded-sm">
      <form className=" flex flex-col gap-4 " onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" placeholder="email" {...register("email")} />
        {errors && errors.email && <span>{errors.email.message}</span>}
        <Input type="password" placeholder="******" {...register("password")} />
        {errors && errors.password && <span>{errors.password.message}</span>}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submiting" : "submit"}
        </Button>
        {errors && errors.root && <span>{errors.root.message}</span>}
      </form>
      <p className="text-xs mt-3">
        A basic form with react-hook-form, zod(validation)
      </p>
    </div>
  );
};

export default BasicForm;
