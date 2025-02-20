import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { loginHandler } from "@/app/auth/action";
import { z } from "zod";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PhoneNumber from "./PhoneNumber";
import ConfirmPassword from "./ConfirmPassword";
import PinCode from "./PinCode";

interface AuthDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialogue: React.FC<AuthDialogueProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("phoneNumber");

  const handleTabSwitch = (
    tab: "phoneNumber" | "pinCode" | "confirmPassword"
  ) => {
    setActiveTab(tab);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-md border text-base font-normal leading-[19.2px] text-baseWhite hover:bg-primary-400 hover:bg-white/10"
        >
          Login
        </Button>
      </DialogTrigger> */}
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden !rounded-[5px] bg-white p-0 sm:max-w-[550px]">
        <Tabs value={activeTab} className="">
          <TabsContent value="phoneNumber">
            <PhoneNumber
              handleTabSwitch={handleTabSwitch}
              open={open}
              onOpenChange={onOpenChange}
            />
          </TabsContent>
          <TabsContent value="pinCode">
            <PinCode
              handleTabSwitch={handleTabSwitch}
              open={open}
              onOpenChange={onOpenChange}
            />
          </TabsContent>
          <TabsContent value="confirmPassword">
            <ConfirmPassword
              handleTabSwitch={handleTabSwitch}
              open={open}
              onOpenChange={onOpenChange}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialogue;
