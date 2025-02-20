import * as z from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name must be at least 3 characters long"),
  status: z
    .enum(["ACTIVE", "INACTIVE"], {
      required_error: "Please Select a Status",
    })
    .refine((val) => val === "ACTIVE" || val === "INACTIVE", {
      message: "Please Select a Status",
    }),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;
