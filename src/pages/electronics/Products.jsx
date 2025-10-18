/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Material Icons
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Search,
  Close,
  ArrowBack,
  ArrowForward,
  Print,
  Download,
  CheckCircle,
  Error,
  Add,
  Remove,
  Delete,
  Star,
  LocalShipping,
  Support,
  CreditCard,
  Smartphone,
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  Receipt,
  Share,
  Laptop,
  PhoneIphone,
  Headphones,
  Watch,
  Tv,
  Tablet,
  SportsEsports,
  Home,
  CameraAlt,
  Computer,
  SettingsInputAntenna,
  Menu,
  Category,
  AddPhotoAlternate,
  AdminPanelSettings,
  CloudUpload,
  Logout,
} from "@mui/icons-material";
import { electronicDevices } from "../../assets/images/products";

// Mock data for electronic devices and stats

const stats = [
  {
    number: "10K+",
    label: "Happy Customers",
    icon: "😊",
  },
  {
    number: "5K+",
    label: "Products Sold",
    icon: "📦",
  },
  {
    number: "99%",
    label: "Satisfaction Rate",
    icon: "⭐",
  },
  {
    number: "24/7",
    label: "Support Available",
    icon: "🛡️",
  },
];

// API Base URL
const API_BASE_URL = "https://nexusbackend-hdyk.onrender.com";

// Auth Hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in localStorage (common approach)
        const token = localStorage.getItem("token");
        
        if (token) {
          // Verify token with backend
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear it
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          // Also check cookies as fallback
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
          
          if (tokenCookie) {
            const cookieToken = tokenCookie.split('=')[1];
            const response = await axios.get(`${API_BASE_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${cookieToken}` }
            });
            
            if (response.data.success) {
              setUser(response.data.user);
              // Store in localStorage for consistency
              localStorage.setItem("token", cookieToken);
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear any invalid tokens
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    // Clear cookie if exists
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
  };

  return { user, isLoading, login, logout };
};

// Cart Context
const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("ld_computer_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("ld_computer_cart", JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    saveCart(newCart);
    return true;
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};

// Like System Hook
const useLikes = () => {
  const [likes, setLikes] = useState({});
  const [likedProducts, setLikedProducts] = useState(new Set());

  useEffect(() => {
    const savedLikes = localStorage.getItem("ld_computer_likes");
    const savedLikedProducts = localStorage.getItem(
      "ld_computer_liked_products"
    );

    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }

    if (savedLikedProducts) {
      setLikedProducts(new Set(JSON.parse(savedLikedProducts)));
    }
  }, []);

  const saveLikes = (newLikes, newLikedProducts) => {
    setLikes(newLikes);
    setLikedProducts(newLikedProducts);
    localStorage.setItem("ld_computer_likes", JSON.stringify(newLikes));
    localStorage.setItem(
      "ld_computer_liked_products",
      JSON.stringify([...newLikedProducts])
    );
  };

  const toggleLike = async (productId) => {
    const newLikedProducts = new Set(likedProducts);
    const newLikes = { ...likes };

    if (newLikedProducts.has(productId)) {
      newLikedProducts.delete(productId);
      newLikes[productId] = (newLikes[productId] || 1) - 1;
    } else {
      newLikedProducts.add(productId);
      newLikes[productId] = (newLikes[productId] || 0) + 1;
    }

    // Send like data to API
    try {
      await axios.post(`${API_BASE_URL}/likes`, {
        productId,
        likes: newLikes[productId] || 0,
        action: newLikedProducts.has(productId) ? "like" : "unlike",
      });
    } catch (error) {
      console.error("Failed to update likes:", error);
      toast.error("Failed to update like status");
    }

    saveLikes(newLikes, newLikedProducts);
  };

  const getLikes = (productId) => {
    return likes[productId] || 0;
  };

  const isLiked = (productId) => {
    return likedProducts.has(productId);
  };

  return {
    likes,
    likedProducts,
    toggleLike,
    getLikes,
    isLiked,
  };
};

