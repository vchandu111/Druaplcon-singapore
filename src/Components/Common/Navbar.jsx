import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Import cart icon from react-icons

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Deals", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function Navbar() {
  const [username, setUsername] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Track items in the cart

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("csrf_token");
    localStorage.removeItem("logout_token");
    setUsername(null);
    navigate("/"); // Redirect to the homepage
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch cart count from local storage or API
    const storedCartCount = parseInt(localStorage.getItem("cartCount")) || 0;
    setCartCount(storedCartCount);
  }, []);

  return (
    <nav className="flex justify-between items-center py-6 px-8 bg-white ">
      {/* Logo */}
      <div>
        <a className="text-2xl text-pink-500 cursor-pointer font-bold" href="/">
          ShopSwift
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-lg">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="hover:text-pink-500 transition duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Cart Icon and User Actions */}
      <div className="flex items-center space-x-6">
        {/* Cart Icon */}
        <div className="relative cursor-pointer">
          <a href="/cart">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-pink-500 transition duration-300" />
          </a>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </div>

        {/* User Actions */}
        {username ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hello, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-pink-500 py-2 px-4 rounded-lg text-white hover:bg-pink-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <a
            href="/signup"
            className="bg-pink-500 py-2 px-4 rounded-lg text-white hover:bg-pink-600 transition duration-300"
          >
            Register
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
