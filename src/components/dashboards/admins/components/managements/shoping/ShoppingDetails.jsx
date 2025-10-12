/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/ShoppingDetails.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  Person,
  Email,
  Phone,
  LocationOn,
  Receipt,
  Inventory,
  Category,
  Star,
  StarBorder,
  Share,
  Print,
  Download,
  ArrowBack,
  TrackChanges,
  Schedule,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  CreditCard,

  CalendarToday,
  AccessTime,
  LocalOffer,
  Security,
  Lock,
  Visibility,
  Edit,
  Delete,
  Add,
  Remove,
  Favorite,
  FavoriteBorder,
  ErrorOutline
} from '@mui/icons-material';

export const ShoppingDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Mock order data
  const mockOrder = {
    id: 'ORD-2024-001234',
    status: 'delivered',
    statusHistory: [
      { status: 'ordered', timestamp: '2024-01-15T10:30:00Z', description: 'Order placed' },
      { status: 'confirmed', timestamp: '2024-01-15T10:35:00Z', description: 'Order confirmed' },
      { status: 'processing', timestamp: '2024-01-15T14:20:00Z', description: 'Processing order' },
      { status: 'shipped', timestamp: '2024-01-16T09:15:00Z', description: 'Shipped with tracking' },
      { status: 'delivered', timestamp: '2024-01-18T14:30:00Z', description: 'Delivered to customer' }
    ],
    customer: {
      id: 'CUST-12345',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    shipping: {
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      method: 'express',
      cost: 19.99,
      estimatedDelivery: '2024-01-18',
      actualDelivery: '2024-01-18T14:30:00Z',
      trackingNumber: 'TRK-7894561230',
      carrier: 'FedEx'
    },
    billing: {
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    payment: {
      method: 'credit-card',
      cardType: 'Visa',
      cardLast4: '4242',
      transactionId: 'TXN-789456123',
      status: 'completed',
      amount: 1456.78,
      date: '2024-01-15T10:30:00Z'
    },
    products: [
      {
        id: 'PROD-001',
        name: 'iPhone 15 Pro',
        category: 'Smartphones',
        price: 999.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
        rating: 4.8,
        reviews: 1245,
        specifications: {
          storage: '256GB',
          color: 'Natural Titanium',
          condition: 'New'
        },
        warranty: '1 Year Manufacturer',
        returnPolicy: '30 Days Returnable'
      },
      {
        id: 'PROD-002',
        name: 'Apple AirPods Pro',
        category: 'Audio',
        price: 249.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&h=200&fit=crop',
        rating: 4.6,
        reviews: 892,
        specifications: {
          model: '2nd Generation',
          color: 'White',
          condition: 'New'
        },
        warranty: '1 Year Manufacturer',
        returnPolicy: '30 Days Returnable'
      },
      {
        id: 'PROD-003',
        name: 'Silicone Case for iPhone 15 Pro',
        category: 'Accessories',
        price: 49.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop',
        rating: 4.3,
        reviews: 367,
        specifications: {
          compatibility: 'iPhone 15 Pro',
          color: 'Midnight Blue',
          material: 'Silicone'
        },
        warranty: '90 Days',
        returnPolicy: '30 Days Returnable'
      }
    ],
    pricing: {
      subtotal: 1297.00,
      shipping: 19.99,
      tax: 103.76,
      discount: 3.97,
      total: 1456.78
    },
    notes: 'Please leave package at front door if no one answers.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  };

  useEffect(() => {
    loadOrderDetails();
  }, []);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrder(mockOrder);
      toast.success('Order details loaded successfully!');
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details.');
    } finally {
      setLoading(false);
    }
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
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      ordered: 'blue',
      confirmed: 'blue',
      processing: 'yellow',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'gray'
    };
    return statusColors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      ordered: <Receipt />,
      confirmed: <CheckCircle />,
      processing: <Schedule />,
      shipped: <LocalShipping />,
      delivered: <CheckCircle />,
      cancelled: <ErrorOutline />,
      refunded: <Warning />
    };
    return statusIcons[status] || <Warning />;
  };

  // Custom Components
  const Chip = ({ label, color = 'default', size = 'medium', icon }) => {
    const colorClasses = {
      default: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1 text-sm'
    };

    return (
      <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}>
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </span>
    );
  };

  const StatusTimeline = ({ history }) => (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            index === history.length - 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {getStatusIcon(item.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800 capitalize">{item.status}</p>
              <p className="text-sm text-gray-500">{formatDateTime(item.timestamp)}</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const ProductCard = ({ product, compact = false }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <button
              onClick={() => setSelectedProduct(product)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Visibility className="text-sm" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
            <span>Qty: {product.quantity}</span>
            <span>•</span>
            <span>{formatCurrency(product.price)} each</span>
          </div>

          {!compact && (
            <>
              <div className="mt-2 flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">
                    {i < Math.floor(product.rating) ? '★' : '☆'}
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.rating}) • {product.reviews} reviews
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(product.price * product.quantity)}
            </div>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                <FavoriteBorder className="text-sm" />
              </button>
              <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                <Add className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PricingBreakdown = ({ pricing }) => (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Pricing Breakdown</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatCurrency(pricing.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">{formatCurrency(pricing.shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">{formatCurrency(pricing.tax)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span className="font-semibold">-{formatCurrency(pricing.discount)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(pricing.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ShippingInfo = ({ shipping }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <LocalShipping />
          Shipping Information
        </h3>
        <Chip 
          label={shipping.carrier} 
          color="blue" 
          size="small" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
          <p className="font-medium text-gray-800">{shipping.address}</p>
          <p className="text-gray-600">
            {shipping.city}, {shipping.state} {shipping.zipCode}
          </p>
          <p className="text-gray-600">{shipping.country}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Delivery Information</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium">Express Shipping</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost:</span>
              <span className="font-medium">{formatCurrency(shipping.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tracking:</span>
              <span className="font-medium text-blue-600">{shipping.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivered:</span>
              <span className="font-medium text-green-600">{formatDate(shipping.actualDelivery)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentInfo = ({ payment }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Payment />
          Payment Information
        </h3>
        <Chip 
          label={payment.status} 
          color="green" 
          size="small" 
          icon={<CheckCircle className="text-sm" />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Payment Method</p>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-800">{payment.cardType} •••• {payment.cardLast4}</p>
              <p className="text-sm text-gray-600">Credit Card</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Transaction Details</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{payment.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-blue-600">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDateTime(payment.date)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomerInfo = ({ customer }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Person />
        Customer Information
      </h3>
      
      <div className="flex items-center space-x-4">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{customer.name}</h4>
          <div className="space-y-1 mt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Email className="text-sm" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="text-sm" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Inventory className="text-sm" />
              <span>Customer since Jan 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-300 rounded-2xl"></div>
                <div className="h-48 bg-gray-300 rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-300 rounded-2xl"></div>
                <div className="h-32 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <ErrorIcon className="text-gray-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white rounded-2xl transition-colors">
                <ArrowBack />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Order Details
                </h1>
                <p className="text-gray-600 mt-1">
                  Order #{order.id} • Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <Share />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors">
                <Print />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">
                <Download />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl bg-${getStatusColor(order.status)}-100`}>
                {React.cloneElement(getStatusIcon(order.status), { 
                  className: `text-${getStatusColor(order.status)}-600 text-2xl` 
                })}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  Order {order.status}
                </h2>
                <p className="text-gray-600">
                  {order.status === 'delivered' 
                    ? `Delivered on ${formatDate(order.shipping.actualDelivery)}`
                    : `Estimated delivery: ${formatDate(order.shipping.estimatedDelivery)}`
                  }
                </p>
              </div>
            </div>
            <Chip
              label={order.status}
              color={getStatusColor(order.status)}
              icon={getStatusIcon(order.status)}
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-200"
        >
          <div className="flex space-x-1">
            {[
              { id: 'details', label: 'Order Details', icon: <Receipt /> },
              { id: 'products', label: 'Products', icon: <Inventory /> },
              { id: 'shipping', label: 'Shipping & Tracking', icon: <LocalShipping /> },
              { id: 'payment', label: 'Payment', icon: <Payment /> },
              { id: 'customer', label: 'Customer', icon: <Person /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'details' && (
              <>
                {/* Order Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrackChanges />
                    Order Timeline
                  </h3>
                  <StatusTimeline history={order.statusHistory} />
                </div>

                {/* Products List */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Ordered Products ({order.products.length})
                  </h3>
                  <div className="space-y-4">
                    {order.products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                {order.products.map(product => (
                  <ProductCard key={product.id} product={product} compact={false} />
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <ShippingInfo shipping={order.shipping} />
            )}

            {activeTab === 'payment' && (
              <PaymentInfo payment={order.payment} />
            )}

            {activeTab === 'customer' && (
              <CustomerInfo customer={order.customer} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <PricingBreakdown pricing={order.pricing} />

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <LocalOffer />
                  Order Notes
                </h3>
                <p className="text-gray-600 text-sm">{order.notes}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-semibold">
                  Track Package
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors">
                  Request Return
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors">
                  Contact Support
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors">
                  Write Review
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Security className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">Secure Order</h4>
                  <p className="text-sm text-green-600 mt-1">
                    This order is protected by our security system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Delete />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Chip label={selectedProduct.category} color="blue" />
                        <div className="mt-2 flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              {i < Math.floor(selectedProduct.rating) ? '★' : '☆'}
                            </span>
                          ))}
                          <span className="text-gray-600 ml-2">
                            {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Specifications</h4>
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Warranty:</span>
                          <span className="font-medium">{selectedProduct.warranty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return Policy:</span>
                          <span className="font-medium">{selectedProduct.returnPolicy}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(selectedProduct.price)}
                          </span>
                          <span className="text-gray-600">Quantity: {selectedProduct.quantity}</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-800 mt-2">
                          Total: {formatCurrency(selectedProduct.price * selectedProduct.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};