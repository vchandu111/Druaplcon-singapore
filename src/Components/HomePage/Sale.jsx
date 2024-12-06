import React from "react";
import {
  FaShippingFast,
  FaMoneyBillWave,
  FaHeadset,
  FaLock,
} from "react-icons/fa"; // Importing icons from react-icons

const services = [
  {
    id: 1,
    icon: <FaShippingFast />, // Icon for Free Shipping
    title: "Free Shipping",
    description: "For all orders over $99",
  },
  {
    id: 2,
    icon: <FaMoneyBillWave />, // Icon for Money Back Guarantee
    title: "Money Back Guarantee",
    description: "If goods have problems",
  },
  {
    id: 3,
    icon: <FaHeadset />, // Icon for Online Support 24/7
    title: "Online Support 24/7",
    description: "Dedicated support",
  },
  {
    id: 4,
    icon: <FaLock />, // Icon for Payment Secure
    title: "Payment Secure",
    description: "100% secure payment",
  },
];

const SaleSection = () => {
  return (
    <div className=" md:pt-20 pt-0 pb-20">
      {/* Discount Section */}
      <div className="container mx-auto flex flex-wrap justify-between items-center mb-10  lg:px-0">
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          <img
            src="https://preview.colorlib.com/theme/ashion/img/discount.jpg.webp"
            alt="Discount"
            className="rounded-lg shadow-md w-full"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-left">
          <h3 className="text-lg md:text-4xl font-bold text-gray-600">
            DISCOUNT
          </h3>
          <h1 className="text-2xl md:text-6xl text-pink-600 font-bold my-4">
            Summer 2024
          </h1>
          <h3 className="text-lg">
            SALE{" "}
            <span className="text-red-600 text-lg md:text-3xl font-bold">
              50%
            </span>
          </h3>
          <button className="mt-6 px-6 py-3  text-white rounded-lg shadow-md bg-gradient-to-r from-pink-500 to-pink-700 hover:scale-105 transform transition">
            Shop Now
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-0 md:mt-20">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center bg-white p-6 rounded-lg shadow-md"
          >
            <span className="text-red-600 text-4xl mr-4">{service.icon}</span>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {service.title}
              </h4>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleSection;
