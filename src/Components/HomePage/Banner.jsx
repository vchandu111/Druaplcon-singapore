import React from "react";

const Banner = () => {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-0">
        <div className="w-full max-w-md lg:max-w-lg">
          <h3 className="text-red-500 uppercase text-lg font-semibold text-center lg:text-left">
            Summer Collection
          </h3>
          <h1 className="text-4xl lg:text-6xl mt-4 font-bold text-center lg:text-left">
            Fall - Winter Collections 2030
          </h1>
          <p className="mt-6 text-base lg:text-lg leading-7 text-gray-700 text-center lg:text-left">
            A specialist label creating luxury essentials. Ethically crafted
            with an unwavering commitment to exceptional quality.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="mt-6 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-lg text-lg font-medium hover:scale-105 transform transition">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="w-full lg:w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/young-crazy-businessman-with-shopping-bags_1194-9824.jpg?t=st=1732555854~exp=1732559454~hmac=d38e37788e5a4e0a1e98acc95a62b696f382f6bc774f6506153bf58638ce3514&w=900')`,
        }}
      >
      </div>
    </div>
  );
};

export default Banner;
