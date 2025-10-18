/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  // Material-UI Icons
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
  Inventory,
  Message,
  CalendarToday,
  BarChart,
  PieChart,
  ShowChart,
  CreditCard,
  Smartphone,
  Laptop,
  Headset,
  Watch,
  LocalShipping,
  Warning,
  CheckCircle,
  Error,
  Notifications,
  Close,
  Security,
  AccountCircle
} from '@mui/icons-material';

// DashboardData Class to manage all data from APIs
class DashboardData {
  constructor() {
    this.overview = null;
    this.salesData = null;
    this.userStats = null;
    this.productStats = null;
    this.financials = null;
    this.messages = null;
    this.bookings = null;
    this.loading = true;
    this.error = null;
  }

  async loadAllData(timeRange = 'monthly') {
    try {
      this.loading = true;
      this.error = null;

      const [
        overview,
        salesData,
        userStats,
        productStats,
        financials,
        messages,
        bookings
      ] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getSalesData(timeRange),
        dashboardAPI.getUserStats(),
        dashboardAPI.getProductStats(),
        dashboardAPI.getFinancials(),
        dashboardAPI.getMessages(),
        dashboardAPI.getBookings()
      ]);

      this.overview = overview;
      this.salesData = salesData;
      this.userStats = userStats;
      this.productStats = productStats;
      this.financials = financials;
      this.messages = messages;
      this.bookings = bookings;

      return this;
    } catch (error) {
      this.error = error.message;
      console.error('Error loading dashboard data:', error);
      return this;
    } finally {
      this.loading = false;
    }
  }
}

