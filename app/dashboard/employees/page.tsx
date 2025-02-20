import { Breadcrumb } from "@/components/BreadCrumb";
import React from "react";
import EmployeeManagementWrapper from "../employees-management/EmployeeManagementWrapper";
import EmployeesWrapper from "./components/EmployeesWrapper";

const page = () => {
  return (
    <div className="grid gap-5 px-5">
      <Breadcrumb />
      <EmployeesWrapper />
    </div>
  );
};

export default page;
