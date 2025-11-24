// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import {
//   Search,
//   Add,
//   Edit,
//   Delete,
//   Visibility,
//   AdminPanelSettings,
//   Person,
//   Close,
//   Email,
//   Phone,
//   CalendarToday,
//   Login,
//   Warning,
//   Refresh,
//   VerifiedUser,
//   Notifications,
//   Security,
//   EditAttributes,
//   SwapVert
// } from '@mui/icons-material';

// export const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editingUser, setEditingUser] = useState(null);
//   const [statusEditingUser, setStatusEditingUser] = useState(null);
//   const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const API_URL = 'https://nexusbackend-hdyk.onrender.com/admin';

//   // Fetch users from API
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(API_URL);

//       if (response.data.success) {
//         setUsers(response.data.data.users || []);
//         setPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0 });
//       } else {
//         setUsers([]);
//         console.warn('API returned unsuccessful response:', response.data);
//       }
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError('Failed to fetch users. Please try again.');
//       toast.error('Failed to fetch users');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Safe filtering with array check
//   const filteredUsers = Array.isArray(users)
//     ? users.filter(user =>
//         user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user?.status?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   const handleAddUser = () => {
//     setEditingUser(null);
//     setIsUserModalOpen(true);
//   };

//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setIsUserModalOpen(true);
//   };

//   const handleEditStatus = (user) => {
//     setStatusEditingUser(user);
//     setIsStatusModalOpen(true);
//   };

//   const handleViewUser = (user) => {
//     setSelectedUser(user);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteUser = (user) => {
//     setSelectedUser(user);
//     setIsDeleteModalOpen(true);
//   };

//   const handleSaveUser = async (userData) => {
//     try {
//       // Validate passwords match
//       if (!editingUser && userData.password !== userData.confirmPassword) {
//         toast.error('Passwords do not match');
//         return;
//       }

//       // Since this is a demo, we'll simulate API call
//       if (editingUser) {
//         toast.info('User update simulated');
//       } else {
//         toast.success('User created successfully!');
//       }

//       setIsUserModalOpen(false);
//       setEditingUser(null);

//       // In real implementation, you would make API call here
//       // await axios.post/put to your admin endpoint
//     } catch (err) {
//       console.error('Error saving user:', err);
//       toast.error('Failed to save user');
//     }
//   };

//   const handleUpdateStatus = async (statusData) => {
//     try {
//       // Simulate API call to update user status
//       const updatedUsers = users.map(user =>
//         user._id === statusEditingUser._id
//           ? {
//               ...user,
//               status: statusData.status,
//               isVerified: statusData.isVerified,
//               isActive: statusData.isActive
//             }
//           : user
//       );

//       setUsers(updatedUsers);
//       toast.success(`User status updated successfully!`);
//       setIsStatusModalOpen(false);
//       setStatusEditingUser(null);

//       // In real implementation, you would make API call here:
//       // await axios.patch(`${API_URL}/auth/${statusEditingUser._id}/status`, statusData);
//     } catch (err) {
//       console.error('Error updating user status:', err);
//       toast.error('Failed to update user status');
//     }
//   };

//   const confirmDelete = async () => {
//     try {
//       setDeleteLoading(true);

//       // Simulate API call with random success/failure for demo
//       const isSuccess = Math.random() > 0.3; // 70% success rate for demo

//       if (isSuccess) {
//         // Remove user from local state
//         const updatedUsers = users.filter(user => user._id !== selectedUser._id);
//         setUsers(updatedUsers);

//         toast.success(`User "${selectedUser.name}" deleted successfully!`);
//         setIsDeleteModalOpen(false);
//         setSelectedUser(null);
//       } else {
//         // Simulate failure
//         throw new Error('Failed to delete user. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       toast.error(err.message || 'Failed to delete user');
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'admin':
//         return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
//       case 'user':
//         return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
//       default:
//         return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
//     }
//   };

//   const getVerificationColor = (isVerified) => {
//     return isVerified
//       ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
//       : 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
//   };

//   const getActiveColor = (isActive) => {
//     return isActive
//       ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white'
//       : 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
//   };

