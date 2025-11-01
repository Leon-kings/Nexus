/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Star,
  StarBorder,
  LocalShipping,
  CalendarToday,
  Notifications,
  NotificationsActive,
  AccessTime,
  NewReleases,
  Close,
  Person,
  Email,
  Phone,
  Home,
  Send,
  CheckCircle,
  Error,
  Warning
} from '@mui/icons-material';
import { format, addDays, isAfter } from 'date-fns';

// Mock API service
const apiService = {
  // Submit order request
  async submitOrderRequest(orderData) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.2; // 80% success rate
        if (isSuccess) {
          resolve({
            success: true,
            data: {
              orderId: `ORD-${Date.now()}`,
              ...orderData,
              submittedAt: new Date().toISOString(),
              status: 'pending'
            },
            message: 'Order request submitted successfully!'
          });
        } else {
          reject({
            success: false,
            error: 'Failed to submit order request. Please try again later.',
            code: 'ORDER_SUBMISSION_FAILED'
          });
        }
      }, 2000);
    });
  },

  // Subscribe to notifications
  async subscribeToNotifications(notificationData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate
        if (isSuccess) {
          resolve({
            success: true,
            data: {
              subscriptionId: `SUB-${Date.now()}`,
              ...notificationData,
              subscribedAt: new Date().toISOString()
            },
            message: 'Successfully subscribed to notifications!'
          });
        } else {
          reject({
            success: false,
            error: 'Failed to subscribe to notifications.',
            code: 'SUBSCRIPTION_FAILED'
          });
        }
      }, 1500);
    });
  },

  // Unsubscribe from notifications
  async unsubscribeFromNotifications(subscriptionId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.1;
        if (isSuccess) {
          resolve({
            success: true,
            message: 'Successfully unsubscribed from notifications.'
          });
        } else {
          reject({
            success: false,
            error: 'Failed to unsubscribe from notifications.',
            code: 'UNSUBSCRIBE_FAILED'
          });
        }
      }, 1500);
    });
  }
};

