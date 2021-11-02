/** @format */

import React from "react";

function Loading() {
  return (
    <div className=" flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-1" />
    </div>
  );
}

export default Loading;