//   const getRoleIcon = (status) => {
//     return status === 'admin' ?
//       <AdminPanelSettings className="w-4 h-4 text-white" /> :
//       <Person className="w-4 h-4 text-white" />;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Updated User Modal Component with Password Fields
//   const UserModal = () => {
//     const [formData, setFormData] = useState({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       phone: '',
//       status: 'user',
//       isVerified: false,
//       isActive: true
//     });

//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//       if (editingUser) {
//         setFormData({
//           name: editingUser.name || '',
//           email: editingUser.email || '',
//           password: '', // Don't pre-fill passwords for security
//           confirmPassword: '',
//           phone: editingUser.profile?.phone || '',
//           status: editingUser.status || 'user',
//           isVerified: editingUser.isVerified || false,
//           isActive: editingUser.isActive !== undefined ? editingUser.isActive : true
//         });
//       } else {
//         // Reset form for new user
//         setFormData({
//           name: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           phone: '',
//           status: 'user',
//           isVerified: false,
//           isActive: true
//         });
//       }
//       setErrors({});
//     }, [editingUser]);

//     const validateForm = () => {
//       const newErrors = {};

//       if (!formData.name.trim()) {
//         newErrors.name = 'Name is required';
//       }

//       if (!formData.email.trim()) {
//         newErrors.email = 'Email is required';
//       } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//         newErrors.email = 'Email is invalid';
//       }

//       if (!editingUser) {
//         if (!formData.password) {
//           newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//           newErrors.password = 'Password must be at least 6 characters';
//         }

//         if (!formData.confirmPassword) {
//           newErrors.confirmPassword = 'Please confirm password';
//         } else if (formData.password !== formData.confirmPassword) {
//           newErrors.confirmPassword = 'Passwords do not match';
//         }
//       }

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       if (validateForm()) {
//         handleSaveUser(formData);
//       }
//     };

//     const handleChange = (e) => {
//       const { name, value, type, checked } = e.target;
//       setFormData({
//         ...formData,
//         [name]: type === 'checkbox' ? checked : value
//       });

//       // Clear error when user starts typing
//       if (errors[name]) {
//         setErrors({
//           ...errors,
//           [name]: ''
//         });
//       }
//     };

//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//         onClick={() => {
//           setIsUserModalOpen(false);
//           setEditingUser(null);
//         }}
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl sticky top-0 z-10">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold text-white">
//                 {editingUser ? 'Edit User' : 'Add New User'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setIsUserModalOpen(false);
//                   setEditingUser(null);
//                 }}
//                 className="text-white hover:text-gray-200 transition-colors"
//               >
//                 <Close className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-4">
//             {/* Name Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
//                   errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                 }`}
//                 placeholder="Enter full name"
//                 required
//               />
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
//                   errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                 }`}
//                 placeholder="Enter email address"
//                 required
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Fields - Only show for new users */}
//             {!editingUser && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Password *
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
//                       errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder="Enter password"
//                     required
//                   />
//                   {errors.password && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Confirm Password *
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
//                       errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder="Confirm password"
//                     required
//                   />
//                   {errors.confirmPassword && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Phone Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
//                 placeholder="Enter phone number"
//               />
//             </div>

//             {/* Status Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Role
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
//               >
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             {/* Checkboxes */}
//             <div className="space-y-3">
//               <label className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   name="isVerified"
//                   checked={formData.isVerified}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Email Verified
//                 </span>
//               </label>

//               <label className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Active Account
//                 </span>
//               </label>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-3 pt-6">
//               <motion.button
//                 type="button"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => {
//                   setIsUserModalOpen(false);
//                   setEditingUser(null);
//                 }}
//                 className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
//               >
//                 Cancel
//               </motion.button>
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg"
//               >
//                 {editingUser ? 'Update User' : 'Create User'}
//               </motion.button>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//     );
//   };

//   // Enhanced Delete Confirmation Modal Component
//   const DeleteConfirmationModal = () => {
//     if (!selectedUser) return null;

//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//         onClick={() => {
//           if (!deleteLoading) {
//             setIsDeleteModalOpen(false);
//             setSelectedUser(null);
//           }
//         }}
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-t-2xl">
//             <div className="flex items-center gap-3">
//               <div className="flex-shrink-0 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
//                 <Warning className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-white">Delete User</h3>
//                 <p className="text-red-100 text-sm">This action cannot be undone</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="flex items-center gap-4 mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
//               <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
//                 {selectedUser.name?.split(' ').map(n => n[0]).join('')}
//               </div>
//               <div>
//                 <h4 className="font-semibold text-red-900 dark:text-red-100">{selectedUser.name}</h4>
//                 <p className="text-sm text-red-700 dark:text-red-300">{selectedUser.email}</p>
//               </div>
//             </div>

