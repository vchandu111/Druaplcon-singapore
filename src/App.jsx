import React from "react";
import Navbar from "./Components/Common/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Components/Common/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto">
        <Navbar />
        <AppRoutes />
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