// Payment Hook
const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableMethods, setAvailableMethods] = useState([]);

  // Get available payment methods
  const getPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/methods`);
      setAvailableMethods(response.data.data.paymentMethods || []);
      return response.data.data.paymentMethods || [];
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      toast.error("Failed to load payment methods");
      return [];
    }
  };

  // Process payment
  const processPayment = async (orderData, paymentData) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/process`, {
        orderId: orderData.orderId,
        paymentMethod: paymentData.paymentMethod,
        paymentData: paymentData.paymentDetails,
      });

      if (response.data.success) {
        toast.success(
          response.data.message || "Payment processed successfully!"
        );
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Payment failed"
      );
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/status/${paymentId}`
      );
      return response.data.data.payment;
    } catch (error) {
      console.error("Failed to check payment status:", error);
      return null;
    }
  };

  return {
    isProcessing,
    availableMethods,
    getPaymentMethods,
    processPayment,
    checkPaymentStatus,
  };
};

// Login Modal Component
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        onLogin(token, user);
        toast.success(`Welcome back, ${user.firstName || user.email}!`);
        onClose();
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full text-black dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Person className="text-blue-600 dark:text-blue-400" />
              Login
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-l from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Create Product Modal Component
const CreateProductModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    discount: 0,
    category: "laptops",
    description: "",
    features: [""],
    specifications: {
      processor: "",
      memory: "",
      storage: "",
      display: "",
    },
    inStock: true,
    isNew: false,
  });

  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ld_computer_preset'); // Replace with your upload preset

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/demo/image/upload', // Replace with your cloud name
          formData
        );

        if (response.data.secure_url) {
          uploadedImages.push(response.data.secure_url);
        }
      }

      setImages(prev => [...prev, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      discount: parseInt(formData.discount) || 0,
      image: images[0],
      images: images,
      rating: 4.0, // Default rating
      category: formData.category,
    };

    await onSubmit(productData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-black dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AddPhotoAlternate className="text-blue-600 dark:text-blue-400" />
              Create New Product
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-l from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="laptops">Laptops</option>
                <option value="smartphones">Smartphones</option>
                <option value="audio">Audio</option>
                <option value="wearables">Wearables</option>
                <option value="tvs">TVs</option>
                <option value="tablets">Tablets</option>
                <option value="gaming">Gaming</option>
                <option value="smart-home">Smart Home</option>
                <option value="cameras">Cameras</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter product description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploadingImages}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CloudUpload className="text-4xl text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 10MB
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features
            </label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                  placeholder="Enter feature"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Add className="w-4 h-4" />
              Add Feature
            </button>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Processor
              </label>
              <input
                type="text"
                value={formData.specifications.processor}
                onChange={(e) => handleSpecChange('processor', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter processor details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Memory
              </label>
              <input
                type="text"
                value={formData.specifications.memory}
                onChange={(e) => handleSpecChange('memory', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter memory details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Storage
              </label>
              <input
                type="text"
                value={formData.specifications.storage}
                onChange={(e) => handleSpecChange('storage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter storage details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display
              </label>
              <input
                type="text"
                value={formData.specifications.display}
                onChange={(e) => handleSpecChange('display', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter display details"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">In Stock</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">New Product</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-400 to-indigo-400 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
      >
        <ArrowBack className="w-4 h-4" />
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-400 text-white rounded-xl hover:from-indigo-500 hover:to-blue-500 transition-all duration-200"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-gray-500 px-2 hidden sm:block">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
            currentPage === page
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
              : "bg-gradient-to-br from-indigo-400 to-blue-400 text-white hover:from-indigo-500 hover:to-blue-500"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-500 px-2 hidden sm:block">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-b from-blue-600 to-indigo-400 text-white rounded-xl hover:from-blue-700 hover:to-indigo-500 transition-all duration-200"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
      >
        <ArrowForward className="w-4 h-4" />
      </button>
    </div>
  );
};

// Invoice Component
const Invoice = ({ orderDetails, onClose, isOpen }) => {
  const invoiceRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${orderDetails.orderId}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen || !orderDetails) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-3 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
              <Receipt className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
              Invoice
            </h2>
            <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3 flex-wrap gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-gradient-to-l from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] sm:min-w-[140px] justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="inline sm:hidden">Loading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="inline sm:hidden">PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gradient-to-l from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 min-w-[100px] sm:min-w-[120px] justify-center"
              >
                <Print className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
                <span className="inline sm:hidden">Print</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center bg-gradient-to-l from-red-400 to-red-500 text-white p-2 sm:p-2 rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 min-w-[40px] sm:min-w-[44px] h-10 sm:h-10"
              >
                <Close className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Invoice Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div
              ref={invoiceRef}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 invoice-print"
              style={{ minHeight: "800px" }}
            >
              {/* Invoice Header - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-start gap-6 sm:gap-8 mb-8 sm:mb-12 border-b-2 border-gray-300 dark:border-gray-600 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full lg:w-auto">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                    <Business className="text-white text-lg sm:text-xl md:text-2xl" />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      Future Electronics
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-3">
                      Innovating Tomorrow, Today
                    </p>
                    <div className="text-gray-500 dark:text-gray-400 space-y-1 text-sm sm:text-base">
                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <LocationOn className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="break-words">
                          123 Tech Innovation Avenue, Kigali Heights, Rwanda
                        </span>
                      </p>
                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        +250 788 123 456
                      </p>
                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <Email className="w-3 h-3 sm:w-4 sm:h-4" />
                        info@futureelectronics.com
                      </p>
                      <p className="text-center sm:text-left">
                        www.futureelectronics.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 w-full lg:w-auto">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-end gap-2">
                    <Receipt className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                    INVOICE
                  </h2>
                  <div className="space-y-2 text-sm sm:text-base md:text-lg">
                    <p className="flex items-center justify-center sm:justify-end gap-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Invoice #:
                      </strong>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {orderDetails.orderId}
                      </span>
                    </p>
                    <p className="flex items-center justify-center sm:justify-end gap-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Date:
                      </strong>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(orderDetails.createdAt)}
                      </span>
                    </p>
                    <p className="flex items-center justify-center sm:justify-end gap-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Status:
                      </strong>
                      <span className="ml-2 px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        PAID
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer & Payment Info - Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
                {/* Bill To */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center justify-center lg:justify-start">
                    <Person className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                    Bill To:
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                    <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 text-center lg:text-left">
                      {orderDetails.user.firstName} {orderDetails.user.lastName}
                    </p>
                    <div className="space-y-1 sm:space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      <p className="flex items-center gap-2 justify-center lg:justify-start">
                        <Email className="w-3 h-3 sm:w-4 sm:h-4" />
                        {orderDetails.user.email}
                      </p>
                      <p className="flex items-center gap-2 justify-center lg:justify-start">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        {orderDetails.user.phone}
                      </p>
                      <p className="flex items-center gap-2 justify-center lg:justify-start">
                        <LocationOn className="w-3 h-3 sm:w-4 sm:h-4" />
                        {orderDetails.user.address}
                      </p>
                      <p className="text-center lg:text-left">
                        {orderDetails.user.city}, {orderDetails.user.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center justify-center lg:justify-start">
                    <CreditCard className="mr-2 sm:mr-3 text-green-600 dark:text-green-400 w-4 h-4 sm:w-5 sm:h-5" />
                    Payment Method:
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                    <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 text-center lg:text-left capitalize">
                      {orderDetails.payment.paymentMethod.replace("_", " ")}
                    </p>
                    <div className="space-y-1 sm:space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      {orderDetails.payment.paymentMethod === "stripe" && (
                        <>
                          <p className="flex items-center gap-2 justify-center lg:justify-start">
                            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                            Card ending in{" "}
                            {orderDetails.payment.paymentDetails.cardNumber?.slice(
                              -4
                            ) || "****"}
                          </p>
                        </>
                      )}
                      {orderDetails.payment.paymentMethod === "paypack" && (
                        <>
                          <p className="flex items-center gap-2 justify-center lg:justify-start">
                            <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                            {orderDetails.payment.paymentDetails.network?.toUpperCase() ||
                              "MTN"}{" "}
                            -{" "}
                            {orderDetails.payment.paymentDetails.mobileNumber ||
                              "N/A"}
                          </p>
                        </>
                      )}
                      <p className="flex items-center gap-2 justify-center lg:justify-start">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        Payment Completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items - Responsive Table */}
              <div className="mb-8 sm:mb-12">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center justify-center lg:justify-start">
                  <ShoppingCart className="mr-2 sm:mr-3 text-purple-600 dark:text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
                  Order Details
                </h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  {/* Mobile View - Cards */}
                  <div className="block sm:hidden">
                    {orderDetails.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-4 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        } border-b border-gray-200 dark:border-gray-600`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-500 flex-shrink-0">
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-xs">
                              {item.brand}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-300 text-xs">
                              Qty
                            </p>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-bold text-xs">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-300 text-xs">
                              Price
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-300 text-xs">
                              Total
                            </p>
                            <p className="font-bold text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View - Table */}
                  <div className="hidden sm:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                          <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                            Product
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                            Quantity
                          </th>
                          <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                            Price
                          </th>
                          <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className={
                              index % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-gray-50 dark:bg-gray-700"
                            }
                          >
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-500 flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {item.name}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {item.brand}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="text-center p-4">
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-bold">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="text-right p-4 font-bold text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">
                      Total Amount:
                    </span>
                    <span className="text-green-600 dark:text-green-400 text-xl sm:text-2xl">
                      ${orderDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer - Responsive Grid */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-6 sm:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <LocalShipping className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      Delivery Info
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <Support className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                      Support
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      support@futureelectronics.com
                      <br className="hidden sm:block" />
                      +250 788 123 456
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <span className="text-yellow-600 text-sm sm:text-base">
                        ⭐
                      </span>
                      Thank You
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      Thank you for choosing Future Electronics
                    </p>
                  </div>
                </div>
                <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
                    <Receipt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    This is a computer-generated invoice. No signature required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

// Add to Cart Confirmation Modal
const AddToCartModal = ({
  product,
  onClose,
  onConfirm,
  isOpen,
  onViewCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full text-black dark:text-white overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {product.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                ${product.price}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-l from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 flex-shrink-0"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-t from-red-400 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-200"
              >
                <Remove className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-300 to-indigo-300 text-white rounded-xl hover:from-blue-400 hover:to-indigo-400 transition-all duration-200"
              >
                <Add className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                Subtotal:
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => onConfirm(product, quantity)}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-blue-400 to-indigo-400 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
            >
              <Add className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={() => {
                onConfirm(product, quantity);
                onViewCart();
              }}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-l from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart & View Cart
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-l from-violet-400 to-indigo-400 text-white py-3 rounded-xl font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all duration-200"
            >
              <ArrowBack className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Cart Modal Component
const CartModal = ({
  isOpen,
  onClose,
  onCheckout,
  cart,
  updateQuantity,
  removeFromCart,
  getCartTotal,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden text-black dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="text-blue-600 dark:text-blue-400" />
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-l from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
            <span>{cart.length} items in cart</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto max-h-96">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="text-6xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add some amazing devices to get started!
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex items-center justify-center w-8 h-8 bg-gradient-to-b from-red-200 to-red-400 text-white rounded-lg hover:from-red-300 hover:to-red-500 transition-all duration-200"
                    >
                      <Remove className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex items-center justify-center w-8 h-8 bg-gradient-to-t from-blue-400 to-indigo-400 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
                    >
                      <Add className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center justify-center w-8 h-8 bg-gradient-to-t from-red-300 to-red-500 text-white rounded-lg hover:from-red-400 hover:to-red-600 transition-all duration-200"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="flex items-center justify-center w-full bg-gradient-to-t from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// User Information Form Component
const UserInfoForm = ({ cart, getCartTotal, onBack, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Rwanda",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black dark:text-white"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-bl from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
        >
          <ArrowBack className="w-4 h-4" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Person className="text-blue-600 dark:text-blue-400" />
          Customer Information
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-black dark:text-white"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              <Person className="w-4 h-4" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              <Person className="w-4 h-4" />
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              <Email className="w-4 h-4" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <LocationOn className="w-4 h-4" />
            Delivery Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
            placeholder="Enter complete delivery address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <LocationOn className="w-4 h-4" />
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
              <LocationOn className="w-4 h-4" />
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
            >
              <option value="Rwanda">Rwanda</option>
              <option value="Uganda">Uganda</option>
              <option value="Kenya">Kenya</option>
              <option value="Tanzania">Tanzania</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="text-blue-600 dark:text-blue-400" />
            Order Summary
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    x{item.quantity}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-green-600 dark:text-green-400">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full bg-gradient-to-b from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Continue to Payment"}
        </button>
      </form>
    </motion.div>
  );
};

// Payment Method Component
const PaymentMethod = ({
  cart,
  getCartTotal,
  userInfo,
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("paypack");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mobileNumber: "",
    network: "mtn",
  });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Validate payment details based on method
    if (paymentMethod === "stripe") {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv
      ) {
        toast.error("Please fill all card details");
        return;
      }
    } else if (paymentMethod === "paypack") {
      if (!paymentDetails.mobileNumber) {
        toast.error("Please enter your mobile number");
        return;
      }
    }

    const paymentData = {
      paymentMethod,
      paymentDetails:
        paymentMethod === "stripe"
          ? {
              cardNumber: paymentDetails.cardNumber,
              expiryDate: paymentDetails.expiryDate,
              cvv: paymentDetails.cvv,
              cardHolder: `${userInfo.firstName} ${userInfo.lastName}`,
            }
          : {
              mobileNumber: paymentDetails.mobileNumber,
              network: paymentDetails.network,
            },
    };

    onSubmit(paymentData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black dark:text-white"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
        >
          <ArrowBack className="w-4 h-4" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="text-blue-600 dark:text-blue-400" />
          Payment Method
        </h2>
      </div>

      <form
        onSubmit={handlePaymentSubmit}
        className="space-y-6 text-black dark:text-white"
      >
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Select Payment Method *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("paypack")}
              className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all duration-200 ${
                paymentMethod === "paypack"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
              }`}
            >
              <Smartphone className="text-2xl mb-1" />
              <span className="text-sm">Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("stripe")}
              className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all duration-200 ${
                paymentMethod === "stripe"
                  ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-gradient-to-b from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600"
              }`}
            >
              <CreditCard className="text-2xl mb-1" />
              <span className="text-sm">Credit Card</span>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod === "stripe" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="text-blue-600 dark:text-blue-400" />
              Card Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    cardNumber: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      expiryDate: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cvv: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "paypack" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Smartphone className="text-green-600 dark:text-green-400" />
              Mobile Money Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Network *
              </label>
              <select
                value={paymentDetails.network}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    network: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="mtn">MTN Mobile Money</option>
                <option value="airtel">Airtel Money</option>
                <option value="tigo">Tigo Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                placeholder="078 123 4567"
                value={paymentDetails.mobileNumber}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    mobileNumber: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
                <span>💡</span>
                <strong>Note:</strong> You will receive a payment prompt on your
                phone to complete the transaction.
              </p>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="text-blue-600 dark:text-blue-400" />
            Order Summary
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm ml-2">
                    x{item.quantity}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-green-600 dark:text-green-400">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info Preview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LocalShipping className="text-blue-600 dark:text-blue-400" />
            Delivery Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Name:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userInfo.firstName} {userInfo.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Phone:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userInfo.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Address:</span>
              <span className="font-medium text-gray-900 dark:text-white text-right">
                {userInfo.address}, {userInfo.city}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-t from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          {isLoading ? "Processing Payment..." : "Complete Payment"}
        </button>
      </form>
    </motion.div>
  );
};

