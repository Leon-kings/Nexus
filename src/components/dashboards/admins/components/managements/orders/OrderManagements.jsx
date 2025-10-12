/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/ElectronicOrdersManagement.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Add,
  Clear,
  Delete,
  Edit,
  Inventory,
  Search,
  Visibility,
  Warning,
  LocalShipping,
  Payment,
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Phone,
  Email,
  LocationOn,
  Receipt,
  TrackChanges,
  Assignment,
  Star,
  StarBorder
} from '@mui/icons-material';

export const ElectronicOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editingOrder, setEditingOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    products: [],
    totalAmount: '',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    shippingMethod: 'standard',
    trackingNumber: '',
    notes: ''
  });

  // Mock API base URL
  const API_BASE = 'https://jsonplaceholder.typicode.com';

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'default' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'info' },
    { value: 'processing', label: 'Processing', color: 'primary' },
    { value: 'shipped', label: 'Shipped', color: 'success' },
    { value: 'delivered', label: 'Delivered', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
    { value: 'refunded', label: 'Refunded', color: 'error' }
  ];

  // Payment status options
  const paymentOptions = [
    { value: 'all', label: 'All Payments', color: 'default' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'paid', label: 'Paid', color: 'success' },
    { value: 'failed', label: 'Failed', color: 'error' },
    { value: 'refunded', label: 'Refunded', color: 'error' },
    { value: 'partially_paid', label: 'Partially Paid', color: 'warning' }
  ];

  // Electronic products for order items
  const electronicProducts = [
    { id: 1, name: 'iPhone 15 Pro', category: 'Smartphones', price: 999, sku: 'IP15P-256' },
    { id: 2, name: 'Samsung Galaxy S24', category: 'Smartphones', price: 849, sku: 'SGS24-256' },
    { id: 3, name: 'MacBook Pro 16"', category: 'Laptops', price: 2399, sku: 'MBP16-1TB' },
    { id: 4, name: 'Dell XPS 15', category: 'Laptops', price: 1799, sku: 'DXPS15-512' },
    { id: 5, name: 'iPad Air', category: 'Tablets', price: 599, sku: 'IPAIR-128' },
    { id: 6, name: 'Samsung Tab S9', category: 'Tablets', price: 799, sku: 'STS9-256' },
    { id: 7, name: 'Sony WH-1000XM5', category: 'Audio', price: 399, sku: 'SONY-XM5' },
    { id: 8, name: 'Apple Watch Series 9', category: 'Wearables', price: 399, sku: 'AWS9-45' },
    { id: 9, name: 'PlayStation 5', category: 'Gaming', price: 499, sku: 'PS5-STD' },
    { id: 10, name: 'Nintendo Switch OLED', category: 'Gaming', price: 349, sku: 'NSW-OLED' }
  ];

  // Shipping methods
  const shippingMethods = [
    { value: 'standard', label: 'Standard Shipping', cost: 9.99, days: '5-7' },
    { value: 'express', label: 'Express Shipping', cost: 19.99, days: '2-3' },
    { value: 'overnight', label: 'Overnight Shipping', cost: 39.99, days: '1' },
    { value: 'free', label: 'Free Shipping', cost: 0, days: '7-10' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Simulate API call with axios
      const response = await axios.get(`${API_BASE}/posts?_limit=25`);
      
      // Transform API data to match our order structure
      const ordersData = response.data.map((item, index) => {
        const statusIndex = index % statusOptions.length;
        const paymentIndex = index % paymentOptions.length;
        const productCount = Math.floor(Math.random() * 3) + 1;
        const products = Array.from({ length: productCount }, (_, i) => {
          const product = electronicProducts[(index + i) % electronicProducts.length];
          const quantity = Math.floor(Math.random() * 2) + 1;
          return {
            ...product,
            quantity,
            total: product.price * quantity
          };
        });
        
        const subtotal = products.reduce((sum, product) => sum + product.total, 0);
        const shippingCost = shippingMethods[index % shippingMethods.length].cost;
        const tax = subtotal * 0.08;
        const totalAmount = subtotal + shippingCost + tax;

        return {
          id: item.id,
          orderNumber: `ORD-${1000 + item.id}`,
          customerName: `Customer ${item.id}`,
          customerEmail: `customer${item.id}@example.com`,
          customerPhone: `+1 (555) ${100 + item.id}-${1000 + item.id}`,
          shippingAddress: `${index + 100} Main St, City ${item.id}, State ${item.id % 50}, ${10000 + item.id}`,
          products,
          subtotal,
          shippingCost,
          tax,
          totalAmount,
          paymentStatus: paymentOptions[paymentIndex].value,
          orderStatus: statusOptions[statusIndex].value,
          shippingMethod: shippingMethods[index % shippingMethods.length].value,
          trackingNumber: `TRK${1000000000 + item.id}`,
          notes: item.body.substring(0, 100) + '...',
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
          estimatedDelivery: new Date(Date.now() + (Math.random() * 10 + 2) * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      setOrders(ordersData);
      toast.success('Orders loaded successfully!');
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders. Using demo data.');
      setOrders(generateDemoOrders());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoOrders = () => {
    return Array.from({ length: 20 }, (_, index) => {
      const productCount = Math.floor(Math.random() * 3) + 1;
      const products = Array.from({ length: productCount }, (_, i) => {
        const product = electronicProducts[(index + i) % electronicProducts.length];
        const quantity = Math.floor(Math.random() * 2) + 1;
        return {
          ...product,
          quantity,
          total: product.price * quantity
        };
      });
      
      const subtotal = products.reduce((sum, product) => sum + product.total, 0);
      const shippingCost = shippingMethods[index % shippingMethods.length].cost;
      const tax = subtotal * 0.08;
      const totalAmount = subtotal + shippingCost + tax;

      return {
        id: index + 1,
        orderNumber: `ORD-${1000 + index + 1}`,
        customerName: `Customer ${index + 1}`,
        customerEmail: `customer${index + 1}@example.com`,
        customerPhone: `+1 (555) ${100 + index + 1}-${1000 + index + 1}`,
        shippingAddress: `${index + 100} Main St, City ${index + 1}, State ${index % 50}, ${10000 + index + 1}`,
        products,
        subtotal,
        shippingCost,
        tax,
        totalAmount,
        paymentStatus: paymentOptions[index % paymentOptions.length].value,
        orderStatus: statusOptions[index % statusOptions.length].value,
        shippingMethod: shippingMethods[index % shippingMethods.length].value,
        trackingNumber: `TRK${1000000000 + index + 1}`,
        notes: `Order notes for customer ${index + 1}. Special instructions or requirements.`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
        estimatedDelivery: new Date(Date.now() + (Math.random() * 10 + 2) * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
      const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
      
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'totalAmount' || sortField === 'subtotal') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // CRUD Operations
  const handleCreateOrder = async () => {
    try {
      const newOrderData = {
        ...newOrder,
        id: Date.now(),
        orderNumber: `ORD-${1000 + Date.now()}`,
        subtotal: newOrder.products.reduce((sum, product) => sum + (product.price * product.quantity), 0),
        tax: 0,
        shippingCost: shippingMethods.find(m => m.value === newOrder.shippingMethod)?.cost || 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      newOrderData.tax = newOrderData.subtotal * 0.08;
      newOrderData.totalAmount = newOrderData.subtotal + newOrderData.shippingCost + newOrderData.tax;

      setOrders(prev => [newOrderData, ...prev]);
      setIsCreateModalOpen(false);
      resetNewOrderForm();
      toast.success('Order created successfully!');
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
        )
      );
      setEditingOrder(null);
      toast.success('Order updated successfully!');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      toast.success('Order deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    handleUpdateOrder(orderId, { orderStatus: newStatus });
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    handleUpdateOrder(orderId, { paymentStatus: newPaymentStatus });
  };

  const resetNewOrderForm = () => {
    setNewOrder({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      products: [],
      totalAmount: '',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingMethod: 'standard',
      trackingNumber: '',
      notes: ''
    });
  };

  // Utility functions
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getPaymentColor = (paymentStatus) => {
    const paymentOption = paymentOptions.find(opt => opt.value === paymentStatus);
    return paymentOption ? paymentOption.color : 'default';
  };

  const getPaymentLabel = (paymentStatus) => {
    const paymentOption = paymentOptions.find(opt => opt.value === paymentStatus);
    return paymentOption ? paymentOption.label : paymentStatus;
  };

  const getShippingMethodLabel = (method) => {
    const shippingMethod = shippingMethods.find(m => m.value === method);
    return shippingMethod ? shippingMethod.label : method;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Custom Components
  const Chip = ({ label, color = 'default', size = 'medium', variant = 'filled' }) => {
    const colorClasses = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      primary: 'bg-purple-100 text-purple-800'
    };

    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1 text-sm'
    };

    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    return (
      <span className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[color]}`}>
        {label}
      </span>
    );
  };

  const IconButton = ({ children, onClick, className = '', size = 'medium', ...props }) => {
    const sizeClasses = {
      small: 'p-1',
      medium: 'p-2'
    };

    return (
      <button
        onClick={onClick}
        className={`rounded-full hover:bg-opacity-10 transition-colors ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  const Tooltip = ({ children, title }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {children}
        </div>
        {showTooltip && (
          <div className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded bottom-full mb-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {title}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  const Modal = ({ open, onClose, children, maxWidth = 'md' }) => {
    if (!open) return null;

    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl'
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className={`w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}>
          {children}
        </div>
      </div>
    );
  };

  const ModalHeader = ({ children, onClose, gradient = 'from-blue-600 to-blue-700' }) => (
    <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${gradient} text-white rounded-t-2xl sticky top-0 z-10`}>
      <div className="text-xl font-bold">{children}</div>
      <IconButton onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20">
        <Clear />
      </IconButton>
    </div>
  );

  const ModalContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );

  const ModalActions = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end space-x-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white ${className}`}>
      {children}
    </div>
  );

  // Loading skeleton
  const OrderSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-6 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="h-8 bg-gray-300 rounded w-20"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );

  // Order Card Component
  const OrderCard = ({ order }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-blue-600">{formatCurrency(order.totalAmount)}</p>
            <p className="text-sm text-gray-600">{order.products.length} item(s)</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Person className="text-gray-400 text-sm" />
            <span className="font-semibold text-gray-800">{order.customerName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Email className="text-gray-400 text-sm" />
            <span>{order.customerEmail}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Chip
            label={getStatusLabel(order.orderStatus)}
            color={getStatusColor(order.orderStatus)}
            size="small"
          />
          <Chip
            label={getPaymentLabel(order.paymentStatus)}
            color={getPaymentColor(order.paymentStatus)}
            size="small"
          />
        </div>

        {/* Products Preview */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Products:</p>
          <div className="space-y-1">
            {order.products.slice(0, 2).map((product, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-600">
                <span className="truncate">{product.name} × {product.quantity}</span>
                <span>{formatCurrency(product.total)}</span>
              </div>
            ))}
            {order.products.length > 2 && (
              <div className="text-sm text-gray-500">
                +{order.products.length - 2} more items
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Tooltip title="View Order Details">
            <IconButton
              size="small"
              onClick={() => setViewOrder(order)}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Order">
            <IconButton
              size="small"
              onClick={() => setEditingOrder(order)}
              className="text-green-600 hover:bg-green-50"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update Status">
            <IconButton
              size="small"
              onClick={() => setViewOrder(order)}
              className="text-purple-600 hover:bg-purple-50"
            >
              <TrackChanges fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Order">
            <IconButton
              size="small"
              onClick={() => {
                setOrderToDelete(order);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:bg-red-50"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-white rounded-2xl shadow-lg">
                <LocalShipping className="text-blue-600 text-2xl md:text-3xl" />
              </div>
              Electronic Orders Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer orders, track shipments, and process electronic device orders
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            <Add />
            Create New Order
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
      >
        {[
          { label: 'Total Orders', value: orders.length, icon: <Receipt />, color: 'blue' },
          { label: 'Pending', value: orders.filter(o => o.orderStatus === 'pending').length, icon: <Schedule />, color: 'yellow' },
          { label: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length, icon: <Inventory />, color: 'purple' },
          { label: 'Shipped', value: orders.filter(o => o.orderStatus === 'shipped').length, icon: <LocalShipping />, color: 'green' },
          { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length, icon: <CheckCircle />, color: 'green' },
          { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'cancelled').length, icon: <Cancel />, color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                {React.cloneElement(stat.icon, { className: `text-${stat.color}-600 text-xl` })}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by number, customer, or tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Payment Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {paymentOptions.map(payment => (
                <option key={payment.value} value={payment.value}>
                  {payment.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="totalAmount-desc">Amount High-Low</option>
              <option value="totalAmount-asc">Amount Low-High</option>
              <option value="customerName-asc">Customer A-Z</option>
              <option value="customerName-desc">Customer Z-A</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Orders ({filteredAndSortedOrders.length})
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedOrders.length} of {orders.length} orders
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <Assignment className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPayment('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Create Order Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="2xl"
      >
        <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
          Create New Order
        </ModalHeader>
        <ModalContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Person />
                Customer Information
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newOrder.customerEmail}
                onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
              <textarea
                value={newOrder.shippingAddress}
                onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter complete shipping address"
              />
            </div>

            {/* Order Details */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Assignment />
                Order Details
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={newOrder.orderStatus}
                onChange={(e) => setNewOrder({ ...newOrder, orderStatus: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={newOrder.paymentStatus}
                onChange={(e) => setNewOrder({ ...newOrder, paymentStatus: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {paymentOptions.filter(opt => opt.value !== 'all').map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
              <select
                value={newOrder.shippingMethod}
                onChange={(e) => setNewOrder({ ...newOrder, shippingMethod: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {shippingMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
              <input
                type="text"
                value={newOrder.trackingNumber}
                onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter tracking number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes</label>
              <textarea
                value={newOrder.notes}
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter any special notes or instructions"
              />
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateOrder}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            disabled={!newOrder.customerName || !newOrder.customerEmail}
          >
            Create Order
          </button>
        </ModalActions>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="sm"
      >
        <div className="bg-red-50 text-red-800 p-6 rounded-t-2xl">
          <h3 className="text-lg font-semibold">Confirm Order Deletion</h3>
        </div>
        <ModalContent>
          <div className="flex items-center space-x-4">
            <Warning className="text-red-600 text-2xl" />
            <div>
              <p className="font-semibold text-gray-800">
                Are you sure you want to delete order "{orderToDelete?.orderNumber}"?
              </p>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. All order data will be permanently removed.
              </p>
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteOrder(orderToDelete?.id)}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-300"
          >
            Delete Order
          </button>
        </ModalActions>
      </Modal>

      {/* View Order Modal */}
      {viewOrder && (
        <Modal
          open={!!viewOrder}
          onClose={() => setViewOrder(null)}
          maxWidth="4xl"
        >
          <ModalHeader onClose={() => setViewOrder(null)} gradient="from-purple-600 to-purple-700">
            Order Details - {viewOrder.orderNumber}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Person />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-semibold text-gray-800">{viewOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{viewOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">{viewOrder.customerPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-semibold text-gray-800">{viewOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Inventory />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {viewOrder.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Inventory className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">SKU: {product.sku} | Qty: {product.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{formatCurrency(product.total)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(product.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                {viewOrder.notes && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Assignment />
                      Order Notes
                    </h3>
                    <p className="text-gray-700">{viewOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Status & Actions */}
              <div className="space-y-6">
                {/* Order Status */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Order Status:</span>
                      <Chip
                        label={getStatusLabel(viewOrder.orderStatus)}
                        color={getStatusColor(viewOrder.orderStatus)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <Chip
                        label={getPaymentLabel(viewOrder.paymentStatus)}
                        color={getPaymentColor(viewOrder.paymentStatus)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Shipping Method:</span>
                      <span className="font-semibold text-gray-800">{getShippingMethodLabel(viewOrder.shippingMethod)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tracking Number:</span>
                      <span className="font-semibold text-gray-800">{viewOrder.trackingNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(viewOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold">{formatCurrency(viewOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">{formatCurrency(viewOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(viewOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateOrderStatus(viewOrder.id, 'processing')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(viewOrder.id, 'shipped')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() => updateOrderStatus(viewOrder.id, 'delivered')}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Delivered
                    </button>
                    <button
                      onClick={() => setEditingOrder(viewOrder)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 text-sm font-semibold"
                    >
                      Edit Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setViewOrder(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                setEditingOrder(viewOrder);
                setViewOrder(null);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors duration-300"
            >
              Edit Order
            </button>
          </ModalActions>
        </Modal>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <Modal
          open={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          maxWidth="2xl"
        >
          <ModalHeader onClose={() => setEditingOrder(null)} gradient="from-green-600 to-green-700">
            Edit Order - {editingOrder.orderNumber}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  value={editingOrder.orderStatus}
                  onChange={(e) => setEditingOrder({ ...editingOrder, orderStatus: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={editingOrder.paymentStatus}
                  onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  {paymentOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                <select
                  value={editingOrder.shippingMethod}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shippingMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  {shippingMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={editingOrder.trackingNumber}
                  onChange={(e) => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
                <textarea
                  value={editingOrder.notes}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setEditingOrder(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdateOrder(editingOrder.id, editingOrder)}
              className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300"
            >
              Update Order
            </button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};