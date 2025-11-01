/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/CheckoutManagement.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  Person,
  CreditCard,
  Security,
  CheckCircle,
  Clear,
  Add,
  Remove,
  Discount,
  Receipt,
  Lock,
  Schedule,
  Google,
  PhoneIphone,
  Search,
  FilterList,
  Delete,
  Edit,
  Visibility,
  Refresh,
  Archive,
  Unarchive,
  TrackChanges,
  Warning,
  Email,
  Phone,
  Business,
  CalendarToday,
  AccessTime,
  AttachMoney,
  Category,
  Flag,
  NewReleases,
  DoneAll,
  Send,
  Cancel,
} from "@mui/icons-material";

export const UserCheckoutManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusEditingOrder, setStatusEditingOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const API_URL = "https://nexusbackend-hdyk.onrender.com/orders";

  // Get current user email from localStorage
  const getCurrentUserEmail = () => {
    try {
      const possibleKeys = ['user', 'userData', 'authUser', 'currentUser', 'userInfo'];
      
      for (const key of possibleKeys) {
        const userData = localStorage.getItem(key);
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            let userEmail = '';
            
            // Handle different user data structures
            if (parsedUser.user?.email) {
              userEmail = parsedUser.user.email;
            } else if (parsedUser.data?.user?.email) {
              userEmail = parsedUser.data.user.email;
            } else if (parsedUser.email) {
              userEmail = parsedUser.email;
            } else if (parsedUser.data?.email) {
              userEmail = parsedUser.data.email;
            }

            if (userEmail) {
              setCurrentUserEmail(userEmail.toLowerCase());
              console.log("Found user email:", userEmail);
              return userEmail.toLowerCase();
            }
          } catch (parseError) {
            console.warn(`Failed to parse user data from key ${key}:`, parseError);
          }
        }
      }
      
      // If no email found, try to find any email in localStorage
      const allStorage = { ...localStorage };
      for (const [key, value] of Object.entries(allStorage)) {
        if (value.includes('@')) {
          try {
            const parsedData = JSON.parse(value);
            if (parsedData?.email) {
              setCurrentUserEmail(parsedData.email.toLowerCase());
              console.log("Found email in key:", key, parsedData.email);
              return parsedData.email.toLowerCase();
            }
          } catch (e) {
            // Not JSON, check if it's a direct email string
            if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              setCurrentUserEmail(value.toLowerCase());
              console.log("Found direct email in key:", key, value);
              return value.toLowerCase();
            }
          }
        }
      }
      
      console.warn("No user email found in localStorage");
      return null;
    } catch (err) {
      console.error("Error getting user email:", err);
      return null;
    }
  };

  // Fetch orders from API and filter by current user's email
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userEmail = getCurrentUserEmail();
      const response = await axios.get(API_URL);
      
      if (response.data.success) {
        const allOrders = response.data.data.orders || [];
        // Filter orders to show only those with current user's email
        const userOrders = userEmail 
          ? allOrders.filter(order => 
              order.customer?.email?.toLowerCase() === userEmail ||
              order.email?.toLowerCase() === userEmail
            )
          : [];
        
        setOrders(userOrders);
        
        if (userEmail && userOrders.length > 0) {
          toast.success(`Loaded ${userOrders.length} of your orders!`);
        } else if (userEmail) {
          toast.info("No orders found for your email address.");
        } else {
          toast.warning("Please log in to view your orders.");
        }
      } else {
        setOrders([]);
        console.warn('API returned unsuccessful response:', response.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load your orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search and filters (only user's orders are shown)
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleEditStatus = (order) => {
    setStatusEditingOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleDeleteOrder = (order) => {
    setDeleteOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleSaveOrder = async (orderData) => {
    try {
      // Simulate API call
      const updatedOrders = orders.map(order => 
        order._id === editingOrder._id 
          ? { ...order, ...orderData }
          : order
      );
      setOrders(updatedOrders);
      toast.success('Your order updated successfully!');
      setIsOrderModalOpen(false);
      setEditingOrder(null);
    } catch (err) {
      console.error('Error saving order:', err);
      toast.error('Failed to update order');
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      const updatedOrders = orders.map(order => 
        order._id === statusEditingOrder._id 
          ? { 
              ...order, 
              status: statusData.status,
              priority: statusData.priority,
              isArchived: statusData.isArchived
            } 
          : order
      );
      
      setOrders(updatedOrders);
      toast.success(`Your order status updated successfully!`);
      setIsStatusModalOpen(false);
      setStatusEditingOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
    }
  };

  const confirmDelete = async () => {
    try {
      const updatedOrders = orders.filter(order => order._id !== deleteOrder._id);
      setOrders(updatedOrders);
      toast.success('Your order deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeleteOrder(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Failed to delete order');
    }
  };

  // Status and Priority configurations
  const statusOptions = [
    { value: "pending", label: "Pending", color: "blue", icon: <NewReleases /> },
    { value: "confirmed", label: "Confirmed", color: "green", icon: <CheckCircle /> },
    { value: "processing", label: "Processing", color: "orange", icon: <Schedule /> },
    { value: "shipped", label: "Shipped", color: "purple", icon: <LocalShipping /> },
    { value: "delivered", label: "Delivered", color: "emerald", icon: <DoneAll /> },
    { value: "cancelled", label: "Cancelled", color: "red", icon: <Cancel /> },
    { value: "refunded", label: "Refunded", color: "gray", icon: <Receipt /> }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "gray", icon: <Flag /> },
    { value: "medium", label: "Medium", color: "blue", icon: <Flag /> },
    { value: "high", label: "High", color: "orange", icon: <Flag /> },
    { value: "urgent", label: "Urgent", color: "red", icon: <Warning /> }
  ];

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
      red: "bg-red-100 text-red-800 border-red-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colorMap[statusConfig?.color] || colorMap.gray;
  };

  const getPriorityColor = (priority) => {
    const priorityConfig = priorityOptions.find(p => p.value === priority);
    const colorMap = {
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200"
    };
    return colorMap[priorityConfig?.color] || colorMap.gray;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}m ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    } else {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    }
  };

  // Order Form Modal Component
  const OrderFormModal = () => {
    const [formData, setFormData] = useState({
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
      },
      items: [],
      status: "pending",
      priority: "medium",
      shippingMethod: "standard",
      paymentMethod: "credit-card",
      notes: ""
    });

    useEffect(() => {
      if (editingOrder) {
        setFormData({
          customer: editingOrder.customer || {},
          items: editingOrder.items || [],
          status: editingOrder.status || "pending",
          priority: editingOrder.priority || "medium",
          shippingMethod: editingOrder.shippingMethod || "standard",
          paymentMethod: editingOrder.paymentMethod || "credit-card",
          notes: editingOrder.notes || ""
        });
      } else {
        // Pre-fill email with current user's email for new orders
        const userEmail = getCurrentUserEmail();
        if (userEmail) {
          setFormData(prev => ({
            ...prev,
            customer: {
              ...prev.customer,
              email: userEmail
            }
          }));
        }
      }
    }, [editingOrder]);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveOrder(formData);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.startsWith('customer.')) {
        const field = name.split('.')[1];
        setFormData({
          ...formData,
          customer: {
            ...formData.customer,
            [field]: value
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
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
          setIsOrderModalOpen(false);
          setEditingOrder(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  {editingOrder ? 'Edit Your Order' : 'New Order'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setEditingOrder(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-6 h-6" />
              </button>
            </div>
            {!editingOrder && currentUserEmail && (
              <p className="text-blue-100 text-sm mt-2">
                This order will be associated with your email: {currentUserEmail}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="customer.firstName"
                    value={formData.customer.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="customer.lastName"
                    value={formData.customer.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer.email"
                    value={formData.customer.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    readOnly={!!editingOrder}
                  />
                  {editingOrder && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      This is your order - you can edit other details
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Order Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setEditingOrder(null);
                }}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                {editingOrder ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Status Edit Modal Component
  const StatusEditModal = () => {
    const [formData, setFormData] = useState({
      status: "pending",
      priority: "medium",
      isArchived: false
    });

    useEffect(() => {
      if (statusEditingOrder) {
        setFormData({
          status: statusEditingOrder.status || "pending",
          priority: statusEditingOrder.priority || "medium",
          isArchived: statusEditingOrder.isArchived || false
        });
      }
    }, [statusEditingOrder]);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateStatus(formData);
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    };

    if (!statusEditingOrder) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsStatusModalOpen(false);
          setStatusEditingOrder(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <TrackChanges className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Update Order Status</h2>
              </div>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingOrder(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-6 h-6" />
              </button>
            </div>
            <p className="text-purple-100 text-sm mt-2">Update status for your order: {statusEditingOrder.orderNumber}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {statusEditingOrder.customer?.firstName?.charAt(0)}{statusEditingOrder.customer?.lastName?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {statusEditingOrder.customer?.firstName} {statusEditingOrder.customer?.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{statusEditingOrder.orderNumber}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Your Order</span>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Order Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => (
                  <label 
                    key={status.value}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.status === status.value 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 mb-1 ${
                      formData.status === status.value ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {status.icon}
                    </div>
                    <span className={`text-sm font-medium text-center ${
                      formData.status === status.value ? 'text-purple-900 dark:text-purple-100' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Archive Option */}
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
              <div className="flex items-center gap-3">
                {formData.isArchived ? <Archive className="w-5 h-5 text-orange-500" /> : <Unarchive className="w-5 h-5 text-gray-500" />}
                <div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Archive Order</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Move to archived orders</p>
                </div>
              </div>
              <input
                type="checkbox"
                name="isArchived"
                checked={formData.isArchived}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingOrder(null);
                }}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!deleteOrder) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsDeleteModalOpen(false);
          setDeleteOrder(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Delete className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Delete Your Order</h2>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteOrder(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <Warning className="w-6 h-6 text-red-500" />
              <p className="text-red-700 dark:text-red-300 text-sm">
                This action cannot be undone. Your order will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-6">
              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                {deleteOrder.customer?.firstName?.charAt(0)}{deleteOrder.customer?.lastName?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {deleteOrder.customer?.firstName} {deleteOrder.customer?.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{deleteOrder.orderNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(deleteOrder.total || 0)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Your Order</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteOrder(null);
                }}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete My Order
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // View Order Modal
  const ViewOrderModal = () => {
    if (!viewingOrder) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setIsViewModalOpen(false);
          setViewingOrder(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  {viewingOrder.customer?.firstName?.charAt(0)}{viewingOrder.customer?.lastName?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-white truncate">
                    {viewingOrder.customer?.firstName} {viewingOrder.customer?.lastName}
                  </h2>
                  <p className="text-blue-100 text-lg truncate">{viewingOrder.orderNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-green-200 text-sm">Your Order</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingOrder(null);
                }}
                className="text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
              >
                <Clear className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(viewingOrder.status)}`}>
                {statusOptions.find(s => s.value === viewingOrder.status)?.icon}
                {statusOptions.find(s => s.value === viewingOrder.status)?.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(viewingOrder.priority)}`}>
                {priorityOptions.find(p => p.value === viewingOrder.priority)?.icon}
                {priorityOptions.find(p => p.value === viewingOrder.priority)?.label}
              </span>
              {viewingOrder.isArchived && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                  <Archive className="w-4 h-4" />
                  Archived
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Person className="text-blue-500 w-5 h-5" />
                  Customer Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Email className="text-gray-500 w-5 h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 dark:text-white truncate">{viewingOrder.customer?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Phone className="text-gray-500 w-5 h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900 dark:text-white">{viewingOrder.customer?.phone}</p>
                    </div>
                  </div>

                  {viewingOrder.customer?.address && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Business className="text-gray-500 w-5 h-5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900 dark:text-white">{viewingOrder.customer?.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="text-green-500 w-5 h-5" />
                  Order Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {formatCurrency(viewingOrder.total || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500">Items</span>
                    <span className="font-semibold">{viewingOrder.items?.length || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500">Payment Method</span>
                    <span className="font-semibold capitalize">{viewingOrder.paymentMethod?.replace('-', ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500">Shipping Method</span>
                    <span className="font-semibold capitalize">{viewingOrder.shippingMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {viewingOrder.items && viewingOrder.items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="text-orange-500 w-5 h-5" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {viewingOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AccessTime className="text-orange-500 w-5 h-5" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                    {formatDate(viewingOrder.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                    {formatDate(viewingOrder.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditStatus(viewingOrder);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <TrackChanges className="w-5 h-5" />
                Update Status
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditOrder(viewingOrder);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Order
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteOrder(viewingOrder);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Delete className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Order Card Component
  const OrderCard = ({ order }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
              {order.customer?.firstName?.charAt(0)}{order.customer?.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white truncate">
                {order.customer?.firstName} {order.customer?.lastName}
              </h3>
              <p className="text-blue-100 text-sm truncate">{order.orderNumber}</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3 text-green-300" />
                <span className="text-green-200 text-xs">Your Order</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
              {statusOptions.find(s => s.value === order.status)?.icon}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
              {priorityOptions.find(p => p.value === order.priority)?.icon}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
            {statusOptions.find(s => s.value === order.status)?.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(order.priority)}`}>
            {priorityOptions.find(p => p.value === order.priority)?.label}
          </span>
          {order.isArchived && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 border border-orange-200">
              <Archive className="w-4 h-4" />
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Email className="w-4 h-4" />
            <span className="truncate flex-1">{order.customer?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <AttachMoney className="w-4 h-4" />
            <span className="font-semibold text-blue-600">
              {formatCurrency(order.total || 0)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ShoppingCart className="w-4 h-4" />
            <span>{order.items?.length || 0} items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CalendarToday className="w-4 h-4" />
            <span>{formatTimeAgo(order.createdAt)}</span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {order.items.slice(0, 2).map(item => item.name).join(', ')}
              {order.items.length > 2 && ` and ${order.items.length - 2} more...`}
            </p>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleViewOrder(order)}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
          >
            <Visibility className="w-4 h-4" />
            View
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleEditStatus(order)}
              className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Update Status"
            >
              <TrackChanges className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEditOrder(order)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit Order"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteOrder(order)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete Order"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
                My Orders
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage your {orders.length} orders and track their status
                {currentUserEmail && (
                  <span className="block text-sm text-green-600 dark:text-green-400">
                    Showing orders for: {currentUserEmail}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-colors font-medium shadow-lg flex items-center gap-2"
              >
                <Refresh className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="lg:col-span-1">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 max-w-md mx-auto">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : currentUserEmail 
                      ? `No orders found for your email: ${currentUserEmail}`
                      : 'Please log in to view your orders'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isOrderModalOpen && <OrderFormModal />}
        {isStatusModalOpen && <StatusEditModal />}
        {isDeleteModalOpen && <DeleteConfirmationModal />}
        {isViewModalOpen && <ViewOrderModal />}
      </AnimatePresence>
    </div>
  );
};