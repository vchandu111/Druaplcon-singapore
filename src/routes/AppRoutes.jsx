import React from "react";
import Home from "../Pages/Home";
import Shop from "../Pages/Shop";
import Contact from "../Pages/Contact";
import Deals from "../Pages/Deals";
import About from "../Pages/About";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";
import { Routes, Route } from "react-router-dom";
import Product from "../Components/ProductPage/Product";
import Cart from "../Pages/Cart";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<Product />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default AppRoutes;