// Payment Success Component
const PaymentSuccess = ({
  orderDetails,
  onContinueShopping,
  onViewInvoice,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 text-center max-w-md w-full text-black dark:text-white"
  >
    <div className="overflow-y-auto">
      <div className="w-20 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-white text-4xl" />
      </div>
      <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
        Payment Successful!
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Thank you for your purchase!
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Your order has been confirmed and is being processed.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Details
        </h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {orderDetails.orderId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Total Amount:
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              ${orderDetails.total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Payment Method:
            </span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {orderDetails.payment.paymentMethod.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Estimated Delivery:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              3-5 business days
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        onClick={onViewInvoice}
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
      >
        <Receipt className="w-5 h-5" />
        View Invoice
      </button>
      <button
        onClick={onContinueShopping}
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-t from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200"
      >
        <ShoppingCart className="w-5 h-5" />
        Continue Shopping
      </button>
    </div>
  </motion.div>
);

// Payment Failed Component
const PaymentFailed = ({ onRetry, onCancel, errorMessage }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 overflow-y-auto text-center max-w-md w-full text-black dark:text-white"
  >
    <div className="w-20 h-20 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <Error className="text-white text-4xl" />
    </div>
    <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-4">
      Payment Failed
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-2">
      {errorMessage || "We couldn't process your payment."}
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Please check your payment details and try again.
    </p>

    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
      <button
        onClick={onCancel}
        className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-700 transition-all duration-200"
      >
        <ArrowBack className="w-5 h-5" />
        Cancel
      </button>
      <button
        onClick={onRetry}
        className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
      >
        <span className="text-lg">🔄</span>
        Try Again
      </button>
    </div>
  </motion.div>
);

// Product Card Component
const ProductCard = ({
  device,
  onViewDetails,
  onAddToCart,
  onLike,
  isLiked,
  likesCount,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-gray-200 dark:border-gray-700"
    >
      {/* Device Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={device.image}
          alt={device.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {device.isNew && (
            <span className="bg-gradient-to-b from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          )}
          {device.discount > 0 && (
            <span className="bg-gradient-to-b from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{device.discount}%
            </span>
          )}
          {!device.inStock && (
            <span className="bg-gradient-to-b from-gray-500 to-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Like Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(device.id);
            }}
            className="flex items-center justify-center w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
          >
            {isLiked ? (
              <Favorite className="w-4 h-4 text-red-500" />
            ) : (
              <FavoriteBorder className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Likes Count */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Favorite className="w-3 h-3" />
          {likesCount}
        </div>
      </div>

      {/* Device Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
            {device.name}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Star className="text-yellow-400 w-4 h-4" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {device.rating}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {device.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${device.price}
            </span>
            {device.originalPrice > device.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${device.originalPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {device.brand}
          </span>
        </div>

        {/* Features Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {device.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
              >
                {feature.split(" ")[0]}
              </span>
            ))}
            {device.features.length > 3 && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                +{device.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(device);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm"
          >
            <span className="text-sm">👁️</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(device);
            }}
            disabled={!device.inStock}
            className="flex items-center justify-center gap-2 bg-gradient-to-t from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {device.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
        ({rating})
      </span>
    </div>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile Category Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileCategories(!showMobileCategories)}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <Category className="w-5 h-5" />
          Categories (
          {categories.find((cat) => cat.id === activeCategory)?.name || "All"})
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Categories Grid */}
      <div
        className={`
        ${showMobileCategories ? "block" : "hidden"} 
        lg:block transition-all duration-300
      `}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                setShowMobileCategories(false);
              }}
              className={`
                flex items-center justify-between bg-gradient-to-bl from-blue-400 to-indigo-300 p-4 rounded-xl transition-all duration-300 transform hover:scale-105
                ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`
                  p-2 rounded-lg transition-colors duration-300
                  ${
                    activeCategory === category.id
                      ? "bg-white/20"
                      : "bg-gray-100 dark:bg-gray-700"
                  }
                `}
                >
                  {React.cloneElement(category.icon, {
                    className: `w-5 h-5 ${
                      activeCategory === category.id
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`,
                  })}
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {category.name}
                </span>
              </div>
              <span
                className={`
                px-2 py-1 rounded-full text-xs font-bold transition-colors duration-300
                ${
                  activeCategory === category.id
                    ? "bg-white text-gray-900"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }
              `}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
export const Products = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);
  const productsPerPage = 6;

  // Auth state
  const { user, isLoading: authLoading, login, logout } = useAuth();
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user can create products
  const canCreateProducts = () => {
    if (!user) return false;
    return user.status === 'admin' || user.status === 'manager';
  };

  // Cart State
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  // Likes State
  const { toggleLike, getLikes, isLiked } = useLikes();

  // Payment State
  const {
    isProcessing,
    availableMethods,
    getPaymentMethods,
    processPayment,
    checkPaymentStatus,
  } = usePayment();

  // Modal States
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Checkout Flow States
  const [checkoutStep, setCheckoutStep] = useState("cart"); // 'cart', 'user-info', 'payment', 'success', 'failed'
  const [userInfo, setUserInfo] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  const categories = [
    {
      id: "all",
      name: "All Devices",
      icon: <SettingsInputAntenna />,
      count: electronicDevices.length,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "laptops",
      name: "Laptops",
      icon: <Laptop />,
      count: electronicDevices.filter((d) => d.category === "laptops").length,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "smartphones",
      name: "Smartphones",
      icon: <PhoneIphone />,
      count: electronicDevices.filter((d) => d.category === "smartphones")
        .length,
      gradient: "from-green-500 to-green-600",
    },
    {
      id: "audio",
      name: "Audio",
      icon: <Headphones />,
      count: electronicDevices.filter((d) => d.category === "audio").length,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      id: "wearables",
      name: "Wearables",
      icon: <Watch />,
      count: electronicDevices.filter((d) => d.category === "wearables").length,
      gradient: "from-red-500 to-red-600",
    },
    {
      id: "tvs",
      name: "TVs",
      icon: <Tv />,
      count: electronicDevices.filter((d) => d.category === "tvs").length,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      id: "tablets",
      name: "Tablets",
      icon: <Tablet />,
      count: electronicDevices.filter((d) => d.category === "tablets").length,
      gradient: "from-pink-500 to-pink-600",
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: <SportsEsports />,
      count: electronicDevices.filter((d) => d.category === "gaming").length,
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      id: "smart-home",
      name: "Smart Home",
      icon: <Home />,
      count: electronicDevices.filter((d) => d.category === "smart-home")
        .length,
      gradient: "from-teal-500 to-teal-600",
    },
    {
      id: "cameras",
      name: "Cameras",
      icon: <CameraAlt />,
      count: electronicDevices.filter((d) => d.category === "cameras").length,
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      id: "monitors",
      name: "Monitors",
      icon: <Computer />,
      count: electronicDevices.filter((d) => d.category === "monitors").length,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: <SettingsInputAntenna />,
      count: electronicDevices.filter((d) => d.category === "accessories")
        .length,
      gradient: "from-gray-500 to-gray-600",
    },
  ];

  // Filter devices based on category and search
  const filteredDevices = electronicDevices.filter((device) => {
    const matchesCategory =
      activeCategory === "all" || device.category === activeCategory;
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort devices
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return a.id - b.id;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedDevices.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedDevices.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm, sortBy]);

  // Load payment methods on component mount
  useEffect(() => {
    getPaymentMethods();
  }, []);

  // Cart Handlers
  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setShowAddToCartModal(true);
  };

  const handleConfirmAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setShowAddToCartModal(false);
    setSelectedProduct(null);
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewCart = () => {
    setShowCartModal(true);
  };

  // Like Handler
  const handleLike = (productId) => {
    toggleLike(productId);
    toast.success(
      isLiked(productId) ? "Removed from favorites" : "Added to favorites!"
    );
  };

  // Checkout Handlers
  const handleCheckout = () => {
    setCheckoutStep("user-info");
    setShowCartModal(false);
  };

  const handleUserInfoSubmit = (userData) => {
    setUserInfo(userData);
    setCheckoutStep("payment");
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsLoading(true);

    try {
      // Create order data
      const orderData = {
        orderId: `ORD${Date.now()}`,
        user: userInfo,
        items: cart,
        total: getCartTotal(),
        createdAt: new Date().toISOString(),
      };

      // Process payment through API
      const paymentResult = await processPayment(orderData, paymentData);

      if (paymentResult.success) {
        const completeOrderData = {
          ...orderData,
          payment: paymentData,
          status: "confirmed",
          paymentId: paymentResult.data.paymentId,
        };

        setOrderDetails(completeOrderData);
        setCheckoutStep("success");
        clearCart();
      } else {
        setPaymentError(
          paymentResult.error || "Payment failed. Please try again."
        );
        setCheckoutStep("failed");
      }
    } catch (error) {
      setPaymentError(
        "Network error. Please check your connection and try again."
      );
      setCheckoutStep("failed");
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    setCheckoutStep("cart");
    setUserInfo(null);
    setOrderDetails(null);
    setPaymentError("");
    setShowInvoice(false);
  };

  const handleRetryPayment = () => {
    setCheckoutStep("payment");
    setPaymentError("");
  };

  const handleViewInvoice = () => {
    setShowInvoice(true);
  };

  // Auth Handlers
  const handleLogin = (token, userData) => {
    login(token, userData);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  // Product Creation Handler
  const handleCreateProduct = async (productData) => {
    // Double check permissions
    if (!canCreateProducts()) {
      toast.error('You do not have permission to create products');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Product created successfully!');
        setShowCreateProductModal(false);
        // Refresh the page or update products list
        window.location.reload();
      }
    } catch (error) {
      console.error('Product creation failed:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
      } else if (error.response?.status === 403) {
        toast.error('Permission denied. Admin/Manager access required.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create product');
      }
    } finally {
      setIsCreatingProduct(false);
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mt-2 mb-1 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-print,
          .invoice-print * {
            visibility: visible;
          }
          .invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            border: none;
          }
        }
      `}</style>

      {/* Cart Icon in Header */}
      <div className="fixed top-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCartModal(true)}
          className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-full p-3 shadow-lg border border-white/20 relative hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <ShoppingCart className="text-white text-2xl" />
          {getCartCount() > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-gradient-to-b from-red-500 to-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold"
            >
              {getCartCount()}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Admin/Create Product Button - Conditionally Rendered */}
      {canCreateProducts() && (
        <div className="fixed top-4 right-20 z-40">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCreateProductModal(true)}
            className="bg-gradient-to-b from-green-500 to-green-600 rounded-full p-3 shadow-lg border border-white/20 relative hover:from-green-600 hover:to-green-700 transition-all duration-200"
            title="Create New Product"
          >
            <Add className="text-white text-2xl" />
          </motion.button>
        </div>
      )}

      {/* Disabled Create Button for Regular Users */}
      {user && !canCreateProducts() && (
        <div className="fixed top-4 right-20 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-b from-gray-400 to-gray-500 rounded-full p-3 shadow-lg border border-white/20 relative cursor-not-allowed"
            title="Create Product (Disabled - Admin/Manager only)"
            disabled
          >
            <Add className="text-white text-2xl" />
          </motion.button>
        </div>
      )}

      {/* Login Button for Non-Logged in Users */}
      {!user && (
        <div className="fixed top-4 right-20 z-40">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-b from-purple-500 to-purple-600 rounded-full p-3 shadow-lg border border-white/20 relative hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            title="Login"
          >
            <Person className="text-white text-2xl" />
          </motion.button>
        </div>
      )}

      {/* User Info Display */}
      {user && (
        <div className="fixed top-4 left-4 z-40">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user.firstName?.[0] || user.email?.[0] || 'U'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName || user.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                {user.status}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 ml-2"
              title="Logout"
            >
              <Logout className="text-white text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="text-6xl mb-4">🚀</div>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Future Electronics
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the latest and most innovative electronic devices. From
              cutting-edge smartphones to revolutionary smart home tech.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search devices, brands, features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="text-2xl text-gray-300" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg border border-gray-100 dark:border-gray-600"
              >
                <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Filters */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📂</span>
                  Categories
                </h3>

                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />

                {/* Sort Options */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔧</span>
                    Sort By
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-4 pr-12 border-2 border-gray-300 rounded-xl 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 bg-white text-gray-900
                 font-semibold
                 transition-all duration-200
                 hover:border-blue-500
                 shadow-lg
                 appearance-none cursor-pointer"
                    >
                      <option
                        value="featured"
                        className="text-gray-900 bg-white py-2"
                      >
                        🏆 Featured
                      </option>
                      <option
                        value="newest"
                        className="text-gray-900 bg-white py-2"
                      >
                        🆕 Newest
                      </option>
                      <option
                        value="price-low"
                        className="text-gray-900 bg-white py-2"
                      >
                        💰 Price: Low to High
                      </option>
                      <option
                        value="price-high"
                        className="text-gray-900 bg-white py-2"
                      >
                        💸 Price: High to Low
                      </option>
                      <option
                        value="rating"
                        className="text-gray-900 bg-white py-2"
                      >
                        ⭐ Highest Rated
                      </option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Showing {currentProducts.length} of {filteredDevices.length}{" "}
                    products
                  </p>
                  {activeCategory !== "all" && (
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      in{" "}
                      {
                        categories.find((cat) => cat.id === activeCategory)
                          ?.name
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Devices Grid */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((device, index) => (
                  <ProductCard
                    key={device.id}
                    device={device}
                    onViewDetails={setSelectedDevice}
                    onAddToCart={handleAddToCartClick}
                    onLike={handleLike}
                    isLiked={isLiked(device.id)}
                    likesCount={getLikes(device.id)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {currentProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No devices found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchTerm("");
                    }}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Device Detail Modal */}
      <AnimatePresence>
        {selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDevice(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto text-black dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                  {/* Image Gallery */}
                  <div>
                    <div className="rounded-2xl overflow-hidden mb-4">
                      <img
                        src={selectedDevice.image}
                        alt={selectedDevice.name}
                        className="w-full h-64 sm:h-72 md:h-80 object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {selectedDevice.images?.map((img, index) => (
                        <motion.img
                          key={index}
                          src={img}
                          alt={`${selectedDevice.name} ${index + 1}`}
                          className="w-full h-20 sm:h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                          whileHover={{ scale: 1.05 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Device Details */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedDevice(null)}
                      className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-gradient-to-b from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200"
                    >
                      <Close className="w-4 h-4" />
                    </button>

                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedDevice.isNew && (
                          <span className="bg-gradient-to-b from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            NEW
                          </span>
                        )}
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {selectedDevice.brand}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedDevice.name}
                      </h1>
                      <StarRating rating={selectedDevice.rating} />
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <Favorite className="w-4 h-4 text-red-500" />
                          {getLikes(selectedDevice.id)} likes
                        </span>
                        <button
                          onClick={() => handleLike(selectedDevice.id)}
                          className="flex items-center gap-2 bg-gradient-to-b from-blue-400 to-indigo-300 text-white px-4 py-2 rounded-xl hover:from-blue-500 hover:to-indigo-400 transition-all duration-200"
                        >
                          {isLiked(selectedDevice.id) ? "Liked" : "Like"}
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-3">
                        {selectedDevice.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 sm:p-6 mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                          ${selectedDevice.price}
                        </span>
                        {selectedDevice.originalPrice >
                          selectedDevice.price && (
                          <>
                            <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                              ${selectedDevice.originalPrice}
                            </span>
                            <span className="bg-gradient-to-b from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                              Save {selectedDevice.discount}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAddToCartClick(selectedDevice)}
                          disabled={!selectedDevice.inStock}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-t from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Add className="w-4 h-4" />
                          {selectedDevice.inStock
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDevice.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedDevice.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2"
                            >
                              <span className="text-gray-600 dark:text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>
                              <span className="text-gray-900 dark:text-white font-medium text-right">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to Cart Confirmation Modal */}
      <AddToCartModal
        product={selectedProduct}
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        onConfirm={handleConfirmAddToCart}
        onViewCart={handleViewCart}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal && checkoutStep === "cart"}
        onClose={() => setShowCartModal(false)}
        onCheckout={handleCheckout}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getCartTotal={getCartTotal}
      />

      {/* Checkout Flow Modals */}
      <AnimatePresence>
        {(checkoutStep === "user-info" ||
          checkoutStep === "payment" ||
          checkoutStep === "success" ||
          checkoutStep === "failed") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {checkoutStep === "user-info" && (
              <UserInfoForm
                cart={cart}
                getCartTotal={getCartTotal}
                onBack={() => setCheckoutStep("cart")}
                onSubmit={handleUserInfoSubmit}
                isLoading={isLoading}
              />
            )}

            {checkoutStep === "payment" && (
              <PaymentMethod
                cart={cart}
                getCartTotal={getCartTotal}
                userInfo={userInfo}
                onBack={() => setCheckoutStep("user-info")}
                onSubmit={handlePaymentSubmit}
                isLoading={isLoading || isProcessing}
              />
            )}

            {checkoutStep === "success" && orderDetails && (
              <PaymentSuccess
                orderDetails={orderDetails}
                onContinueShopping={handleContinueShopping}
                onViewInvoice={handleViewInvoice}
              />
            )}

            {checkoutStep === "failed" && (
              <PaymentFailed
                onRetry={handleRetryPayment}
                onCancel={handleContinueShopping}
                errorMessage={paymentError}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
        onSubmit={handleCreateProduct}
        isLoading={isCreatingProduct}
      />

      {/* Invoice Modal */}
      <Invoice
        orderDetails={orderDetails}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
};