import { Breadcrumb } from "@/components/BreadCrumb";
import { getStatusStyles } from "@/helper/statusStyles";
import React from "react";
import Settings from "./Components/Settings";

const page = () => {
  return (
    <div className="px-5 grid gap-5">
      <Breadcrumb />
      <div className="bg-white rounded-md shadow-sm">
        <Settings/>
      </div>
    </div>
  );
};

export default page;
