import { Breadcrumb } from "@/components/shared/BreadCrumb";
import React, { Suspense } from "react";
import UpdateAds from "./components/UpdateAds";

const page = () => {
  return (
    <>
      <div className="m-4">
        <Breadcrumb />
      </div>
      <Suspense fallback={<p>Loading feed...</p>}>
        <UpdateAds />
      </Suspense>
    </>
  );
};

export default page;