//             <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
//               Are you sure you want to delete <strong className="text-black dark:text-white">{selectedUser.name}</strong>? This will permanently remove all user data.
//             </p>

//             <div className="flex justify-end gap-3">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => {
//                   setIsDeleteModalOpen(false);
//                   setSelectedUser(null);
//                 }}
//                 disabled={deleteLoading}
//                 className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={confirmDelete}
//                 disabled={deleteLoading}
//                 className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {deleteLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Delete className="w-4 h-4" />
//                     Delete User
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     );
//   };

//   // ... (rest of the code remains the same - StatusEditModal, UserDetailsModal, loading states, etc.)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header and Search Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
//                 User Management
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 text-lg">
//                 Manage {pagination.total} users efficiently with advanced controls
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={fetchUsers}
//                 className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
//               >
//                 <Refresh className="w-4 h-4" />
//                 Refresh
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Search and Add User Section */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8"
//         >
//           <div className="relative w-full lg:w-96">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search users by name, email, or status..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-lg"
//             />
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleAddUser}
//             className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-bold shadow-xl flex items-center justify-center gap-3"
//           >
//             <Add className="w-5 h-5" />
//             Add New User
//           </motion.button>
//         </motion.div>

//         {/* Users Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//         >
//           <AnimatePresence>
//             {filteredUsers.map((user, index) => (
//               <motion.div
//                 key={user._id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 whileHover={{ y: -5, scale: 1.02 }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
//               >
//                 {/* Card content remains the same */}
//                 <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
//                         {user.name?.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-bold text-white">{user.name}</h3>
//                         <p className="text-blue-100 text-sm">{user.email}</p>
//                       </div>
//                     </div>
//                     {getRoleIcon(user.status)}
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
//                       {user.status}
//                     </span>
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(user.isVerified)}`}>
//                       <VerifiedUser className="w-3 h-3" />
//                       {user.isVerified ? 'Verified' : 'Unverified'}
//                     </span>
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getActiveColor(user.isActive)}`}>
//                       {user.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="space-y-3 mb-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">Login Count</span>
//                       <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
//                         {user.loginCount || 0}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
//                       <span className="text-sm text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">Last Login</span>
//                       <span className="text-sm text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</span>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-2">
//                     <div className="flex gap-2">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleViewUser(user)}
//                         className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
//                       >
//                         <Visibility className="w-4 h-4" />
//                         View
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleEditUser(user)}
//                         className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
//                       >
//                         <Edit className="w-4 h-4" />
//                         Edit
//                       </motion.button>
//                     </div>
//                     <div className="flex gap-2">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleEditStatus(user)}
//                         className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
//                       >
//                         <SwapVert className="w-4 h-4" />
//                         Status
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleDeleteUser(user)}
//                         className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
//                       >
//                         <Delete className="w-4 h-4" />
//                         Delete
//                       </motion.button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </motion.div>

