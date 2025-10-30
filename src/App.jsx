import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";
import { AuthProvider, useAuth } from "./components/navbar/Navbar";
import { Navbar } from "./components/navbar/Navbar";
import { About } from "./pages/about/About";
import { Services } from "./pages/services/Services";
import { FAQ } from "./pages/faq/FAQ";
import { Products } from "./pages/electronics/Products";
import { Home } from "./pages/home/Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotFound } from "./pages/notfound/NotFound";
import { Footer } from "./components/footer/Footer";
import { CookiePolicy } from "./components/policy/CookiePolicy";
import { PrivacyPolicy } from "./components/policy/PrivacyPolicy";
import { Team } from "./components/team/Team";
import { Dashboard } from "./components/dashboards/admins/Dashboard";
import { DashboardLayout } from "./components/dashboards/admins/components/layout/DashboardLayout";
import { UserManagement } from "./components/dashboards/admins/components/managements/user/UserManagement";
import { DashboardChart } from "./components/dashboards/admins/components/charts/CombinedCharts";
import { ProductInventoryManagement } from "./components/dashboards/admins/components/managements/products/ProductInventoryManagement";
import { ElectronicOrdersManagement } from "./components/dashboards/admins/components/managements/orders/OrderManagements";
import { CheckoutManagement } from "./components/dashboards/admins/components/managements/revenue/RevenueAnalyticsManagement";
import { TransactionManagement } from "./components/dashboards/admins/components/managements/revenue/TransactionManagements";
import { ReportsAnalytics } from "./components/dashboards/admins/components/managements/report/ReportData";
import { ShoppingDetails } from "./components/dashboards/admins/components/managements/shoping/ShoppingDetails";
import { MessagesManagement } from "./components/dashboards/admins/components/managements/message/MessageManagement";
import { ContactManagement } from "./components/dashboards/admins/components/managements/contacts/ContactsManagements";
import { UserStatsDashboard } from "./components/dashboards/admins/components/managements/viewers/UserViewsManagement";
import { StockManagement } from "./components/dashboards/admins/components/managements/stocks/StockManagements";
import { QuestionAdmin } from "./components/dashboards/admins/components/managements/question/QuestionManagement";
import { UserDashboardLayout } from "./components/dashboards/users/components/layout/UserDashboardLayout";
import { UserDashboard } from "./components/dashboards/users/UserDashboard";
import { UserDashboardManagement } from "./components/dashboards/users/components/management/Users/UserDashManagement";
import { UserMessagesManagement } from "./components/dashboards/users/components/management/message/UserMessageManagement";
import { UserContactManagement } from "./components/dashboards/users/components/management/contacts/UserContactsManagements";
import { UserBookingManagement } from "./components/dashboards/users/components/management/bookings/UserBookingManagement";
import { UserCheckoutManagement } from "./components/dashboards/users/components/management/revenue/UserRevenueManagement";

// Create DarkMode Context
const DarkModeContext = createContext();

// DarkMode Provider Component
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use dark mode
const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

// Private Route Component
const PrivateRoute = ({ children, showMessage = true }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && showMessage) {
      toast.info(
        "Please sign in to access this page. Check the navbar to create an account or login.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    }
  }, [isAuthenticated, showMessage]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Dark Mode Toggle Button Component
const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      onClick={toggleDarkMode}
      className="fixed top-20 right-8 z-50 p-3 rounded-full bg-gradient-to-b from-blue-400 to-violet-400 shadow-lg transition-all duration-300 transform hover:scale-110 cursor-pointer"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          className="w-6 h-6 text-gray-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </div>
  );
};

// API configuration
const API_BASE_URL = "https://nexusbackend-hdyk.onrender.com";

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
          className="bg-gradient-to-tr from-blue-400 to-indigo-400 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6 text-white"
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
const useViewCounter = (userId = null) => {
  const sendViewData = async () => {
    try {
      // Create a unique browser fingerprint (fallback for guests)
      const fingerprint =
        localStorage.getItem("visitor_fingerprint") || crypto.randomUUID();
      localStorage.setItem("visitor_fingerprint", fingerprint);

      const viewData = {
        userId, // will be null for guests
        fingerprint,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        referrer: document.referrer || "direct",
      };

      await axios.post(`${API_BASE_URL}/views`, viewData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Success toast
      toast.success("View data sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      console.log("✅ View data sent successfully");
    } catch (error) {
      // Error toast
      toast.error(`Failed to send view data: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      console.error("❌ Error sending view data:", error.message);
    }
  };

  // Automatically send once on page load
  useEffect(() => {
    sendViewData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sendViewData };
};

export default function App() {
  const { sendViewData } = useViewCounter();

  useEffect(() => {
    sendViewData("app");
  }, [sendViewData]);

  return (
    <AuthProvider>
      <DarkModeProvider>
        <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/teams" element={<Team />} />
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  // <PrivateRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/08393/8303i/users/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <UserManagement />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <DashboardChart />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/7833/8303i/products/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ProductInventoryManagement />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/23833/8038i/orders/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ElectronicOrdersManagement />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/20000/3hd903/checkout/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <CheckoutManagement />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/637is9393/3hd903/transaction/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <TransactionManagement />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/h92978/hsj8292/reports/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ReportsAnalytics />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/u020d/jhsd03/shoping/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ShoppingDetails />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/729ns/jo7392j/messages/managements"
                element={
                  // <PrivateRoute>
                  <DashboardLayout>
                    <MessagesManagement />
                  </DashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/729ns/jojkbjo/contat/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ContactManagement />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/729ns/jojkbjo/question/managements"
                element={
                  // <PrivateRoute>
                  <DashboardLayout>
                    <QuestionAdmin />
                  </DashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/900u/jojkbjo/statistics/managements"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <UserStatsDashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />{" "}
              {/* </PrivateRoute> */}
              <Route
                path="/900u/syock/managements"
                element={
                  // <PrivateRoute>
                  <DashboardLayout>
                    <StockManagement />
                  </DashboardLayout>
                }
              />
              {/* ************************************* */}
              <Route
                path="/user-dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboardLayout>
                      <UserDashboard />
                    </UserDashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/838929/user/dashboard"
                element={
                  // <PrivateRoute>
                  <UserDashboardLayout>
                    <UserDashboardManagement />
                  </UserDashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/898920/user/messages/dashboard"
                element={
                  // <PrivateRoute>
                  <UserDashboardLayout>
                    <UserMessagesManagement />
                  </UserDashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/898920/user/contacts/dashboard"
                element={
                  // <PrivateRoute>
                  <UserDashboardLayout>
                    <UserContactManagement />
                  </UserDashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/898920/user/bookings/dashboard"
                element={
                  // <PrivateRoute>
                  <UserDashboardLayout>
                    <UserBookingManagement />
                  </UserDashboardLayout>
                  // </PrivateRoute>
                }
              />
              <Route
                path="/898920/user/checkout/dashboard"
                element={
                  // <PrivateRoute>
                  <UserDashboardLayout>
                    <UserCheckoutManagement />
                  </UserDashboardLayout>
                  // </PrivateRoute>
                }
              />
              {/* 404 route - should be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
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
          <DarkModeToggle />
          <BackToTop />
          <Footer />
        </div>
      </DarkModeProvider>
    </AuthProvider>
  );
}
