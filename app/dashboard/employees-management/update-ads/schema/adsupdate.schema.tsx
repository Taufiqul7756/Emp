import * as z from "zod";

export const AdsUpdateSchemaZod = z
  .object({
    thumbnail: z.string().url("Invalid URL format for adsProfile"),
    adsName: z.string().min(3, "Ads name must be at least 3 characters long"),
    providerName: z
      .string()
      .min(5, "ProviderName must be at least 5 characters long"),
    pageOfAds: z.array(z.string()).min(1, "Please select at least one ad"),
    createdBy: z
      .string()
      .min(3, "Creator name must be at least 3 characters long"),
    paymentMethod: z.enum(["Credit Card", "PayPal", "Bank Transfer"], {
      required_error: "Please select a payment method",
    }),
    // state: z.enum(["ACTIVE", "INACTIVE"], {
    //   required_error: "Please select a club type",
    // }),
    amount: z.coerce.number().min(1, "Amount must be at least $1"),
    adsStart: z
      .date({
        required_error: "Start date is required",
        invalid_type_error: "Invalid start date",
      })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Start date is invalid",
      }),
    adsEnd: z
      .date({
        required_error: "End date is required",
        invalid_type_error: "Invalid end date",
      })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "End date is invalid",
      }),
    // status: z.literal(["WAITING_FOR_PAYMENT"], {
    //   errorMap: () => ({
    //     message: "Status must be WAITING_FOR_PAYMENT",
    //   }),
    // }),
    status: z.enum(
      ["WAITING_FOR_PAYMENT", "PENDING", "RUNNING", "COMPLETED", "CANCELED"],
      {
        required_error: "Please select a Status",
      },
    ),
  })
  .refine(
    (data) => {
      return data.adsStart <= data.adsEnd;
    },
    {
      message: "End date must be after the start date",
      path: ["adsEnd"],
    },
  );

export type AdsUpdateSchema = z.infer<typeof AdsUpdateSchemaZod>;
