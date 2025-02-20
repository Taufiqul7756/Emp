import { Breadcrumb } from "@/components/shared/BreadCrumb";
import React from "react";
import CreateEmployee from "./components/CreateEmployee";

function page() {
  return (
    <div>
      <div className="ml-4">
        <Breadcrumb />
      </div>
      <CreateEmployee />
    </div>
  );
}

export default page;
