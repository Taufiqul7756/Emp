import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
    </div>
  );
};

export default Loading;
