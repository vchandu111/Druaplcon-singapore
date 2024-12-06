import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-semibold text-pink-500 mb-4">
            ShopSwift
          </h3>
          <p className="text-sm">
            ShopSwift is your one-stop destination for all your fashion needs.
            Explore the latest trends and shop from a wide range of products.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Help Center</li>
            <li className="hover:text-blue-400 cursor-pointer">Track Order</li>
            <li className="hover:text-blue-400 cursor-pointer">Returns</li>
            <li className="hover:text-blue-400 cursor-pointer">
              Shipping Info
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">About Us</li>
            <li className="hover:text-blue-400 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-400 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-blue-400 cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-pink-400">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} ShopSwift. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
