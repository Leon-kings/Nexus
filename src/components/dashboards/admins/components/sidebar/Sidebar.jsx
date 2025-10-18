/* eslint-disable no-unused-vars */
import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  // Material-UI Icons
  Dashboard,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Message,
  LocalShipping,
  BarChart,
  Settings,
  Menu,
  Close,
  ChevronLeft,
  ChevronRight,
  Store,
  Category,
  Receipt,
  Analytics,
  Support,
  Notifications,
  AccountCircle,
  Logout,
  ExpandMore,
  ExpandLess,
  Person,
  Security,
  Language,
  Palette,
} from "@mui/icons-material";

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gradient-to-b from-red-500 to-red-700 rounded-lg transition-colors"
          >
            <Close className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Account Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Person className="w-5 h-5 mr-2 text-blue-500" />
              Account
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-500">
                  Update your personal information
                </p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">
                  Update your security password
                </p>
              </button>
            </div>
          </div>

          {/* System Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Security className="w-5 h-5 mr-2 text-green-500" />
              System
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Privacy & Security</p>
                <p className="text-sm text-gray-500">
                  Manage your privacy settings
                </p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">
                  Configure notification preferences
                </p>
              </button>
            </div>
          </div>

          {/* Language Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Language className="w-5 h-5 mr-2 text-orange-500" />
              Language & Region
            </h3>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-l from-red-300 to-red-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-lg  transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Sidebar Data Structure
const sidebarMenu = {
  main: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
      badge: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <Analytics />,
      path: "/analytics",
      badge: null,
    },
  ],
  store: [
    {
      id: "products",
      label: "Products",
      icon: <Inventory />,
      path: "/7833/8303i/products/managements",
      badge: "156",
    },

    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart />,
      path: "/23833/8038i/orders/managements",
      badge: "45",
    },
    {
      id: "customers",
      label: "Customers",
      icon: <People />,
      path: "/08393/8303i/users/managements",
      badge: "8.4K",
    },
  ],
  financial: [
    {
      id: "revenue",
      label: "Revenue",
      icon: <AttachMoney />,
      path: "/20000/3hd903/checkout/managements",
      badge: null,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <Receipt />,
      path: "/637is9393/3hd903/transaction/managements",
      badge: null,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChart />,
      path: "/h92978/hsj8292/reports/managements",
      badge: null,
    },
  ],
  operations: [
    {
      id: "shipping",
      label: "Shipping",
      icon: <LocalShipping />,
      path: "/u020d/jhsd03/shoping/managements",
      badge: "23",
    },
    {
      id: "messages",
      label: "Messages",
      icon: <Message />,
      path: "/729ns/jo7392j/messages/managements",
      badge: "15",
    },
    {
      id: "support",
      label: "Support",
      icon: <Support />,
      path: "/support",
      badge: null,
    },
  ],
};

// Sidebar Item Component
const SidebarItem = ({ item, isOpen, isActive }) => {
  return (
    <Link to={item.path}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center mx-2 px-3 py-3 rounded-xl transition-all duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }
        `}
      >
        <div className={`${isActive ? "text-white" : "text-gray-400"}`}>
          {item.icon}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center justify-between flex-1 ml-3 min-w-0"
            >
              <span className="text-sm font-medium truncate">{item.label}</span>

              {item.badge && (
                <span
                  className={`
                  px-2 py-1 text-xs rounded-full font-medium
                  ${
                    isActive
                      ? "bg-white text-blue-600"
                      : "bg-gray-600 text-gray-300"
                  }
                `}
                >
                  {item.badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

// Main Sidebar Component
export const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    store: true,
    financial: false,
    operations: false,
  });
  const [showSettings, setShowSettings] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const sidebarContent = (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Future Electronics</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="p-2 rounded-lg bg-gradient-to-b from-blue-400 to-indigo-400 transition-colors"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("main")}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isOpen ? "Main" : ""}
            </span>
            {isOpen &&
              (expandedSections.main ? <ExpandLess /> : <ExpandMore />)}
          </button>

          <AnimatePresence>
            {(!isOpen || expandedSections.main) && (
              <motion.div
                initial={isOpen ? { opacity: 0, height: 0 } : false}
                animate={isOpen ? { opacity: 1, height: "auto" } : {}}
                exit={isOpen ? { opacity: 0, height: 0 } : {}}
                className="mt-2 space-y-1"
              >
                {sidebarMenu.main.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isOpen={isOpen}
                    isActive={isActivePath(item.path)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Store Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("store")}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isOpen ? "Store" : ""}
            </span>
            {isOpen &&
              (expandedSections.store ? <ExpandLess /> : <ExpandMore />)}
          </button>

          <AnimatePresence>
            {(!isOpen || expandedSections.store) && (
              <motion.div
                initial={isOpen ? { opacity: 0, height: 0 } : false}
                animate={isOpen ? { opacity: 1, height: "auto" } : {}}
                exit={isOpen ? { opacity: 0, height: 0 } : {}}
                className="mt-2 space-y-1"
              >
                {sidebarMenu.store.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isOpen={isOpen}
                    isActive={isActivePath(item.path)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Financial Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("financial")}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isOpen ? "Financial" : ""}
            </span>
            {isOpen &&
              (expandedSections.financial ? <ExpandLess /> : <ExpandMore />)}
          </button>

          <AnimatePresence>
            {(!isOpen || expandedSections.financial) && (
              <motion.div
                initial={isOpen ? { opacity: 0, height: 0 } : false}
                animate={isOpen ? { opacity: 1, height: "auto" } : {}}
                exit={isOpen ? { opacity: 0, height: 0 } : {}}
                className="mt-2 space-y-1"
              >
                {sidebarMenu.financial.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isOpen={isOpen}
                    isActive={isActivePath(item.path)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Operations Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("operations")}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isOpen ? "Operations" : ""}
            </span>
            {isOpen &&
              (expandedSections.operations ? <ExpandLess /> : <ExpandMore />)}
          </button>

          <AnimatePresence>
            {(!isOpen || expandedSections.operations) && (
              <motion.div
                initial={isOpen ? { opacity: 0, height: 0 } : false}
                animate={isOpen ? { opacity: 1, height: "auto" } : {}}
                exit={isOpen ? { opacity: 0, height: 0 } : {}}
                className="mt-2 space-y-1"
              >
                {sidebarMenu.operations.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isOpen={isOpen}
                    isActive={isActivePath(item.path)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-700 p-4 space-y-3">
        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center w-full p-3 rounded-xl hover:bg-gray-700 transition-colors"
        >
          <div className="p-2 bg-blue-500 rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between flex-1 ml-3"
              >
                <span className="text-sm font-medium">Settings</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pt-3 border-t border-gray-700">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <AccountCircle className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">
                  admin@futureelectronics.com
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </motion.div>
  );

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={onToggle}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: isOpen ? 0 : -280 }}
          transition={{ type: "spring", damping: 30 }}
          className="fixed inset-y-0 left-0 z-50 w-80 lg:hidden"
        >
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="hidden lg:block relative z-30"
    >
      {sidebarContent}
    </motion.div>
  );
};


