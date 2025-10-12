/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  Warning
} from '@mui/icons-material';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Mock initial data
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'admin',
        status: 'active',
        joinDate: '2023-01-15',
        lastLogin: '2024-01-20',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        role: 'user',
        status: 'active',
        joinDate: '2023-02-20',
        lastLogin: '2024-01-19',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567892',
        role: 'user',
        status: 'inactive',
        joinDate: '2023-03-10',
        lastLogin: '2024-01-18',
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
      toast.success('User updated successfully!');
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id)) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      toast.success('User added successfully!');
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    toast.success('User deleted successfully!');
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminPanelSettings className="w-4 h-4" /> : <Person className="w-4 h-4" />;
  };

  // User Modal Component
  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active'
    });

    useEffect(() => {
      if (editingUser) {
        setFormData({
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          status: editingUser.status
        });
      }
    }, [editingUser]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email) {
        alert('Please fill in all required fields');
        return;
      }
      handleSaveUser(formData);
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
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
          className="bg-white rounded-lg w-full max-w-md xsm:max-w-xs sm:max-w-sm md:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold xsm:text-lg">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={() => {
                setIsUserModalOpen(false);
                setEditingUser(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 xsm:text-xs">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent xsm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 xsm:text-xs">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent xsm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 xsm:text-xs">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent xsm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 xsm:text-xs">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent xsm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 xsm:text-xs">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent xsm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors xsm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors xsm:text-sm"
              >
                {editingUser ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // User Details Modal Component
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
          className="bg-white rounded-lg w-full max-w-md xsm:max-w-xs sm:max-w-sm md:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold xsm:text-lg">User Details</h2>
            <button
              onClick={() => {
                setIsDetailsModalOpen(false);
                setSelectedUser(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 xsm:text-base">{selectedUser.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(selectedUser.role)}
                  <span className="text-sm text-gray-600 capitalize">{selectedUser.role}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Email className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 xsm:text-sm">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900 xsm:text-sm">{selectedUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarToday className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-gray-900 xsm:text-sm">
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Login className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-900 xsm:text-sm">
                    {new Date(selectedUser.lastLogin).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors xsm:text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleEditUser(selectedUser);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 xsm:text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Delete Confirmation Modal Component
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
          className="bg-white rounded-lg w-full max-w-sm xsm:max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Warning className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 xsm:text-base">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500 xsm:text-xs">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6 xsm:text-sm">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This will permanently remove all user data.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors xsm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors xsm:text-sm"
              >
                Delete User
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 xsm:px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 xsm:text-xl sm:text-2xl md:text-3xl">
          User Management
        </h1>
        <p className="text-gray-600 xsm:text-sm">Manage your users efficiently</p>
      </motion.div>

      {/* Search and Add User Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent xsm:text-sm"
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddUser}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors xsm:text-sm"
        >
          <Add className="w-5 h-5" />
          Add User
        </motion.button>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xsm:px-2 xsm:py-2">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xsm:px-2 xsm:py-2 xsm:hidden sm:table-cell">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xsm:px-2 xsm:py-2 xsm:hidden md:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xsm:px-2 xsm:py-2 xsm:hidden lg:table-cell">
                  Join Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xsm:px-2 xsm:py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 xsm:px-2 xsm:py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold xsm:h-8 xsm:w-8 xsm:text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4 xsm:ml-2">
                          <div className="text-sm font-medium text-gray-900 xsm:text-xs">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 xsm:text-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 xsm:px-2 xsm:py-3 xsm:hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm text-gray-900 capitalize xsm:text-xs">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 xsm:px-2 xsm:py-3 xsm:hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 xsm:px-2 xsm:py-3 xsm:hidden lg:table-cell">
                      <div className="text-sm text-gray-900 xsm:text-xs">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 xsm:px-2 xsm:py-3">
                      <div className="flex items-center gap-2 xsm:gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-800 p-1 xsm:p-0.5"
                          title="View Details"
                        >
                          <Visibility className="w-5 h-5 xsm:w-4 xsm:h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditUser(user)}
                          className="text-green-600 hover:text-green-800 p-1 xsm:p-0.5"
                          title="Edit User"
                        >
                          <Edit className="w-5 h-5 xsm:w-4 xsm:h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-800 p-1 xsm:p-0.5"
                          title="Delete User"
                        >
                          <Delete className="w-5 h-5 xsm:w-4 xsm:h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isUserModalOpen && <UserModal />}
        {isDetailsModalOpen && <UserDetailsModal />}
        {isDeleteModalOpen && <DeleteConfirmationModal />}
      </AnimatePresence>
    </div>
  );
};

