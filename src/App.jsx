import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { AuthProvider, Navbar } from "./components/navbar/Navbar";
import { About } from "./pages/about/About";
import { Services } from "./pages/services/Services";
import { FAQ } from "./pages/faq/FAQ";
import { Products } from "./pages/electronics/Products";
import { Home } from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotFound } from "./pages/notfound/NotFound";
import { Footer } from "./components/footer/Footer";

// API configuration
const API_BASE_URL = "https://your-api-endpoint.com/api";

// Back to Top Button Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// View Counter Hook
const useViewCounter = () => {
  const sendViewData = async (page) => {
    try {
      const viewData = {
        page: page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        referrer: document.referrer || "direct",
      };

      await axios.post(`${API_BASE_URL}/views`, viewData);
    } catch (error) {
      console.error("Error sending view data:", error);
    }
  };

  return { sendViewData };
};

export default function App() {
  const { sendViewData } = useViewCounter();

  useEffect(() => {
    sendViewData("app");
  }, [sendViewData]);

  return (
    <AuthProvider>
      <div className="w-full">
        <Navbar />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BackToTop />
        <Footer />
      </div>
    </AuthProvider>
  );
}
