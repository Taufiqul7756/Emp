import React from "react";
import Counter from "./components/Counter";
import BasicForm from "./components/BasicForm";
import { ShadcnForm } from "./components/ShadcnForm";
import Fetcher from "./components/Fetcher";

const page = () => {
  return (
    <div>
      <h3 className="text-3xl text-center mb-4">Some example components</h3>
      <div className="flex flex-wrap gap-4 justify-items-center items-stretch">
        <Counter />
        <BasicForm />
        <ShadcnForm />
        <Fetcher />
      </div>
    </div>
  );
};

export default page;
