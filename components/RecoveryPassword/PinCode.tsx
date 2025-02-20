// "use client";

// import React, { useRef } from "react";
// import {
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// // Zod schema for OTP validation
// const otpSchema = z.object({
//   otp1: z.string().min(1, "Required"),
//   otp2: z.string().min(1, "Required"),
//   otp3: z.string().min(1, "Required"),
//   otp4: z.string().min(1, "Required"),
//   otp5: z.string().min(1, "Required"),
//   otp6: z.string().min(1, "Required"),
// });

// type OtpFields = z.infer<typeof otpSchema>;

// interface PinCodeDialogProps {
//   handleTabSwitch: (
//     tab:
//       | "login"
//       | "confirmPassword"
//       | "passwordEntry"
//       | "pinCode"
//       | "profileDetails",
//   ) => void;
//   open: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// const PinCode: React.FC<PinCodeDialogProps> = ({
//   handleTabSwitch,
//   open,
//   onOpenChange,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<OtpFields>({
//     resolver: zodResolver(otpSchema),
//   });

//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleInput = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const value = event.target.value;
//     if (/^[0-9]$/.test(value)) {
//       setValue(`otp${index + 1}` as keyof OtpFields, value); // Sync value to form state
//       if (index < 5) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     } else {
//       event.target.value = ""; // Clear non-numeric input
//     }
//   };

//   const onSubmit: SubmitHandler<OtpFields> = async (data) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       const otp = Object.values(data).join("");
//       console.log("Submitted OTP:", otp);
//       handleTabSwitch("profileDetails"); // Switch to the next tab
//     } catch (error) {
//       console.error("Pin code error", error);
//     }
//   };

//   return (
//     <div className="max-w-lg p-6">
//       <Image
//         src="/images/Logo-dialog.png"
//         alt="Logo"
//         width={256}
//         height={71}
//         className="mx-auto mb-4"
//       />
//       <div>
//         <p className="text-center text-2xl font-semibold">
//           Verify Your Account
//         </p>
//       </div>
//       <p className="mt-2 text-center text-sm text-gray-500">
//         We’ve sent a one-time password (OTP) to your phone number. Please enter
//         the code below to complete verification.
//       </p>
//       <form
//         className="mt-6 flex flex-col items-center gap-4"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="flex gap-2">
//           {[...Array(6)].map((_, index) => (
//             <Input
//               key={index}
//               type="text"
//               inputMode="numeric"
//               pattern="[0-9]*"
//               maxLength={1}
//               className={`h-12 w-12 rounded-md border border-gray-300 text-center text-xl focus:ring-2 ${
//                 errors[`otp${index + 1}` as keyof OtpFields]
//                   ? "focus:ring-red-500"
//                   : "focus:ring-primary-500"
//               }`}
//               {...register(`otp${index + 1}` as keyof OtpFields)}
//               ref={(el) => {
//                 if (el) {
//                   inputRefs.current[index] = el;
//                 }
//               }}
//               onChange={(e) => handleInput(index, e)}
//             />
//           ))}
//         </div>
//         {Object.values(errors).length > 0 && (
//           <p className="mt-2 text-sm text-red-500">
//             Please fill out all fields.
//           </p>
//         )}
//         <Button
//           disabled={isSubmitting}
//           type="submit"
//           className="w-full bg-primary-500 text-baseWhite"
//         >
//           {isSubmitting ? "Submitting..." : "Submit"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default PinCode;

"use client";

import React, { useEffect, useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for OTP validation
const otpSchema = z.object({
  otp1: z.string().min(1, "Required"),
  otp2: z.string().min(1, "Required"),
  otp3: z.string().min(1, "Required"),
  otp4: z.string().min(1, "Required"),
  otp5: z.string().min(1, "Required"),
  otp6: z.string().min(1, "Required"),
});

type OtpFields = z.infer<typeof otpSchema>;

interface PinCodeDialogProps {
  handleTabSwitch: (tab: "phoneNumber" | "pinCode" | "confirmPassword") => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const PinCode: React.FC<PinCodeDialogProps> = ({
  handleTabSwitch,
  open,
  onOpenChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<OtpFields>({
    resolver: zodResolver(otpSchema),
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input initially
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^[0-9]$/.test(value)) {
      setValue(`otp${index + 1}` as keyof OtpFields, value); // Sync value to form state
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      event.target.value = ""; // Clear non-numeric input
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (!inputRefs.current[index]?.value) {
        setValue(`otp${index}` as keyof OtpFields, ""); // Clear value of previous field
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  const onSubmit: SubmitHandler<OtpFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const otp = Object.values(data).join("");
      // console.log("Submitted OTP:", otp);
      handleTabSwitch("confirmPassword"); // Switch to the next tab
    } catch (error) {
      // console.error("Pin code error", error);
    }
  };

  return (
    <div className="max-w-lg p-6">
      <Image
        src="/images/Logo-dialog.png"
        alt="Logo"
        width={256}
        height={71}
        className="mx-auto mb-4"
      />
      <div>
        <p className="text-center text-2xl font-semibold">
          Verify Your Account
        </p>
      </div>
      <p className="mt-2 text-center text-sm text-gray-500">
        We’ve sent a one-time password (OTP) to your phone number. Please enter
        the code below to complete verification.
      </p>
      <form
        className="mt-6 flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-2">
          {[...Array(6)].map((_, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className={`h-12 w-12 rounded-md border border-gray-300 text-center text-xl focus:ring-2 ${
                errors[`otp${index + 1}` as keyof OtpFields]
                  ? "focus:ring-red-500"
                  : "focus:ring-primary-500"
              }`}
              {...register(`otp${index + 1}` as keyof OtpFields)}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              onChange={(e) => handleInput(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        {Object.values(errors).length > 0 && (
          <p className="mt-2 text-sm text-red-500">OTP is not correct</p>
        )}
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-primary-500 text-baseWhite"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default PinCode;
