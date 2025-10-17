import React, { useState, useEffect } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import {
  AccountCircle,
  Menu,
  Person,
  Email,
  Circle,
} from "@mui/icons-material";

// Utility function to get user data from localStorage and cache
const getUserDataFromStorage = () => {
  // Try localStorage first
  const localStorageUser = localStorage.getItem("user");
  if (localStorageUser) {
    try {
      const userData = JSON.parse(localStorageUser);
      return {
        name: userData.name || userData.username || userData.fullName || "",
        email: userData.email || "",
        status: userData.status || userData.accountStatus || "",
      };
    } catch (error) {
      console.error("Error parsing localStorage user:", error);
    }
  }

  // Try sessionStorage as fallback
  const sessionStorageUser = sessionStorage.getItem("user");
  if (sessionStorageUser) {
    try {
      const userData = JSON.parse(sessionStorageUser);
      return {
        name: userData.name || userData.username || userData.fullName || "",
        email: userData.email || "",
        status: userData.status || userData.accountStatus || "",
      };
    } catch (error) {
      console.error("Error parsing sessionStorage user:", error);
    }
  }

  // Check for common auth storage patterns
  const authStorageKeys = [
    "authUser",
    "userData",
    "currentUser",
    "userProfile",
  ];
  for (const key of authStorageKeys) {
    const storedData = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        return {
          name: userData.name || userData.username || userData.fullName || "",
          email: userData.email || userData.userEmail || "",
          status: userData.status || userData.accountStatus || "",
        };
      } catch (error) {
        console.error(`Error parsing ${key} from storage:`, error);
      }
    }
  }

  // Check for token-based storage (common in JWT apps)
  const tokenKeys = ["token", "auth_token", "jwt", "access_token"];
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) {
      try {
        // Simple token parsing (in real apps, you'd use proper JWT decoding)
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        return {
          name: tokenData.name || tokenData.username || tokenData.sub || "",
          email: tokenData.email || "",
          status: tokenData.status || "",
        };
      } catch (error) {
        console.error(`Error parsing token ${key}:`, error);
      }
    }
  }

  // Return empty values if no user data found
  return {
    name: "",
    email: "",
    status: "",
  };
};

// Function to get user initials for avatar fallback
const getUserInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "text-green-600 bg-green-100";
    case "inactive":
      return "text-gray-600 bg-gray-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "suspended":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-400 bg-gray-100";
  }
};

// Function to get status display text
const getStatusDisplay = (status) => {
  if (!status) return "No Status";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    status: "",
  });

  // Get user info from storage on component mount
  useEffect(() => {
    const fetchUserInfoFromStorage = () => {
      const userData = getUserDataFromStorage();
      setUserInfo(userData);
    };

    fetchUserInfoFromStorage();

    // Listen for storage changes (in case user data updates in another tab)
    const handleStorageChange = (e) => {
      if (
        e.key === "user" ||
        e.key?.includes("auth") ||
        e.key?.includes("token")
      ) {
        fetchUserInfoFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if user data is available
  // eslint-disable-next-line no-unused-vars
  const hasUserData = userInfo.name || userInfo.email || userInfo.status;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
        userInfo={userInfo}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-20 transition-colors duration-200">
          <div className="flex items-center justify-between px-4 xsm:px-3 sm:px-4 md:px-6 py-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-gradient-to-bl hover:from-blue-100 hover:to-green-500 from-blue-800 to-indigo-300 transition-colors lg:hidden"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>

            </div>

            <div className="flex items-center space-x-4">
              {/* User profile */}
              <div className="flex items-center space-x-3">
                {/* Avatar with icon fallback */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials(userInfo.name) || (
                    <AccountCircle className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="hidden sm:block text-right">
                  {/* Name with icon fallback */}
                  <div className="flex items-center justify-end space-x-1 mb-1">
                    {userInfo.name ? (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userInfo.name}
                      </p>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Person className="w-4 h-4" />
                        <span className="text-sm">No Name</span>
                      </div>
                    )}
                  </div>

                  {/* Status with icon fallback */}
                  <div className="flex items-center justify-end space-x-1">
                    {userInfo.status ? (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          userInfo.status
                        )}`}
                      >
                        {getStatusDisplay(userInfo.status)}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Circle className="w-2 h-2" />
                        <span className="text-xs">No Status</span>
                      </div>
                    )}
                  </div>

                  {/* Email with icon fallback (optional) */}
                  {userInfo.email && (
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <Email className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate max-w-[120px]">
                        {userInfo.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