//         {/* Empty State */}
//         {filteredUsers.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="text-center py-16"
//           >
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 max-w-md mx-auto">
//               <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No users found</h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-6">
//                 {searchTerm ? 'Try adjusting your search terms' : 'Add your first user to get started'}
//               </p>
//               {!searchTerm && (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleAddUser}
//                   className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium"
//                 >
//                   Add First User
//                 </motion.button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Modals */}
//       <AnimatePresence>
//         {isUserModalOpen && <UserModal />}
//         {isDetailsModalOpen && <UserDetailsModal />}
//         {isDeleteModalOpen && <DeleteConfirmationModal />}
//         {isStatusModalOpen && <StatusEditModal />}
//       </AnimatePresence>
//     </div>
//   );
// };

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
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
  CalendarToday,
  Login,
  Warning,
  Refresh,
  VerifiedUser,
  CheckCircle,
  Error,
  SwapVert,
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [statusEditingUser, setStatusEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 9, // Show 9 users per page
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "https://nexusbackend-hdyk.onrender.com";

  // Fetch users from API
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/admin?page=${page}&limit=${pagination.limit}`);

      if (response.data.success) {
        setUsers(response.data.data.users || []);
        setPagination(
          response.data.data.pagination || { 
            current: page, 
            pages: 1, 
            total: 0,
            limit: pagination.limit
          }
        );
      } else {
        setUsers([]);
        console.warn("API returned unsuccessful response:", response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.current);
  }, []);

  // Safe filtering with array check
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchUsers(newPage);
    }
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(pagination.pages);
  const handlePrevPage = () => handlePageChange(pagination.current - 1);
  const handleNextPage = () => handlePageChange(pagination.current + 1);

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
      setSaveLoading(true);

      // Validate passwords match
      if (!editingUser && userData.password !== userData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      let response;

      if (editingUser) {
        // Update existing user - only send name and email
        response = await axios.put(`${API_URL}/auth/${editingUser._id}`, {
          name: userData.name,
          email: userData.email,
        });
      } else {
        // Create new user - only send name, email, password, and confirmPassword
        response = await axios.post(`${API_URL}/auth/register`, {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
        });
      }

      if (response.data.success) {
        setIsSuccessModalOpen(true);
        setIsUserModalOpen(false);
        setEditingUser(null);
        fetchUsers(pagination.current); // Refresh the user list on current page
        toast.success(
          editingUser
            ? "User updated successfully!"
            : "User created successfully!"
        );
      } else {
        throw new Error(response.data.message || "Failed to save user");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      // Set the error message for the error modal
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      err.message || 
                      "Failed to save user";
      setErrorMessage(errorMsg);
      setIsErrorModalOpen(true);
      toast.error(errorMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      // Simulate API call to update user status
      const updatedUsers = users.map((user) =>
        user._id === statusEditingUser._id
          ? {
              ...user,
              status: statusData.status,
              isVerified: statusData.isVerified,
              isActive: statusData.isActive,
            }
          : user
      );

      setUsers(updatedUsers);
      toast.success(`User status updated successfully!`);
      setIsStatusModalOpen(false);
      setStatusEditingUser(null);

      // In real implementation, you would make API call here:
      // await axios.patch(`${API_URL}/auth/${statusEditingUser._id}/status`, statusData);
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Failed to update user status");
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      // Simulate API call with random success/failure for demo
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo

      if (isSuccess) {
        // Remove user from local state
        const updatedUsers = users.filter(
          (user) => user._id !== selectedUser._id
        );
        setUsers(updatedUsers);

        toast.success(`User "${selectedUser.name}" deleted successfully!`);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        
        // If this was the last user on the page and we're not on page 1, go to previous page
        if (updatedUsers.length === 0 && pagination.current > 1) {
          fetchUsers(pagination.current - 1);
        }
      } else {
        // Simulate failure
        throw new Error("Failed to delete user. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "admin":
        return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white";
      case "user":
        return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getVerificationColor = (isVerified) => {
    return isVerified
      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
      : "bg-gradient-to-r from-orange-500 to-red-600 text-white";
  };

  const getActiveColor = (isActive) => {
    return isActive
      ? "bg-gradient-to-r from-green-400 to-teal-500 text-white"
      : "bg-gradient-to-r from-red-400 to-pink-500 text-white";
  };

  const getRoleIcon = (status) => {
    return status === "admin" ? (
      <AdminPanelSettings className="w-4 h-4 text-white" />
    ) : (
      <Person className="w-4 h-4 text-white" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = pagination.pages;
    const currentPage = pagination.current;
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Success Modal Component
  const SuccessModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setIsSuccessModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Success!</h3>
              <p className="text-green-100 text-sm">
                User operation completed successfully
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {editingUser
              ? "User has been updated successfully!"
              : "New user has been created successfully!"}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSuccessModalOpen(false)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Error Modal Component with detailed error message
  const ErrorModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setIsErrorModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
              <Error className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Error</h3>
              <p className="text-red-100 text-sm">Operation failed</p>
            </div>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-red-700 dark:text-red-300 font-medium mb-2">
              Error Details:
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">
              {errorMessage}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {editingUser
              ? "Failed to update user. Please check the error details above and try again."
              : "Failed to create user. Please check the error details above and try again."}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsErrorModalOpen(false)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

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
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl sticky top-0 z-10">
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
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {selectedUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedUser.email}
                </p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      selectedUser.status
                    )}`}
                  >
                    {getRoleIcon(selectedUser.status)}
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Email className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <CalendarToday className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Login className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Login
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedUser.lastLogin) || "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ${getVerificationColor(
                  selectedUser.isVerified
                )}`}
              >
                <VerifiedUser className="w-4 h-4" />
                {selectedUser.isVerified
                  ? "Email Verified"
                  : "Email Not Verified"}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ${getActiveColor(
                  selectedUser.isActive
                )}`}
              >
                {selectedUser.isActive ? "Account Active" : "Account Inactive"}
              </span>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedUser.loginCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Login Count
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedUser.notificationCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Status Edit Modal Component
  const StatusEditModal = () => {
    const [formData, setFormData] = useState({
      status: "user",
      isVerified: false,
      isActive: true,
    });

    useEffect(() => {
      if (statusEditingUser) {
        setFormData({
          status: statusEditingUser.status || "user",
          isVerified: statusEditingUser.isVerified || false,
          isActive:
            statusEditingUser.isActive !== undefined
              ? statusEditingUser.isActive
              : true,
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
        [name]: type === "checkbox" ? checked : value,
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
              <h2 className="text-xl font-bold text-white">
                Update User Status
              </h2>
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
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold">
                {statusEditingUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {statusEditingUser.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {statusEditingUser.email}
                </p>
              </div>
            </div>

            {/* Status Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Role
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Verified
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Account
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
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
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 font-medium shadow-lg"
              >
                Update Status
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Updated User Modal Component - Removed status, isVerified, and isActive fields
  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
      if (editingUser) {
        setFormData({
          name: editingUser.name || "",
          email: editingUser.email || "",
          password: "", // Don't pre-fill passwords for security
          confirmPassword: "",
        });
      } else {
        // Reset form for new user
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
      setErrors({});
    }, [editingUser]);

    const validateForm = () => {
      const newErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!editingUser) {
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        handleSaveUser(formData);
      }
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
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
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? "Edit User" : "Add New User"}
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
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter full name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter email address"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Fields - Only show for new users */}
            {!editingUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Enter password"
                    required
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Confirm password"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Action Buttons */}
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
                disabled={saveLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {editingUser ? "Updating..." : "Creating..."}
                  </>
                ) : editingUser ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Enhanced Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => {
    if (!selectedUser) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          if (!deleteLoading) {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }
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
                <p className="text-red-100 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                {selectedUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  {selectedUser.name}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Are you sure you want to delete{" "}
              <strong className="text-black dark:text-white">
                {selectedUser.name}
              </strong>
              ? This will permanently remove all user data.
            </p>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                disabled={deleteLoading}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Delete className="w-4 h-4" />
                    Delete User
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header and Search Section */}
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
                Showing {users.length} of {pagination.total} users (Page {pagination.current} of {pagination.pages})
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchUsers(pagination.current)}
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

        {/* Users Grid */}
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
                {/* Card content remains the same */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {user.name}
                        </h3>
                        <p className="text-blue-100 text-sm">{user.email}</p>
                      </div>
                    </div>
                    {getRoleIcon(user.status)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(
                        user.isVerified
                      )}`}
                    >
                      <VerifiedUser className="w-3 h-3" />
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getActiveColor(
                        user.isActive
                      )}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Login Count
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                        {user.loginCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Created
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last Login
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(user.lastLogin)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
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

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            {/* First Page Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFirstPage}
              disabled={pagination.current === 1}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FirstPage className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Previous Page Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevPage}
              disabled={pagination.current === 1}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>

            {/* Page Numbers */}
            <div className="flex gap-2 mx-4">
              {generatePageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        pagination.current === page
                          ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </motion.button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next Page Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextPage}
              disabled={pagination.current === pagination.pages}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Last Page Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLastPage}
              disabled={pagination.current === pagination.pages}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LastPage className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add your first user to get started"}
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
        {isSuccessModalOpen && <SuccessModal />}
        {isErrorModalOpen && <ErrorModal />}
      </AnimatePresence>
    </div>
  );
};