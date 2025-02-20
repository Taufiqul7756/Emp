/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { Nav } from "../ui/nav";
import {
  TbBrandBlogger,
  TbDeviceGamepad3,
  TbDeviceLandlinePhone,
} from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CgWebsite } from "react-icons/cg";
import { BsChatSquareDots } from "react-icons/bs";
import { SiWebrtc } from "react-icons/si";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdManageAccounts, MdOutlineCompare } from "react-icons/md";
import { ImBlogger2 } from "react-icons/im";
import { LuClipboardList, LuNewspaper, LuReceiptCent } from "react-icons/lu";
import { RiDashboardFill, RiHotelBedLine, RiUserFill } from "react-icons/ri";
import { MdOutlineMeetingRoom, MdOutlineBedroomChild } from "react-icons/md";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { GoRss } from "react-icons/go";
import { PiContactlessPaymentFill, PiListNumbersFill } from "react-icons/pi";
import { FaDatabase, FaLandmarkFlag, FaRegKeyboard } from "react-icons/fa6";
import { PiUserLight } from "react-icons/pi";
import { LuRecycle } from "react-icons/lu";
import { MdPets, MdSupportAgent } from "react-icons/md";
import { LuNfc } from "react-icons/lu";
import { FaRegHospital } from "react-icons/fa";
import { PiAmbulanceBold } from "react-icons/pi";
import { TbAmbulance, TbMessageDots } from "react-icons/tb";
import { IoFlask } from "react-icons/io5";

import {
  RiAdminLine,
  RiCapsuleLine,
  RiCustomerServiceLine,
} from "react-icons/ri";
import { ReceiptCent } from "lucide-react";
import { CiSquarePlus, CiUser } from "react-icons/ci";
import {
  FaCodePullRequest,
  FaFirstOrder,
  FaHospital,
  FaServicestack,
  FaUserDoctor,
} from "react-icons/fa6";
import { GiSkills } from "react-icons/gi";
import { LiaHireAHelper } from "react-icons/lia";
import { TbUserSquareRounded } from "react-icons/tb";
import { GrGallery } from "react-icons/gr";
import { BiSolidDevices } from "react-icons/bi";

interface SideNavbarProps {
  isCollapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
}

export default function SideNavbar({
  isCollapsed,
  onCollapse,
}: SideNavbarProps) {
  const handleResize = () => {
    if (window.innerWidth <= 780) {
      onCollapse(true);
    } else {
      onCollapse(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    onCollapse(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "transition-width fixed left-0 top-0 z-10 h-full border-r-[1px] border-[#D4D5D9] bg-white pt-36 shadow-lg duration-300 ease-in-out",
        isCollapsed
          ? "w-[var(--collapsed-sidebar-width)]"
          : "w-[var(--sidebar-width)]",
      )}
    >
      <div className="absolute right-[-15px] top-[100px]">
        <Button
          onClick={toggleSidebar}
          variant="secondary"
          className="size-8 rounded-full border bg-white p-1 text-black"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <div className="h-full overflow-y-auto pb-4">
        <Nav
          isCollapsed={isCollapsed}
          links={[
            //Dashboard
            {
              title: "Dashboard",
              href: "/dashboard",
              icon: RiDashboardFill,
              variant: "ghost",
            },
            {
              title: "Employees",
              href: "/dashboard/employees",
              icon: RiUserFill,
              variant: "ghost",
            },
            {
              title: "Employees Management",
              href: "/dashboard/employees-management",
              icon: MdManageAccounts,
              variant: "ghost",
            },

            // Users Management
            // {
            //   title: "Users Management",
            //   href: "#",
            //   icon: FaUserAlt,
            //   variant: "ghost",
            //   subLinks: [
            //     {
            //       title: "Admin",
            //       href: "/dashboard/users-management/admin",
            //       icon: RiUserFill,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "Service Operator",
            //       href: "/dashboard/users-management/service-operator",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "Call Operator",
            //       href: "/dashboard/users-management/call-Operator",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "MTO",
            //       href: "/dashboard/users-management/mto",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "Ambulance Driver",
            //       href: "/dashboard/users-management/ambulance-driver",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "Ambulance Owner",
            //       href: "/dashboard/users-management/ambulance-owner",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "Agent",
            //       href: "/dashboard/users-management/agent",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //     {
            //       title: "Client",
            //       href: "/dashboard/users-management/client",
            //       icon: LuClipboardList,
            //       variant: "ghost",
            //     },
            //   ],
            // },

            //Settings
            {
              title: "Settings",
              href: "/dashboard/settings",
              icon: IoSettingsOutline,
              variant: "ghost",
            },
          ]}
        />
      </div>
    </div>
  );
}
