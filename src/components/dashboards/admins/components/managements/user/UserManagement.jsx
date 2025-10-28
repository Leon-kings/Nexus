/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  AdminPanelSettings,
  Person,
  Close,
  Email,
  Phone,
  CalendarToday,
  Login,
  Warning,
  Refresh,
  VerifiedUser,
  Notifications,
  Security,
  EditAttributes,
  SwapVert
} from '@mui/icons-material';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [statusEditingUser, setStatusEditingUser] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  const API_URL = 'https://nexusbackend-hdyk.onrender.com/admin';

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      
      if (response.data.success) {
        setUsers(response.data.data.users || []);
        setPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0 });
      } else {
        setUsers([]);
        console.warn('API returned unsuccessful response:', response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Safe filtering with array check
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditStatus = (user) => {
    setStatusEditingUser(user);
    setIsStatusModalOpen(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      // Since this is a demo, we'll simulate API call
      toast.info(editingUser ? 'User update simulated' : 'User creation simulated');
      setIsUserModalOpen(false);
      setEditingUser(null);
      // In real implementation, you would make API call here
      // await axios.post/put to your admin endpoint
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error('Failed to save user');
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      // Simulate API call to update user status
      const updatedUsers = users.map(user => 
        user._id === statusEditingUser._id 
          ? { 
              ...user, 
              status: statusData.status,
              isVerified: statusData.isVerified,
              isActive: statusData.isActive
            } 
          : user
      );
      
      setUsers(updatedUsers);
      toast.success(`User status updated successfully!`);
      setIsStatusModalOpen(false);
      setStatusEditingUser(null);
      
      // In real implementation, you would make API call here:
      // await axios.patch(`${API_URL}/users/${statusEditingUser._id}/status`, statusData);
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  const confirmDelete = async () => {
    try {
      // Simulate delete - in real app, call your API
      toast.info('User deletion simulated');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    return status === 'admin' ? 
      <AdminPanelSettings className="w-4 h-4 text-white" /> : 
      <Person className="w-4 h-4 text-white" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status Edit Modal Component
  const StatusEditModal = () => {
    const [formData, setFormData] = useState({
      status: 'user',
      isVerified: false,
      isActive: true
    });

    useEffect(() => {
      if (statusEditingUser) {
        setFormData({
          status: statusEditingUser.status || 'user',
          isVerified: statusEditingUser.isVerified || false,
          isActive: statusEditingUser.isActive !== undefined ? statusEditingUser.isActive : true
        });
      }
    }, [statusEditingUser]);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateStatus(formData);
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    };

    if (!statusEditingUser) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsStatusModalOpen(false);
          setStatusEditingUser(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <SwapVert className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Edit User Status</h2>
              </div>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingUser(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>
            <p className="text-amber-100 mt-2">Update permissions and access levels for {statusEditingUser.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {statusEditingUser.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{statusEditingUser.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{statusEditingUser.email}</p>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                User Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.status === 'user' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="user"
                    checked={formData.status === 'user'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Person className={`w-8 h-8 mb-2 ${
                    formData.status === 'user' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    formData.status === 'user' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-600 dark:text-gray-400'
                  }`}>User</span>
                  <span className="text-xs text-gray-500 mt-1">Standard access</span>
                </label>

                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.status === 'admin' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="admin"
                    checked={formData.status === 'admin'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <AdminPanelSettings className={`w-8 h-8 mb-2 ${
                    formData.status === 'admin' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    formData.status === 'admin' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-600 dark:text-gray-400'
                  }`}>Admin</span>
                  <span className="text-xs text-gray-500 mt-1">Full access</span>
                </label>
              </div>
            </div>

            {/* Verification and Active Status */}
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                <div className="flex items-center gap-3">
                  <VerifiedUser className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Email Verified</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User has verified their email address</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Active Account</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User can login and access the system</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Current Status Preview */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Preview</h4>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(formData.status)}`}>
                  {getRoleIcon(formData.status)}
                  {formData.status}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(formData.isVerified)}`}>
                  <VerifiedUser className="w-3 h-3" />
                  {formData.isVerified ? 'Verified' : 'Unverified'}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getActiveColor(formData.isActive)}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingUser(null);
                }}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
              >
                <SwapVert className="w-4 h-4" />
                Update Status
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // User Modal Component (Simplified for this example)
  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      status: 'user',
      isVerified: false,
      isActive: true
    });

    useEffect(() => {
      if (editingUser) {
        setFormData({
          name: editingUser.name || '',
          email: editingUser.email || '',
          phone: editingUser.profile?.phone || '',
          status: editingUser.status || 'user',
          isVerified: editingUser.isVerified || false,
          isActive: editingUser.isActive !== undefined ? editingUser.isActive : true
        });
      }
    }, [editingUser]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      handleSaveUser(formData);
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // User Details Modal Component (Keep existing implementation)
  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
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
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedUser(null);
                }}
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
                {selectedUser.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selectedUser.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedUser.status)}`}>
                    {getRoleIcon(selectedUser.status)}
                    {selectedUser.status}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(selectedUser.isVerified)}`}>
                    <VerifiedUser className="w-3 h-3" />
                    {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getActiveColor(selectedUser.isActive)}`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Details Modal */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditStatus(selectedUser)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
              >
                <SwapVert className="w-4 h-4" />
                Edit Status
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Delete Confirmation Modal Component (Keep existing implementation)
  const DeleteConfirmationModal = () => {
    if (!selectedUser) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <Warning className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete User</h3>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Are you sure you want to delete <strong className="text-black dark:text-white">{selectedUser.name}</strong>? This will permanently remove all user data.
            </p>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg"
              >
                Delete User
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Loading and Error states (keep existing implementation)
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-8 text-center max-w-md mx-auto">
            <Warning className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Error Loading Users</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUsers}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg flex items-center gap-2 mx-auto"
            >
              <Refresh className="w-4 h-4" />
              Try Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header and Search Section (keep existing) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage {pagination.total} users efficiently with advanced controls
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
              >
                <Refresh className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search and Add User Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8"
        >
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-lg"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddUser}
            className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-bold shadow-xl flex items-center justify-center gap-3"
          >
            <Add className="w-5 h-5" />
            Add New User
          </motion.button>
        </motion.div>

        {/* Users Grid with Status Edit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{user.name}</h3>
                        <p className="text-blue-100 text-sm">{user.email}</p>
                      </div>
                    </div>
                    {getRoleIcon(user.status)}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(user.isVerified)}`}>
                      <VerifiedUser className="w-3 h-3" />
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getActiveColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Login Count</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                        {user.loginCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
                      <span className="text-sm text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Last Login</span>
                      <span className="text-sm text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</span>
                    </div>
                  </div>

                  {/* Action Buttons with Status Edit */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewUser(user)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Visibility className="w-4 h-4" />
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditUser(user)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditStatus(user)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <SwapVert className="w-4 h-4" />
                        Status
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteUser(user)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Delete className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first user to get started'}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddUser}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium"
                >
                  Add First User
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isUserModalOpen && <UserModal />}
        {isDetailsModalOpen && <UserDetailsModal />}
        {isDeleteModalOpen && <DeleteConfirmationModal />}
        {isStatusModalOpen && <StatusEditModal />}
      </AnimatePresence>
    </div>
  );
};