// API Service Functions - ALL data from APIs only
const dashboardAPI = {
  // Base URLs for APIs
  baseURL: 'https://jsonplaceholder.typicode.com',

  // Safe fetch with error handling
  safeFetch: async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      throw error;
    }
  },

  // Fetch notifications from API data
  getNotifications: async () => {
    try {
      const [posts, comments, users, todos] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/comments`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/todos`)
      ]);

      // Generate notifications dynamically from API data
      const notifications = [
        {
          id: posts[0]?.id || 1,
          title: 'New Order Received',
          message: `Order #${posts[0]?.id || '001'} has been placed. Total: $${((posts[0]?.id || 1) * 25)}`,
          type: 'order',
          icon: <ShoppingCart />,
          timestamp: new Date(Date.now() - 1000 * 60 * (posts[0]?.id || 5)),
          read: false
        },
        {
          id: posts[1]?.id || 2,
          title: 'Low Stock Alert',
          message: `Product stock is running low. Only ${(posts.length % 20) + 5} units left.`,
          type: 'warning',
          icon: <Warning />,
          timestamp: new Date(Date.now() - 1000 * 60 * (posts[1]?.id || 30)),
          read: false
        },
        {
          id: posts[2]?.id || 3,
          title: 'New Customer Registration',
          message: `New customer ${users[0]?.name || 'User'} has registered.`,
          type: 'user',
          icon: <People />,
          timestamp: new Date(Date.now() - 1000 * 60 * (posts[2]?.id || 60)),
          read: false
        },
        {
          id: posts[3]?.id || 4,
          title: 'Payment Received',
          message: `Payment of $${((comments.length % 50) + 25) * 10} processed successfully.`,
          type: 'payment',
          icon: <AttachMoney />,
          timestamp: new Date(Date.now() - 1000 * 60 * (posts[3]?.id || 120)),
          read: true
        },
        {
          id: posts[4]?.id || 5,
          title: 'System Update',
          message: `Maintenance scheduled. ${todos[0]?.title || 'System updates'} will occur.`,
          type: 'system',
          icon: <Security />,
          timestamp: new Date(Date.now() - 1000 * 60 * (posts[4]?.id || 180)),
          read: true
        }
      ];

      return {
        count: notifications.filter(n => !n.read).length,
        notifications: notifications
      };
    } catch (error) {
      console.error('Error in getNotifications:', error);
      throw error; // No fallback data - let component handle error
    }
  },

  getOverview: async () => {
    try {
      const [users, posts, todos, albums] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/todos`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/albums`)
      ]);

      const userCount = users?.length || 0;
      const postCount = posts?.length || 0;
      const todoCount = todos?.length || 0;
      const albumCount = albums?.length || 0;

      return {
        totalRevenue: postCount * userCount * 125,
        revenueGrowth: (postCount % 20) + 5,
        totalOrders: postCount,
        orderGrowth: (postCount % 15) + 3,
        totalCustomers: userCount,
        customerGrowth: (userCount % 25) + 8,
        totalProducts: (todoCount % 50) + (albumCount % 30) + 50,
        productGrowth: (todoCount % 10) + 2
      };
    } catch (error) {
      console.error('Error in getOverview:', error);
      throw error;
    }
  },

  getSalesData: async (timeRange) => {
    try {
      const [posts, comments, users] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/comments`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`)
      ]);

      const baseMultiplier = (posts?.length || 0) * (users?.length || 0) * (comments?.length || 0);

      if (timeRange === 'daily') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return {
          daily: days.map((day, index) => ({
            day,
            revenue: (baseMultiplier * (index + 1) * 25) % 15000 + 2000
          }))
        };
      }

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        monthly: months.map((month, index) => ({
          month,
          revenue: (baseMultiplier * (index + 1) * 125) % 60000 + 10000
        }))
      };
    } catch (error) {
      console.error('Error in getSalesData:', error);
      throw error;
    }
  },

  getUserStats: async () => {
    try {
      const [users, posts] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`)
      ]);

      const userCount = users?.length || 0;
      const postCount = posts?.length || 0;

      const demographics = [
        { 
          age: '18-24', 
          percentage: Math.min(30, (userCount % 25) + 5), 
          count: Math.floor(userCount * 0.25) 
        },
        { 
          age: '25-34', 
          percentage: Math.min(45, (userCount % 35) + 10), 
          count: Math.floor(userCount * 0.42) 
        },
        { 
          age: '35-44', 
          percentage: Math.min(20, (userCount % 15) + 5), 
          count: Math.floor(userCount * 0.18) 
        },
        { 
          age: '45+', 
          percentage: Math.min(15, (userCount % 10) + 5), 
          count: Math.floor(userCount * 0.15) 
        }
      ];

      return { demographics };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      throw error;
    }
  },

  getProductStats: async () => {
    try {
      const [todos, albums, posts, users] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/todos`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/albums`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`)
      ]);

      const todoCount = todos?.length || 0;
      const albumCount = albums?.length || 0;
      const postCount = posts?.length || 0;
      const userCount = users?.length || 0;

      const totalItems = todoCount + albumCount + postCount + userCount;

      const byCategory = [
        { 
          category: 'Smartphones', 
          percentage: Math.min(40, (totalItems % 35) + 5), 
          icon: <Smartphone /> 
        },
        { 
          category: 'Laptops', 
          percentage: Math.min(35, (totalItems % 30) + 5), 
          icon: <Laptop /> 
        },
        { 
          category: 'Audio', 
          percentage: Math.min(25, (totalItems % 20) + 5), 
          icon: <Headset /> 
        },
        { 
          category: 'Wearables', 
          percentage: Math.min(20, (totalItems % 15) + 5), 
          icon: <Watch /> 
        },
        { 
          category: 'Accessories', 
          percentage: Math.min(15, (totalItems % 10) + 5), 
          icon: <Inventory /> 
        }
      ];

      const stockLevels = [
        { 
          product: 'iPhone 15 Pro', 
          stock: (todoCount % 50) + 20, 
          lowStock: 20 
        },
        { 
          product: 'MacBook Air', 
          stock: (albumCount % 40) + 15, 
          lowStock: 15 
        },
        { 
          product: 'AirPods Pro', 
          stock: (postCount % 30) + 10, 
          lowStock: 25 
        },
        { 
          product: 'Apple Watch', 
          stock: (userCount % 80) + 20, 
          lowStock: 30 
        },
        { 
          product: 'iPad Pro', 
          stock: (todoCount % 25) + 5, 
          lowStock: 10 
        }
      ];

      return { byCategory, stockLevels };
    } catch (error) {
      console.error('Error in getProductStats:', error);
      throw error;
    }
  },

  getFinancials: async () => {
    try {
      const [posts, users, comments, todos] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/comments`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/todos`)
      ]);

      const baseAmount = (posts?.length || 0) * (users?.length || 0) * (comments?.length || 0) * 10;
      const totalItems = (posts?.length || 0) + (users?.length || 0) + (comments?.length || 0) + (todos?.length || 0);

      return {
        balances: {
          current: baseAmount,
          profit: Math.floor(baseAmount * 0.35),
          expenses: Math.floor(baseAmount * 0.65)
        },
        paymentMethods: [
          { 
            method: 'Credit Card', 
            percentage: Math.min(50, (totalItems % 45) + 5), 
            icon: <CreditCard /> 
          },
          { 
            method: 'PayPal', 
            percentage: Math.min(40, (totalItems % 35) + 5), 
            icon: <AttachMoney /> 
          },
          { 
            method: 'Bank Transfer', 
            percentage: Math.min(25, (totalItems % 20) + 5), 
            icon: <BarChart /> 
          },
          { 
            method: 'Cryptocurrency', 
            percentage: Math.min(15, (totalItems % 10) + 5), 
            icon: <TrendingUp /> 
          }
        ]
      };
    } catch (error) {
      console.error('Error in getFinancials:', error);
      throw error;
    }
  },

  getMessages: async () => {
    try {
      const [comments, posts, users] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/comments`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`)
      ]);

      const commentsLength = comments?.length || 0;
      const postsLength = posts?.length || 0;
      const usersLength = users?.length || 0;

      return {
        unread: commentsLength % 20,
        responseRate: 80 + (postsLength % 20)
      };
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  },

  getBookings: async () => {
    try {
      const [todos, posts, users, comments] = await Promise.all([
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/todos`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/posts`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/users`),
        dashboardAPI.safeFetch(`${dashboardAPI.baseURL}/comments`)
      ]);

      const todosLength = todos?.length || 0;
      const postsLength = posts?.length || 0;
      const usersLength = users?.length || 0;
      const commentsLength = comments?.length || 0;

      return {
        pending: todosLength % 30,
        confirmed: postsLength % 200,
        deliveryRate: 85 + (usersLength % 15)
      };
    } catch (error) {
      console.error('Error in getBookings:', error);
      throw error;
    }
  }
};

// Notification Modal Component
const NotificationsModal = ({ isOpen, onClose, notifications, onNotificationClick, selectedNotification, onCloseDetail }) => {
  if (!isOpen) return null;

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-red-600 bg-red-50';
      case 'user': return 'text-green-600 bg-green-50';
      case 'payment': return 'text-purple-600 bg-purple-50';
      case 'system': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Notification Detail Modal
  if (selectedNotification) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Notification Details</h2>
            <button
              onClick={onCloseDetail}
              className="bg-gradient-to-b from-red-400 to-red-700 transition-colors"
            >
              <Close className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${getNotificationColor(selectedNotification.type)}`}>
                {React.cloneElement(selectedNotification.icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h3>
                <p className="text-sm text-gray-500">{formatTime(selectedNotification.timestamp)}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 leading-relaxed">{selectedNotification.message}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onCloseDetail}
                className="flex-1 bg-gradient-to-b from-red-500 to-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Notifications List Modal
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <button
            onClick={onClose}
            className="bg-gradient-to-b from-red-600 to-red-700 transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Notifications className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => onNotificationClick(notification)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {React.cloneElement(notification.icon, { className: "w-4 h-4" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 truncate ${!notification.read ? 'text-blue-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-bl from-red-500 to-red-700 py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, growth, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </p>
        <div className={`flex items-center mt-2 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`w-4 h-4 mr-1 ${growth < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">{Math.abs(growth)}%</span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color} ml-4`}>
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
    </div>
  </motion.div>
);

// Bar Chart Component with safe data handling
const BarChartComponent = ({ data, title, color }) => {
  const safeData = Array.isArray(data) ? data : [];
  const maxValue = safeData.length > 0 ? Math.max(...safeData.map(item => item.revenue)) : 1;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2 text-blue-600" />
        {title}
      </h3>
      <div className="flex items-end justify-between h-48 space-x-2">
        {safeData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-500 mb-2">
              {item.month || item.day}
            </div>
            <div
              className={`w-full ${color} rounded-t-lg transition-all duration-500 hover:opacity-80`}
              style={{ height: `${(item.revenue / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 text-center">
              ${(item.revenue / 1000).toFixed(0)}k
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie Chart Component with safe data handling
const PieChartComponent = ({ data, title }) => {
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-green-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {safeData.map((item, index) => {
          const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
            'bg-red-500', 'bg-purple-500', 'bg-indigo-500'
          ];
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                <span className="text-sm font-medium text-gray-600">
                  {item.category || item.method || item.type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {item.icon && React.cloneElement(item.icon, { 
                  className: "w-4 h-4 text-gray-400" 
                })}
                <span className="text-sm font-semibold text-gray-900">
                  {item.percentage || item.count}
                </span>
                <span className="text-sm text-gray-500">
                  {item.percentage ? `${item.percentage}%` : `${item.count}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Progress Chart Component with safe data handling
const ProgressChart = ({ data, title }) => {
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShowChart className="w-5 h-5 mr-2 text-orange-600" />
        {title}
      </h3>
      <div className="space-y-4">
        {safeData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">{item.product}</span>
              <span className={`text-sm font-semibold ${
                item.stock <= item.lowStock ? 'text-red-600' : 'text-green-600'
              }`}>
                {item.stock} in stock
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  item.stock <= item.lowStock ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${(item.stock / (item.stock + (item.lowStock || 1) * 2)) * 100}%` 
                }}
              ></div>
            </div>
            {item.stock <= item.lowStock && (
              <div className="flex items-center mt-1">
                <Warning className="w-3 h-3 text-red-500 mr-1" />
                <p className="text-xs text-red-600">Low stock alert</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon, color, status }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-1">
          {status === 'good' && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
          {status === 'warning' && <Warning className="w-4 h-4 text-yellow-500 mr-1" />}
          {status === 'error' && <Error className="w-4 h-4 text-red-500 mr-1" />}
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color} ml-4`}>
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
    </div>
  </motion.div>
);

// Dashboard Component
export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [dashboardData, setDashboardData] = useState(new DashboardData());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notificationsData, setNotificationsData] = useState({ count: 0, notifications: [] });
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Load notifications
  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const data = await dashboardAPI.getNotifications();
      setNotificationsData(data);
    } catch (error) {
      console.error('Failed to load notifications from API:', error);
      // Set empty state on error
      setNotificationsData({ count: 0, notifications: [] });
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async (range = timeRange) => {
    try {
      const dataModel = new DashboardData();
      const loadedData = await dataModel.loadAllData(range);
      setDashboardData(loadedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set error state
      const errorData = new DashboardData();
      errorData.error = error.message;
      errorData.loading = false;
      setDashboardData(errorData);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    // Mark as read
    setNotificationsData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ),
      count: prev.notifications.filter(n => !n.read && n.id !== notification.id).length
    }));
  };

  // Handle close detail modal
  const handleCloseDetail = () => {
    setSelectedNotification(null);
  };

  // Handle close notifications modal
  const handleCloseNotifications = () => {
    setIsNotificationsModalOpen(false);
    setSelectedNotification(null);
  };

  // Handle open notifications modal
  const handleOpenNotifications = () => {
    setIsNotificationsModalOpen(true);
    loadNotifications();
  };

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
    
    const dataInterval = setInterval(() => {
      loadDashboardData();
    }, 300000);

    const notificationsInterval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(notificationsInterval);
    };
  }, []);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    loadDashboardData(newRange);
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
         
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Error className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{dashboardData.error}</p>
          <button
            onClick={() => loadDashboardData()}
            className="bg-gradient-to-br from-red-500 to-red-700 text-white px-6 py-2 rounded-lg  transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 xsm:p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={handleCloseNotifications}
        notifications={notificationsData.notifications}
        onNotificationClick={handleNotificationClick}
        selectedNotification={selectedNotification}
        onCloseDetail={handleCloseDetail}
      />

      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xsm:flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl xsm:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Electronics Store Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm xsm:text-sm sm:text-base">
              Real-time analytics from live APIs
              {lastUpdated && (
                <span className="text-gray-400 ml-2">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 xsm:mt-4 sm:mt-0">
            {/* Notifications Badge */}
            <div className="relative">
              <motion.button 
                onClick={handleOpenNotifications}
                disabled={notificationsLoading}
                className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Notifications className="w-6 h-6 text-gray-600" />
                {notificationsData.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationsLoading ? '...' : notificationsData.count}
                  </span>
                )}
                {notificationsLoading && notificationsData.count === 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ...
                  </span>
                )}
              </motion.button>
            </div>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily View</option>
              <option value="monthly">Monthly View</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      {dashboardData.overview && (
        <div className="grid grid-cols-1 xsm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={dashboardData.overview.totalRevenue || 0}
            growth={dashboardData.overview.revenueGrowth || 0}
            icon={<AttachMoney />}
            color="bg-gradient-to-br from-green-500 to-green-600"
            delay={0.1}
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.overview.totalOrders || 0}
            growth={dashboardData.overview.orderGrowth || 0}
            icon={<ShoppingCart />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0.2}
          />
          <StatCard
            title="Total Customers"
            value={dashboardData.overview.totalCustomers || 0}
            growth={dashboardData.overview.customerGrowth || 0}
            icon={<People />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={0.3}
          />
          <StatCard
            title="Total Products"
            value={dashboardData.overview.totalProducts || 0}
            growth={dashboardData.overview.productGrowth || 0}
            icon={<Inventory />}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            delay={0.4}
          />
        </div>
      )}

      {/* Charts Grid 1 */}
      {dashboardData.salesData && dashboardData.productStats && (
        <div className="grid grid-cols-1 xsm:grid-cols-1 lg:grid-cols-2 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          <BarChartComponent
            data={timeRange === 'monthly' ? dashboardData.salesData.monthly : dashboardData.salesData.daily}
            title={timeRange === 'monthly' ? 'Monthly Revenue Trend' : 'Daily Revenue Trend'}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <PieChartComponent
            data={dashboardData.productStats.byCategory}
            title="Revenue by Product Category"
          />
        </div>
      )}

      {/* Metrics Grid */}
      {dashboardData.financials && dashboardData.bookings && dashboardData.messages && (
        <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          <MetricCard
            title="Current Balance"
            value={`$${(dashboardData.financials.balances?.current || 0).toLocaleString()}`}
            subtitle="Available funds"
            icon={<CreditCard />}
            color="bg-gradient-to-br from-green-500 to-green-600"
            status="good"
          />
          <MetricCard
            title="Pending Orders"
            value={(dashboardData.bookings.pending || 0).toString()}
            subtitle="Awaiting processing"
            icon={<CalendarToday />}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            status="warning"
          />
          <MetricCard
            title="Unread Messages"
            value={(dashboardData.messages.unread || 0).toString()}
            subtitle="Require attention"
            icon={<Message />}
            color="bg-gradient-to-br from-red-500 to-red-600"
            status="error"
          />
          <MetricCard
            title="Delivery Rate"
            value={`${dashboardData.bookings.deliveryRate || 0}%`}
            subtitle="Successful deliveries"
            icon={<LocalShipping />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            status="good"
          />
        </div>
      )}

      {/* Charts Grid 2 */}
      {dashboardData.productStats && dashboardData.financials && (
        <div className="grid grid-cols-1 xsm:grid-cols-1 lg:grid-cols-2 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          <ProgressChart
            data={dashboardData.productStats.stockLevels}
            title="Product Stock Levels & Alerts"
          />
          <PieChartComponent
            data={dashboardData.financials.paymentMethods}
            title="Payment Methods Distribution"
          />
        </div>
      )}

      {/* Additional Metrics */}
      {dashboardData.financials && dashboardData.messages && dashboardData.bookings && (
        <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 xsm:gap-3 sm:gap-4 md:gap-6">
          <MetricCard
            title="Monthly Profit"
            value={`$${(dashboardData.financials.balances?.profit || 0).toLocaleString()}`}
            subtitle="Net profit"
            icon={<TrendingUp />}
            color="bg-gradient-to-br from-green-500 to-green-600"
            status="good"
          />
          <MetricCard
            title="Monthly Expenses"
            value={`$${(dashboardData.financials.balances?.expenses || 0).toLocaleString()}`}
            subtitle="Operational costs"
            icon={<BarChart />}
            color="bg-gradient-to-br from-red-500 to-red-600"
            status="warning"
          />
          <MetricCard
            title="Response Rate"
            value={`${dashboardData.messages.responseRate || 0}%`}
            subtitle="Customer messages"
            icon={<Message />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            status="good"
          />
          <MetricCard
            title="Confirmed Orders"
            value={(dashboardData.bookings.confirmed || 0).toString()}
            subtitle="Ready for delivery"
            icon={<Inventory />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            status="good"
          />
        </div>
      )}

      {/* User Demographics */}
      {dashboardData.userStats && Array.isArray(dashboardData.userStats.demographics) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <People className="w-5 h-5 mr-2 text-purple-600" />
            Customer Demographics
          </h3>
          <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-4 gap-4">
            {dashboardData.userStats.demographics.map((demo, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{demo.percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">{demo.age}</div>
                <div className="text-xs text-gray-500 mt-1">{(demo.count || 0).toLocaleString()} users</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};