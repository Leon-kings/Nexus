/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Person,
  Close,
  Email,
  Phone,
  CalendarToday,
  Login,
  VerifiedUser,
  Notifications,
  Security,
  Refresh,
  Warning
} from '@mui/icons-material';

export const UserDashboardManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Get user data from localStorage
  const getUserFromLocalStorage = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try different possible keys where user data might be stored
      const possibleKeys = ['user', 'userData', 'authUser', 'currentUser', 'userInfo'];
      
      for (const key of possibleKeys) {
        const userData = localStorage.getItem(key);
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            console.log(`Found user data in localStorage key: ${key}`, parsedUser);
            
            // Handle different possible user data structures
            if (parsedUser.user) {
              setUser(parsedUser.user);
              return;
            } else if (parsedUser.data?.user) {
              setUser(parsedUser.data.user);
              return;
            } else if (parsedUser.id || parsedUser.email) {
              setUser(parsedUser);
              return;
            }
          } catch (parseError) {
            console.warn(`Failed to parse user data from key ${key}:`, parseError);
          }
        }
      }
      
      // If no user data found in common keys, try to find any user-like data
      const allStorage = { ...localStorage };
      for (const [key, value] of Object.entries(allStorage)) {
        if (key.toLowerCase().includes('user') || key.toLowerCase().includes('auth')) {
          try {
            const parsedData = JSON.parse(value);
            if (parsedData && (parsedData.email || parsedData.name)) {
              console.log(`Found potential user data in key: ${key}`, parsedData);
              setUser(parsedData);
              return;
            }
          } catch (e) {
            // Not JSON, skip
          }
        }
      }
      
      // No user data found
      setUser(null);
      setError('No user data found in browser storage. Please log in again.');
      
    } catch (err) {
      console.error('Error fetching user data from localStorage:', err);
      setError('Failed to load your user data from browser storage.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

  const handleViewDetails = () => {
    setIsDetailsModalOpen(true);
  };

  const handleRefresh = () => {
    getUserFromLocalStorage();
    toast.info('Refreshing user data...');
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    
    switch (status.toLowerCase()) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
      case 'user':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getVerificationColor = (isVerified) => {
    return isVerified 
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
      : 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
  };

  const getActiveColor = (isActive) => {
    return isActive 
      ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white' 
      : 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
  };

  const getRoleIcon = (status) => {
    return status === 'admin' ? (
      <Security className="w-4 h-4 text-white" />
    ) : (
      <Person className="w-4 h-4 text-white" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (!user || !user.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // User Details Modal Component
  const UserDetailsModal = () => {
    if (!user) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setIsDetailsModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">My Profile Details</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {getUserInitials(user)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.name || 'Unknown User'}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.role || user.status)}`}>
                    {getRoleIcon(user.role || user.status)}
                    {user.role || user.status || 'user'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(user.isVerified)}`}>
                    <VerifiedUser className="w-3 h-3" />
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getActiveColor(user.isActive !== false)}`}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Email className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.email || 'No email provided'}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <CalendarToday className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(user.createdAt || user.joinDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Login className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Notifications className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Login Count</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.loginCount || 0}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                This is your personal dashboard. Data is loaded from your browser's local storage.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state or no user data
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-yellow-200 dark:border-yellow-800 p-8 text-center max-w-md mx-auto">
            <Warning className="w-16 h-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-2">
              {error ? 'Error Loading Data' : 'No User Data Found'}
            </h3>
            <p className="text-yellow-600 dark:text-yellow-400 mb-4">
              {error || 'No user information found in browser storage.'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please log in to see your dashboard information.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2 mx-auto"
            >
              <Refresh className="w-4 h-4" />
              Check Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
                My Personal Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Welcome back, {user.name}! Here's your account overview.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Data loaded from browser storage
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
            >
              <Refresh className="w-4 h-4" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* User Card - Only shows current user */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {getUserInitials(user)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                    <p className="text-blue-100 text-lg">{user.email}</p>
                  </div>
                </div>
                {getRoleIcon(user.role || user.status)}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(user.role || user.status)}`}>
                  {user.role || user.status || 'user'}
                </span>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getVerificationColor(user.isVerified)}`}>
                  <VerifiedUser className="w-4 h-4" />
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getActiveColor(user.isActive !== false)}`}>
                  {user.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Login className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Login Count</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.loginCount || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <CalendarToday className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(user.createdAt || user.joinDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Notifications className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(user.lastLogin)}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Phone className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Information Message */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                  This is your personal dashboard. Data is loaded from your browser's local storage.
                  For any account changes, please contact the administrator.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewDetails}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg flex items-center gap-3"
                >
                  <Person className="w-5 h-5" />
                  View Full Profile Details
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDetailsModalOpen && <UserDetailsModal />}
      </AnimatePresence>
    </div>
  );
};