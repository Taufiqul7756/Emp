import React from "react";
import CreateEmployee from "./components/CreateEmployee";
import { Breadcrumb } from "@/components/BreadCrumb";

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