export const UpcomingElectronics = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Quantum Pro Laptop",
      price: 1299.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      category: "Laptops",
      features: ["16GB RAM", "1TB SSD", "RTX 5060", "Intel i9"],
      isFavorite: false,
      isNotified: false,
      subscriptionId: null,
      releaseDate: addDays(new Date(), 45),
      status: "upcoming",
      description: "Next-gen gaming laptop with AI-powered performance"
    },
    {
      id: 2,
      name: "Nexus Ultra Fold",
      price: 1599.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      category: "Smartphones",
      features: ["Foldable OLED", "512GB", "5G Advanced", "Quad Camera"],
      isFavorite: false,
      isNotified: false,
      subscriptionId: null,
      releaseDate: addDays(new Date(), 30),
      status: "upcoming",
      description: "Revolutionary foldable smartphone with seamless experience"
    },
    {
      id: 3,
      name: "AudioWave Pro Max",
      price: 449.99,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      category: "Audio",
      features: ["AI Noise Cancelling", "Spatial Audio", "40h Battery", "Hi-Res"],
      isFavorite: false,
      isNotified: false,
      subscriptionId: null,
      releaseDate: addDays(new Date(), 60),
      status: "upcoming",
      description: "Premium headphones with advanced AI sound optimization"
    },
    {
      id: 4,
      name: "SmartWatch Health Pro",
      price: 599.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      category: "Wearables",
      features: ["ECG Monitor", "Blood Pressure", "Sleep Analysis", "GPS Pro"],
      isFavorite: false,
      isNotified: false,
      subscriptionId: null,
      releaseDate: addDays(new Date(), 75),
      status: "upcoming",
      description: "Advanced health monitoring smartwatch with medical-grade sensors"
    },
    {
      id: 5,
      name: "VR Headset Pro",
      price: 799.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400",
      category: "Gaming",
      features: ["8K Resolution", "Eye Tracking", "Wireless", "Haptic Feedback"],
      isFavorite: false,
      isNotified: false,
      subscriptionId: null,
      releaseDate: addDays(new Date(), 90),
      status: "upcoming",
      description: "Immersive VR experience with breakthrough visual technology"
    },
    {
      id: 6,
      name: "Tablet Studio Pro",
      price: 1199.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      category: "Tablets",
      features: ["14\" Mini-LED", "M3 Chip", "5G Connectivity", "ProCreate Ready"],
      isFavorite: false,
      isNotified: false,
      subscriptionId: null,
      releaseDate: addDays(new Date(), 15),
      status: "coming-soon",
      description: "Professional creative tablet for artists and designers"
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('releaseDate');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    quantity: 1,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState({});

  // Calculate days until release
  const getDaysUntilRelease = (releaseDate) => {
    const today = new Date();
    const diffTime = releaseDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge color
  const getStatusBadge = (device) => {
    const daysUntilRelease = getDaysUntilRelease(device.releaseDate);
    
    if (daysUntilRelease <= 15) {
      return {
        text: 'Coming Soon',
        color: 'bg-gradient-to-b from-orange-500 to-orange-600',
        textColor: 'text-white'
      };
    } else if (daysUntilRelease <= 30) {
      return {
        text: 'Pre-Order',
        color: 'bg-gradient-to-b from-blue-500 to-blue-600',
        textColor: 'text-white'
      };
    } else {
      return {
        text: 'Upcoming',
        color: 'bg-gradient-to-b from-purple-500 to-purple-600',
        textColor: 'text-white'
      };
    }
  };

  // Filter devices based on status
  const filteredDevices = devices.filter(device => {
    if (filter === 'all') return true;
    const daysUntilRelease = getDaysUntilRelease(device.releaseDate);
    
    switch (filter) {
      case 'soon':
        return daysUntilRelease <= 30;
      case 'later':
        return daysUntilRelease > 30;
      default:
        return true;
    }
  });

  // Sort devices
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    switch (sortBy) {
      case 'releaseDate':
        return a.releaseDate - b.releaseDate;
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Toggle favorite
  const toggleFavorite = (id) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, isFavorite: !device.isFavorite }
        : device
    ));
    
    const device = devices.find(d => d.id === id);
    if (!device.isFavorite) {
      toast.success(`Added ${device.name} to wishlist!`);
    }
  };

  // Toggle notification with API call
  const toggleNotification = async (id) => {
    const device = devices.find(d => d.id === id);
    setLoadingNotifications(prev => ({ ...prev, [id]: true }));

    try {
      if (device.isNotified) {
        // Unsubscribe from notifications
        await apiService.unsubscribeFromNotifications(device.subscriptionId);
        
        setDevices(devices.map(d => 
          d.id === id 
            ? { ...d, isNotified: false, subscriptionId: null }
            : d
        ));
        
        toast.info(`Notification removed for ${device.name}`);
      } else {
        // Subscribe to notifications
        const notificationData = {
          productId: device.id,
          productName: device.name,
          email: 'user@example.com', // In real app, get from user profile
          releaseDate: device.releaseDate
        };

        const result = await apiService.subscribeToNotifications(notificationData);
        
        setDevices(devices.map(d => 
          d.id === id 
            ? { 
                ...d, 
                isNotified: true, 
                subscriptionId: result.data.subscriptionId 
              }
            : d
        ));
        
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.error || 'Operation failed. Please try again.');
    } finally {
      setLoadingNotifications(prev => ({ ...prev, [id]: false }));
    }
  };

  // Open pre-order modal
  const handlePreOrder = (device) => {
    setSelectedDevice(device);
    setIsOrderModalOpen(true);
    // Reset form when opening modal
    setOrderForm({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      quantity: 1,
      specialRequests: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit order request to API
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        product: selectedDevice.name,
        productId: selectedDevice.id,
        price: selectedDevice.price,
        releaseDate: selectedDevice.releaseDate,
        customer: orderForm,
        estimatedDelivery: format(addDays(selectedDevice.releaseDate, 7), 'MMM dd, yyyy')
      };

      const result = await apiService.submitOrderRequest(orderData);

      // Show success modal
      setModalContent({
        type: 'success',
        title: 'Order Request Submitted!',
        message: result.message,
        details: {
          orderId: result.data.orderId,
          product: selectedDevice.name,
          estimatedDelivery: result.data.estimatedDelivery,
          customer: orderForm.fullName
        }
      });
      setIsSuccessModalOpen(true);
      
      // Close order modal
      setIsOrderModalOpen(false);
      setSelectedDevice(null);

    } catch (error) {
      // Show error modal
      setModalContent({
        type: 'error',
        title: 'Submission Failed',
        message: error.error,
        details: {
          code: error.code,
          suggestion: 'Please check your information and try again.'
        }
      });
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modals
  const closeModal = () => {
    setIsOrderModalOpen(false);
    setSelectedDevice(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setModalContent({});
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setModalContent({});
  };

  // Render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className="text-yellow-400">
        {index < Math.floor(rating) ? <Star className="w-4 h-4" /> : <StarBorder className="w-4 h-4" />}
      </span>
    ));
  };

  return (
    <div className="w-full min-h-screen mt-3 mb-1 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <NewReleases className="text-purple-600 mr-3 text-4xl" />
          <h1 className="text-4xl font-bold text-gray-900">Upcoming Electronics</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the future of technology. Be the first to experience groundbreaking devices coming soon.
        </p>
      </motion.div>

      {/* Filters and Sort */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'all' 
                ? 'bg-gradient-to-b from-purple-600 to-purple-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('soon')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'soon' 
                ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Coming Soon (≤30 days)
          </button>
          <button
            onClick={() => setFilter('later')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'later' 
                ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Later Releases
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="releaseDate">Sort by Release Date</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {sortedDevices.map((device, index) => {
            const daysUntilRelease = getDaysUntilRelease(device.releaseDate);
            const statusBadge = getStatusBadge(device);

            return (
              <motion.div
                key={device.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={device.image}
                    alt={device.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${statusBadge.color} ${statusBadge.textColor} text-sm font-semibold`}>
                    {statusBadge.text}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(device.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    {device.isFavorite ? (
                      <Favorite className="text-red-500 w-5 h-5" />
                    ) : (
                      <FavoriteBorder className="text-gray-600 w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{device.name}</h3>
                    <span className="text-2xl font-bold text-purple-600">${device.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{device.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(device.rating)}
                    </div>
                    <span className="text-sm text-gray-500">({device.rating})</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {device.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Release Countdown */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarToday className="text-purple-500 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">
                        {format(device.releaseDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AccessTime className="text-orange-500 w-4 h-4" />
                      <span className="text-sm font-semibold text-gray-900">
                        {daysUntilRelease} days
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePreOrder(device)}
                      className="flex-1 bg-gradient-to-b from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2"
                    >
                      <LocalShipping className="w-5 h-5" />
                      Request Pre-Order
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleNotification(device.id)}
                      disabled={loadingNotifications[device.id]}
                      className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                        device.isNotified
                          ? 'bg-gradient-to-b from-green-500 to-green-600 border-green-600 text-white'
                          : 'bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                      } ${loadingNotifications[device.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loadingNotifications[device.id] ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : device.isNotified ? (
                        <NotificationsActive className="w-5 h-5" />
                      ) : (
                        <Notifications className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {sortedDevices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <NewReleases className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-500 mb-2">No Products Found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more upcoming products.</p>
        </motion.div>
      )}

      {/* Order Request Modal */}
      <AnimatePresence>
        {isOrderModalOpen && selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Pre-Order</h2>
                  <p className="text-gray-600">We'll contact you when the product is available</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Close className="w-6 h-6" />
                </button>
              </div>

              {/* Product Summary */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedDevice.image}
                    alt={selectedDevice.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{selectedDevice.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedDevice.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-2xl font-bold text-purple-600">${selectedDevice.price}</span>
                      <span className="text-sm text-gray-500">
                        Available: {format(selectedDevice.releaseDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Person className="w-5 h-5 text-purple-600" />
                      Personal Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={orderForm.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={orderForm.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={orderForm.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <select
                        name="quantity"
                        value={orderForm.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Home className="w-5 h-5 text-purple-600" />
                      Shipping Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={orderForm.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={orderForm.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={orderForm.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="ZIP code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={orderForm.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={orderForm.specialRequests}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-b from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeSuccessModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{modalContent.title}</h3>
                <p className="text-gray-600 mb-6">{modalContent.message}</p>
                
                {modalContent.details && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Order ID:</span>
                        <span className="text-green-700">{modalContent.details.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Product:</span>
                        <span>{modalContent.details.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Customer:</span>
                        <span>{modalContent.details.customer}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={closeSuccessModal}
                  className="w-full bg-gradient-to-b from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {isErrorModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeErrorModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <Error className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{modalContent.title}</h3>
                <p className="text-gray-600 mb-4">{modalContent.message}</p>
                
                {modalContent.details && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-700">
                      <strong>Suggestion:</strong> {modalContent.details.suggestion}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={closeErrorModal}
                    className="flex-1 bg-gradient-to-b from-gray-500 to-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      closeErrorModal();
                      if (selectedDevice) {
                        setIsOrderModalOpen(true);
                      }
                    }}
                    className="flex-1 bg-gradient-to-b from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};