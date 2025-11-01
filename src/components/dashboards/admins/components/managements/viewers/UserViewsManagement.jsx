/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UserStatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const fetchViewerStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://nexusbackend-hdyk.onrender.com/views/stats');
      
      if (response.data.success) {
        setStats(response.data.data);
        setError(null);
        toast.success('Viewer data loaded successfully');
      } else {
        throw new Error('Failed to fetch viewer statistics');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load viewer statistics';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching viewer stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewerStats();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading viewer statistics...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={fetchViewerStats}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Viewer Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor website traffic and user engagement</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <ShieldCheckIcon className="w-4 h-4" />
            Admin View
          </div>
        </div>
      </motion.div>

      {/* Stats Overview Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Views Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalViews?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time page views</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Unique Users Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.uniqueUsers?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Guest Views Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Guest Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.guestViews?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Anonymous visitors</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <GuestIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Views Table */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Views</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
              {stats?.recentViews?.length || 0} records
            </span>
          </div>
          
          <RecentViewsTable 
            views={stats?.recentViews || []} 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </motion.div>

        {/* Analytics Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">View Distribution</h3>
          <ViewDistributionChart 
            uniqueUsers={stats?.uniqueUsers || 0}
            guestViews={stats?.guestViews || 0}
            totalViews={stats?.totalViews || 1}
          />
        </motion.div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">User Engagement Rate</span>
            <span className="font-medium">
              {stats?.totalViews && stats?.uniqueUsers 
                ? `${((stats.uniqueUsers / stats.totalViews) * 100).toFixed(1)}%`
                : '0%'
              }
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Guest Percentage</span>
            <span className="font-medium">
              {stats?.totalViews && stats?.guestViews
                ? `${((stats.guestViews / stats.totalViews) * 100).toFixed(1)}%`
                : '0%'
              }
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">
              {new Date().toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Data Source</span>
            <span className="font-medium">Real-time API</span>
          </div>
        </div>
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={fetchViewerStats}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md"
        >
          <RefreshIcon className="w-5 h-5" />
          Refresh Data
        </button>
      </motion.div>
    </div>
  );
};

// Recent Views Table Component with Pagination
const RecentViewsTable = ({ views, currentPage, itemsPerPage, onPageChange }) => {
  // Calculate pagination
  const totalPages = Math.ceil(views.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentViews = views.slice(startIndex, startIndex + itemsPerPage);

  if (!views || views.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <EyeOffIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
        <p>No recent views recorded</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Viewed At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentViews.map((view, index) => (
              <motion.tr
                key={view._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3">
                  {view.userId ? (
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">User</span>
                      <span className="text-xs text-gray-400">({view.userId.slice(-6)})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-orange-600">
                      <GuestIcon className="w-4 h-4" />
                      <span className="text-sm">Guest</span>
                    </span>
                  )}
                </td>
                <td className="py-3 text-sm text-gray-600 font-mono">
                  {view.ipAddress}
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {new Date(view.viewedAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg transition-opacity ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg transition-opacity ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// View Distribution Chart Component
const ViewDistributionChart = ({ uniqueUsers, guestViews, totalViews }) => {
  const userPercentage = totalViews > 0 ? (uniqueUsers / totalViews) * 100 : 0;
  const guestPercentage = totalViews > 0 ? (guestViews / totalViews) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${userPercentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-start px-2"
        >
          {userPercentage > 15 && (
            <span className="text-white text-xs font-medium">
              Users ({userPercentage.toFixed(1)}%)
            </span>
          )}
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${guestPercentage}%` }}
          transition={{ duration: 1, delay: 0.7 }}
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-start px-2 -mt-8"
        >
          {guestPercentage > 15 && (
            <span className="text-white text-xs font-medium">
              Guests ({guestPercentage.toFixed(1)}%)
            </span>
          )}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
          <span>Users: {uniqueUsers}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
          <span>Guests: {guestViews}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center mt-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-3 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{uniqueUsers}</div>
          <div className="text-xs text-green-800">Registered Users</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-100 p-3 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{guestViews}</div>
          <div className="text-xs text-orange-800">Guest Views</div>
        </div>
      </div>
    </div>
  );
};

// SVG Icons
const ShieldCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const GuestIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);