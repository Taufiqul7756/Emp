import { Breadcrumb } from "@/components/BreadCrumb";
import React from "react";
import TableForEmployees from "./components/TableForEmployees";
import EmployeeManagementWrapper from "./EmployeeManagementWrapper";
import BreadcrumbAndTable from "./BreadcrumbAndTable";

const page = () => {
  return (
    <div className="">
      <BreadcrumbAndTable />
    </div>
  );
};

export default page;
