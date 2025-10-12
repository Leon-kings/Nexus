/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/TransactionManagement.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Receipt,
  Payment,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Download,
  FilterList,
  Search,
  Visibility,
  Edit,
  Delete,
  Clear,
  Add,
  Refresh,
  CreditCard,

  AccountBalanceWallet,
  LocalAtm,
  Schedule,
  CheckCircle,
  Cancel,
  Warning,
  ArrowUpward,
  ArrowDownward,
  SwapHoriz,
  Google,
  PhoneIphone
} from '@mui/icons-material';

export const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'credit-card',
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    customer: '',
    notes: ''
  });

  // Mock API base URL
  const API_BASE = 'https://jsonplaceholder.typicode.com';

  // Transaction types
  const transactionTypes = [
    { value: 'all', label: 'All Types', color: 'default' },
    { value: 'income', label: 'Income', color: 'success', icon: <ArrowDownward /> },
    { value: 'expense', label: 'Expense', color: 'error', icon: <ArrowUpward /> },
    { value: 'refund', label: 'Refund', color: 'warning', icon: <SwapHoriz /> },
    { value: 'transfer', label: 'Transfer', color: 'info', icon: <SwapHoriz /> }
  ];

  // Transaction statuses
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'default' },
    { value: 'completed', label: 'Completed', color: 'success', icon: <CheckCircle /> },
    { value: 'pending', label: 'Pending', color: 'warning', icon: <Schedule /> },
    { value: 'failed', label: 'Failed', color: 'error', icon: <Cancel /> },
    { value: 'cancelled', label: 'Cancelled', color: 'error', icon: <Cancel /> },
    { value: 'processing', label: 'Processing', color: 'info', icon: <Schedule /> }
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'all', label: 'All Methods', color: 'default' },
    { value: 'credit-card', label: 'Credit Card', color: 'blue', icon: <CreditCard /> },
    { value: 'paypal', label: 'PayPal', color: 'blue', icon: <Google /> },
    { value: 'apple-pay', label: 'Apple Pay', color: 'black', icon: <PhoneIphone /> },
    { value: 'bank-transfer', label: 'Bank Transfer', color: 'green', icon: <AccountBalance /> },
    { value: 'cash', label: 'Cash', color: 'green', icon: <LocalAtm /> },
    { value: 'wallet', label: 'Digital Wallet', color: 'purple', icon: <AccountBalanceWallet /> }
  ];

  // Transaction categories
  const categories = {
    income: [
      'Product Sales',
      'Service Revenue',
      'Subscription',
      'Refund Issued',
      'Interest Income',
      'Investment',
      'Other Income'
    ],
    expense: [
      'Inventory Purchase',
      'Software & Tools',
      'Marketing & Ads',
      'Office Supplies',
      'Salaries & Wages',
      'Utilities',
      'Rent & Lease',
      'Travel & Entertainment',
      'Professional Services',
      'Other Expenses'
    ],
    refund: [
      'Customer Refund',
      'Vendor Refund',
      'Tax Refund',
      'Other Refund'
    ],
    transfer: [
      'Bank Transfer',
      'Wallet Transfer',
      'Investment Transfer',
      'Other Transfer'
    ]
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Simulate API call with axios
      const response = await axios.get(`${API_BASE}/posts?_limit=30`);
      
      // Transform API data to match our transaction structure
      const transactionsData = response.data.map((item, index) => {
        const type = ['income', 'expense', 'refund', 'transfer'][index % 4];
        const status = ['completed', 'pending', 'failed', 'processing'][index % 4];
        const paymentMethod = ['credit-card', 'paypal', 'bank-transfer', 'apple-pay', 'cash'][index % 5];
        const categoryList = categories[type] || categories.income;
        const category = categoryList[index % categoryList.length];
        
        const baseAmount = type === 'income' ? 
          Math.random() * 2000 + 100 : 
          type === 'expense' ? 
            Math.random() * 1000 + 50 : 
            Math.random() * 500 + 20;
        
        return {
          id: item.id,
          transactionId: `TXN-${10000 + item.id}`,
          type,
          amount: parseFloat(baseAmount.toFixed(2)),
          description: item.title,
          category,
          paymentMethod,
          status,
          date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          reference: `REF-${20000 + item.id}`,
          customer: `Customer ${(index % 10) + 1}`,
          notes: item.body.substring(0, 100) + '...',
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString()
        };
      });

      setTransactions(transactionsData);
      toast.success('Transactions loaded successfully!');
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions. Using demo data.');
      setTransactions(generateDemoTransactions());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoTransactions = () => {
    return Array.from({ length: 25 }, (_, index) => {
      const type = ['income', 'expense', 'refund', 'transfer'][index % 4];
      const status = ['completed', 'pending', 'failed', 'processing'][index % 4];
      const paymentMethod = ['credit-card', 'paypal', 'bank-transfer', 'apple-pay', 'cash'][index % 5];
      const categoryList = categories[type] || categories.income;
      const category = categoryList[index % categoryList.length];
      
      const baseAmount = type === 'income' ? 
        Math.random() * 2000 + 100 : 
        type === 'expense' ? 
          Math.random() * 1000 + 50 : 
          Math.random() * 500 + 20;

      return {
        id: index + 1,
        transactionId: `TXN-${10000 + index + 1}`,
        type,
        amount: parseFloat(baseAmount.toFixed(2)),
        description: `Transaction for ${category.toLowerCase()}`,
        category,
        paymentMethod,
        status,
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        reference: `REF-${20000 + index + 1}`,
        customer: `Customer ${(index % 10) + 1}`,
        notes: `Transaction notes for ${category}. Additional details about this transaction.`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString()
      };
    });
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      const matchesPayment = filterPayment === 'all' || transaction.paymentMethod === filterPayment;
      
      return matchesSearch && matchesType && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // CRUD Operations
  const handleCreateTransaction = async () => {
    try {
      const newTransactionData = {
        ...newTransaction,
        id: Date.now(),
        transactionId: `TXN-${10000 + Date.now()}`,
        amount: parseFloat(newTransaction.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTransactions(prev => [newTransactionData, ...prev]);
      setIsCreateModalOpen(false);
      resetNewTransactionForm();
      toast.success('Transaction created successfully!');
    } catch (error) {
      toast.error('Failed to create transaction');
    }
  };

  const handleUpdateTransaction = async (transactionId, updates) => {
    try {
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId ? { ...transaction, ...updates, updatedAt: new Date().toISOString() } : transaction
        )
      );
      setSelectedTransaction(null);
      toast.success('Transaction updated successfully!');
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const resetNewTransactionForm = () => {
    setNewTransaction({
      type: 'income',
      amount: '',
      description: '',
      category: '',
      paymentMethod: 'credit-card',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      customer: '',
      notes: ''
    });
  };

  // Utility functions
  const getTypeColor = (type) => {
    const typeOption = transactionTypes.find(opt => opt.value === type);
    return typeOption ? typeOption.color : 'default';
  };

  const getTypeLabel = (type) => {
    const typeOption = transactionTypes.find(opt => opt.value === type);
    return typeOption ? typeOption.label : type;
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getPaymentColor = (paymentMethod) => {
    const paymentOption = paymentMethods.find(opt => opt.value === paymentMethod);
    return paymentOption ? paymentOption.color : 'default';
  };

  const getPaymentLabel = (paymentMethod) => {
    const paymentOption = paymentMethods.find(opt => opt.value === paymentMethod);
    return paymentOption ? paymentOption.label : paymentMethod;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistics calculations
  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalRefunds = transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netRevenue = totalIncome - totalExpenses + totalRefunds;
    
    const completedTransactions = transactions.filter(t => t.status === 'completed').length;
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    
    return {
      totalIncome,
      totalExpenses,
      totalRefunds,
      netRevenue,
      completedTransactions,
      pendingTransactions,
      totalTransactions: transactions.length
    };
  };

  const stats = getStats();

  // Custom Components
  const Chip = ({ label, color = 'default', size = 'medium', variant = 'filled' }) => {
    const colorClasses = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      black: 'bg-gray-800 text-white'
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
      '2xl': 'max-w-2xl'
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
  const TransactionSkeleton = () => (
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

  // Transaction Card Component
  const TransactionCard = ({ transaction }) => (
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
            <h3 className="font-bold text-lg text-gray-900">{transaction.transactionId}</h3>
            <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
          </div>
          <div className={`text-right ${transaction.type === 'income' ? 'text-green-600' : transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'}`}>
            <p className="font-bold text-xl">
              {transaction.type === 'income' || transaction.type === 'refund' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </p>
            <Chip
              label={getTypeLabel(transaction.type)}
              color={getTypeColor(transaction.type)}
              size="small"
            />
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mb-4">
          <p className="font-semibold text-gray-800 mb-2">{transaction.description}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span>Category: {transaction.category}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Customer: {transaction.customer}</span>
          </div>
        </div>

        {/* Status & Payment */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Chip
            label={getStatusLabel(transaction.status)}
            color={getStatusColor(transaction.status)}
            size="small"
          />
          <Chip
            label={getPaymentLabel(transaction.paymentMethod)}
            color={getPaymentColor(transaction.paymentMethod)}
            size="small"
          />
        </div>

        {/* Reference */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">Reference: {transaction.reference}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => setSelectedTransaction(transaction)}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Transaction">
            <IconButton
              size="small"
              onClick={() => setSelectedTransaction(transaction)}
              className="text-green-600 hover:bg-green-50"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Transaction">
            <IconButton
              size="small"
              onClick={() => {
                setTransactionToDelete(transaction);
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
                <Receipt className="text-blue-600 text-2xl md:text-3xl" />
              </div>
              Transaction Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all financial transactions, payments, and transfers
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            <Add />
            New Transaction
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.totalIncome)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(stats.totalExpenses)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(stats.netRevenue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <AccountBalance className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Refunds</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(stats.totalRefunds)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <SwapHoriz className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completedTransactions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingTransactions}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Schedule className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTransactions}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl">
              <Receipt className="text-gray-600 text-xl" />
            </div>
          </div>
        </div>
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
                placeholder="Search transactions by ID, description, customer, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {transactionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            {/* Payment Method Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {paymentMethods.map(payment => (
                <option key={payment.value} value={payment.value}>{payment.label}</option>
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
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount High-Low</option>
              <option value="amount-asc">Amount Low-High</option>
              <option value="description-asc">Description A-Z</option>
              <option value="description-desc">Description Z-A</option>
            </select>

            {/* Refresh Button */}
            <Tooltip title="Refresh Transactions">
              <IconButton
                onClick={loadTransactions}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </motion.div>

      {/* Transactions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Transactions ({filteredAndSortedTransactions.length})
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <TransactionSkeleton key={index} />
            ))}
          </div>
        ) : filteredAndSortedTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <Receipt className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No transactions found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
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
              {filteredAndSortedTransactions.map(transaction => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Create Transaction Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="lg"
      >
        <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
          Create New Transaction
        </ModalHeader>
        <ModalContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value, category: '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {transactionTypes.filter(opt => opt.value !== 'all').map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Category</option>
                {(categories[newTransaction.type] || categories.income).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={newTransaction.paymentMethod}
                onChange={(e) => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {paymentMethods.filter(opt => opt.value !== 'all').map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newTransaction.status}
                onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {statusOptions.filter(opt => opt.value !== 'all').map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter transaction description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
              <input
                type="text"
                value={newTransaction.reference}
                onChange={(e) => setNewTransaction({ ...newTransaction, reference: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter reference number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <input
                type="text"
                value={newTransaction.customer}
                onChange={(e) => setNewTransaction({ ...newTransaction, customer: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter customer name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter any additional notes"
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
            onClick={handleCreateTransaction}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            disabled={!newTransaction.amount || !newTransaction.description}
          >
            Create Transaction
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
          <h3 className="text-lg font-semibold">Confirm Transaction Deletion</h3>
        </div>
        <ModalContent>
          <div className="flex items-center space-x-4">
            <Warning className="text-red-600 text-2xl" />
            <div>
              <p className="font-semibold text-gray-800">
                Are you sure you want to delete transaction "{transactionToDelete?.transactionId}"?
              </p>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. All transaction data will be permanently removed.
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
            onClick={() => handleDeleteTransaction(transactionToDelete?.id)}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-300"
          >
            Delete Transaction
          </button>
        </ModalActions>
      </Modal>

      {/* View/Edit Transaction Modal */}
      {selectedTransaction && (
        <Modal
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          maxWidth="lg"
        >
          <ModalHeader onClose={() => setSelectedTransaction(null)} gradient="from-purple-600 to-purple-700">
            Transaction Details - {selectedTransaction.transactionId}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Transaction Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-semibold">{selectedTransaction.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Chip
                        label={getTypeLabel(selectedTransaction.type)}
                        color={getTypeColor(selectedTransaction.type)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className={`font-bold text-lg ${
                        selectedTransaction.type === 'income' || selectedTransaction.type === 'refund' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {selectedTransaction.type === 'income' || selectedTransaction.type === 'refund' ? '+' : '-'}
                        {formatCurrency(selectedTransaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold">{selectedTransaction.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-semibold text-right">{selectedTransaction.description}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <Chip
                        label={getPaymentLabel(selectedTransaction.paymentMethod)}
                        color={getPaymentColor(selectedTransaction.paymentMethod)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Chip
                        label={getStatusLabel(selectedTransaction.status)}
                        color={getStatusColor(selectedTransaction.status)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-semibold">{selectedTransaction.reference}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Timeline */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-semibold">{selectedTransaction.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction Date:</span>
                      <span className="font-semibold">{formatDate(selectedTransaction.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-semibold">{formatDate(selectedTransaction.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold">{formatDate(selectedTransaction.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Notes</h3>
                  <p className="text-gray-700">{selectedTransaction.notes}</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpdateTransaction(selectedTransaction.id, { status: 'completed' })}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleUpdateTransaction(selectedTransaction.id, { status: 'pending' })}
                      className="w-full px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Pending
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTransaction({ ...selectedTransaction });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 text-sm font-semibold"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                // For demo purposes, we'll just close the modal
                // In real implementation, you would open an edit form
                setSelectedTransaction(null);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors duration-300"
            >
              Edit Transaction
            </button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};