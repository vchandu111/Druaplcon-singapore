import React from "react";
import { ThreeDots } from "react-loader-spinner";

function Loader() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
}

export default Loader;
