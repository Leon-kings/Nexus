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
} from "@mui/icons-material";

// Mock data for electronic devices and stats
const electronicDevices = [
  {
    id: 1,
    name: "MacBook Pro 16-inch",
    brand: "Apple",
    price: 2399,
    originalPrice: 2599,
    discount: 8,
    category: "laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    ],
    description:
      "Powerful laptop for professionals with M2 Pro chip, 16GB RAM, and 1TB SSD.",
    features: [
      "M2 Pro Chip",
      "16GB RAM",
      "1TB SSD",
      "16-inch Retina Display",
      "Touch Bar",
    ],
    specifications: {
      processor: "Apple M2 Pro",
      memory: "16GB",
      storage: "1TB SSD",
      display: "16-inch Retina",
      graphics: "Integrated 19-core GPU",
    },
    rating: 4.8,
    isNew: true,
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 999,
    originalPrice: 1099,
    discount: 9,
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    ],
    description:
      "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
    features: [
      "A17 Pro Chip",
      "Titanium Design",
      "Pro Camera System",
      "5G",
      "Face ID",
    ],
    specifications: {
      processor: "A17 Pro",
      memory: "8GB",
      storage: "128GB",
      display: "6.1-inch Super Retina",
      camera: "48MP Main",
    },
    rating: 4.7,
    isNew: true,
    inStock: true,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 399,
    originalPrice: 449,
    discount: 11,
    category: "audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    ],
    description:
      "Industry-leading noise canceling headphones with exceptional sound quality.",
    features: [
      "Noise Canceling",
      "30hr Battery",
      "Touch Controls",
      "Voice Assistant",
      "Quick Charge",
    ],
    specifications: {
      battery: "30 hours",
      connectivity: "Bluetooth 5.2",
      weight: "250g",
      features: "Noise Canceling, Touch Controls",
    },
    rating: 4.6,
    isNew: false,
    inStock: true,
  },
  {
    id: 4,
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    price: 329,
    originalPrice: 359,
    discount: 8,
    category: "wearables",
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400",
    images: [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400",
      "https://images.unsplash.com/photo-1434493652601-8dabae5c8e6a?w=400",
    ],
    description:
      "Advanced smartwatch with health monitoring and premium design.",
    features: [
      "Health Monitoring",
      "GPS",
      "Water Resistant",
      "Sleep Tracking",
      "Voice Assistant",
    ],
    specifications: {
      display: "1.5-inch AMOLED",
      battery: "40 hours",
      connectivity: "Bluetooth, Wi-Fi",
      features: "GPS, Heart Rate Monitor",
    },
    rating: 4.4,
    isNew: true,
    inStock: true,
  },
  {
    id: 5,
    name: "LG OLED C3 Series",
    brand: "LG",
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    category: "tvs",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400",
    ],
    description: "65-inch 4K Smart TV with OLED technology and webOS platform.",
    features: ["4K OLED", "Smart TV", "HDR", "webOS", "Dolby Atmos"],
    specifications: {
      size: "65-inch",
      resolution: "4K UHD",
      technology: "OLED",
      features: "Smart TV, HDR",
    },
    rating: 4.5,
    isNew: false,
    inStock: true,
  },
  {
    id: 6,
    name: "iPad Air 5th Gen",
    brand: "Apple",
    price: 599,
    originalPrice: 649,
    discount: 8,
    category: "tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    ],
    description: "Powerful tablet with M1 chip and Liquid Retina display.",
    features: [
      "M1 Chip",
      "Liquid Retina",
      "5G",
      "Touch ID",
      "Apple Pencil Support",
    ],
    specifications: {
      processor: "Apple M1",
      display: "10.9-inch Liquid Retina",
      storage: "64GB",
      features: "5G, Touch ID",
    },
    rating: 4.6,
    isNew: true,
    inStock: true,
  },
  {
    id: 7,
    name: "PlayStation 5",
    brand: "Sony",
    price: 499,
    originalPrice: 499,
    discount: 0,
    category: "gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    ],
    description:
      "Next-gen gaming console with ultra-high speed SSD and ray tracing.",
    features: [
      "4K Gaming",
      "Ray Tracing",
      "SSD",
      "Backward Compatible",
      "3D Audio",
    ],
    specifications: {
      storage: "825GB SSD",
      resolution: "8K",
      features: "Ray Tracing, 3D Audio",
    },
    rating: 4.8,
    isNew: false,
    inStock: false,
  },
  {
    id: 8,
    name: "Google Nest Hub",
    brand: "Google",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "smart-home",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?w=400",
    images: [
      "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?w=400",
      "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?w=400",
    ],
    description:
      "Smart display with Google Assistant for home control and entertainment.",
    features: [
      "Google Assistant",
      "Touch Screen",
      "Smart Home Control",
      "Video Streaming",
      "Voice Control",
    ],
    specifications: {
      display: "7-inch",
      features: "Google Assistant, Smart Home Control",
    },
    rating: 4.3,
    isNew: true,
    inStock: true,
  },
  {
    id: 9,
    name: "Canon EOS R5",
    brand: "Canon",
    price: 3899,
    originalPrice: 4299,
    discount: 9,
    category: "cameras",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
    ],
    description:
      "Professional mirrorless camera with 45MP and 8K video recording.",
    features: [
      "45MP Full Frame",
      "8K Video",
      "IBIS",
      "Dual Pixel AF",
      "Weather Sealed",
    ],
    specifications: {
      sensor: "45MP Full Frame",
      video: "8K",
      features: "IBIS, Weather Sealed",
    },
    rating: 4.7,
    isNew: false,
    inStock: true,
  },
];

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
const API_BASE_URL = "http://localhost:5000/api";

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
          className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center sm:justify-start">
              <Receipt className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
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
              className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-200 invoice-print"
              style={{ minHeight: "800px" }}
            >
              {/* Invoice Header - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-start gap-6 sm:gap-8 mb-8 sm:mb-12 border-b-2 border-gray-300 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full lg:w-auto">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                    <Business className="text-white text-lg sm:text-xl md:text-2xl" />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Future Electronics
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-3">
                      Innovating Tomorrow, Today
                    </p>
                    <div className="text-gray-500 space-y-1 text-sm sm:text-base">
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

                <div className="text-center sm:text-right bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 w-full lg:w-auto">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center justify-center sm:justify-end gap-2">
                    <Receipt className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                    INVOICE
                  </h2>
                  <div className="space-y-2 text-sm sm:text-base md:text-lg">
                    <p className="flex items-center justify-center sm:justify-end gap-2">
                      <strong className="text-gray-700">Invoice #:</strong>
                      <span className="font-mono">{orderDetails.orderId}</span>
                    </p>
                    <p className="flex items-center justify-center sm:justify-end gap-2">
                      <strong className="text-gray-700">Date:</strong>
                      {formatDate(orderDetails.createdAt)}
                    </p>
                    <p className="flex items-center justify-center sm:justify-end gap-2">
                      <strong className="text-gray-700">Status:</strong>
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
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-center lg:justify-start">
                    <Person className="mr-2 sm:mr-3 text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    Bill To:
                  </h3>
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <p className="font-bold text-lg sm:text-xl text-gray-900 mb-2 text-center lg:text-left">
                      {orderDetails.user.firstName} {orderDetails.user.lastName}
                    </p>
                    <div className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
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
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-center lg:justify-start">
                    <CreditCard className="mr-2 sm:mr-3 text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                    Payment Method:
                  </h3>
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <p className="font-bold text-lg sm:text-xl text-gray-900 mb-2 text-center lg:text-left capitalize">
                      {orderDetails.payment.paymentMethod.replace("_", " ")}
                    </p>
                    <div className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                      {orderDetails.payment.paymentMethod === "credit_card" && (
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
                      {orderDetails.payment.paymentMethod ===
                        "mobile_money" && (
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center justify-center lg:justify-start">
                  <ShoppingCart className="mr-2 sm:mr-3 text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
                  Order Details
                </h3>
                <div className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  {/* Mobile View - Cards */}
                  <div className="block sm:hidden">
                    {orderDetails.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-4 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } border-b border-gray-200`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {item.brand}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Qty</p>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold text-xs">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Price</p>
                            <p className="font-semibold text-gray-900">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600 text-xs">Total</p>
                            <p className="font-bold text-gray-900">
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
                        <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                          <th className="text-left p-4 font-semibold text-gray-900">
                            Product
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900">
                            Quantity
                          </th>
                          <th className="text-right p-4 font-semibold text-gray-900">
                            Price
                          </th>
                          <th className="text-right p-4 font-semibold text-gray-900">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    {item.brand}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="text-center p-4">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="text-right p-4 font-semibold text-gray-900">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="text-right p-4 font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 border border-blue-200">
                  <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600 text-xl sm:text-2xl">
                      ${orderDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer - Responsive Grid */}
              <div className="border-t border-gray-300 pt-6 sm:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <LocalShipping className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Delivery Info
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <Support className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      Support
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      support@futureelectronics.com
                      <br className="hidden sm:block" />
                      +250 788 123 456
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                      <span className="text-yellow-600 text-sm sm:text-base">
                        ⭐
                      </span>
                      Thank You
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Thank you for choosing Future Electronics
                    </p>
                  </div>
                </div>
                <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
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
        className="bg-white rounded-3xl max-w-md w-full text-black overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-blue-600 font-semibold">${product.price}</p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-l from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 flex-shrink-0"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-t from-red-400 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-200"
              >
                <Remove className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center">
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

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-lg font-bold text-gray-900">
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
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="text-blue-600" />
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-l from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <span>{cart.length} items in cart</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto max-h-96">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="text-6xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600">
                Add some amazing devices to get started!
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4"
                >
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-blue-600 font-semibold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex items-center justify-center w-8 h-8 bg-gradient-to-b from-red-200 to-red-400 text-white rounded-lg hover:from-red-300 hover:to-red-500 transition-all duration-200"
                    >
                      <Remove className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
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
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-2xl font-bold text-green-600">
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
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-bl from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
        >
          <ArrowBack className="w-4 h-4" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Person className="text-blue-600" />
          Customer Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Person className="w-4 h-4" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Person className="w-4 h-4" />
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Email className="w-4 h-4" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <LocationOn className="w-4 h-4" />
            Delivery Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter complete delivery address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <LocationOn className="w-4 h-4" />
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <LocationOn className="w-4 h-4" />
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="Rwanda">Rwanda</option>
              <option value="Uganda">Uganda</option>
              <option value="Kenya">Kenya</option>
              <option value="Tanzania">Tanzania</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" />
            Order Summary
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 text-sm">
                    x{item.quantity}
                  </span>
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">
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
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mobileNumber: "",
    network: "mtn",
  });

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentMethod,
      paymentDetails,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
        >
          <ArrowBack className="w-4 h-4" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="text-blue-600" />
          Payment Method
        </h2>
      </div>

      <form onSubmit={handlePaymentSubmit} className="space-y-6 text-black">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Select Payment Method *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("mobile_money")}
              className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all duration-200 ${
                paymentMethod === "mobile_money"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
              }`}
            >
              <Smartphone className="text-2xl mb-1" />
              <span className="text-sm">Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("credit_card")}
              className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all duration-200 ${
                paymentMethod === "credit_card"
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
        {paymentMethod === "credit_card" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-blue-600" />
              Card Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "mobile_money" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Smartphone className="text-green-600" />
              Mobile Money Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="mtn">MTN Mobile Money</option>
                <option value="airtel">Airtel Money</option>
                <option value="tigo">Tigo Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm flex items-center gap-2">
                <span>💡</span>
                <strong>Note:</strong> You will receive a payment prompt on your
                phone to complete the transaction.
              </p>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" />
            Order Summary
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate">{item.name}</span>
                  <span className="text-gray-600 text-sm ml-2">
                    x{item.quantity}
                  </span>
                </div>
                <span className="font-medium flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info Preview */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LocalShipping className="text-blue-600" />
            Delivery Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">
                {userInfo.firstName} {userInfo.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{userInfo.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-right">
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
    className="bg-white rounded-3xl p-6 sm:p-8 text-center max-w-md w-full text-black"
  >
    <div className="overflow-y-auto">
      <div className="w-20 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-white text-4xl" />
      </div>
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h2>
      <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
      <p className="text-gray-600 mb-2">
        Your order has been confirmed and is being processed.
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Details
        </h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium text-green-600">
              ${orderDetails.total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">
              {orderDetails.payment.paymentMethod.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Delivery:</span>
            <span className="font-medium">3-5 business days</span>
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
    className="bg-white rounded-3xl p-6 sm:p-8 overflow-y-auto text-center max-w-md w-full text-black"
  >
    <div className="w-20 h-20 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <Error className="text-white text-4xl" />
    </div>
    <h2 className="text-3xl font-bold text-red-700 mb-4">Payment Failed</h2>
    <p className="text-gray-600 mb-2">
      {errorMessage || "We couldn't process your payment."}
    </p>
    <p className="text-gray-600 mb-6">
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
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group"
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
            className="flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
          >
            {isLiked ? (
              <Favorite className="w-4 h-4 text-red-500" />
            ) : (
              <FavoriteBorder className="w-4 h-4 text-gray-600" />
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
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 pr-2">
            {device.name}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Star className="text-yellow-400 w-4 h-4" />
            <span className="text-sm text-gray-600">{device.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {device.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${device.price}
            </span>
            {device.originalPrice > device.price && (
              <span className="text-sm text-gray-500 line-through">
                ${device.originalPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {device.brand}
          </span>
        </div>

        {/* Features Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {device.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
              >
                {feature.split(" ")[0]}
              </span>
            ))}
            {device.features.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(device);
            }}
            disabled={!device.inStock}
            className="flex items-center justify-center gap-2 bg-gradient-to-t from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
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
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
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
                flex items-center justify-between p-4 rounded-xl transition-all duration-300 transform hover:scale-105
                ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
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
                      : "bg-gray-100"
                  }
                `}
                >
                  {category.icon}
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
                    : "bg-gray-200 text-gray-600"
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
      icon: <SettingsInputAntenna className="w-5 h-5" />,
      count: electronicDevices.length,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "laptops",
      name: "Laptops",
      icon: <Laptop className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "laptops").length,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "smartphones",
      name: "Smartphones",
      icon: <PhoneIphone className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "smartphones")
        .length,
      gradient: "from-green-500 to-green-600",
    },
    {
      id: "audio",
      name: "Audio",
      icon: <Headphones className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "audio").length,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      id: "wearables",
      name: "Wearables",
      icon: <Watch className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "wearables").length,
      gradient: "from-red-500 to-red-600",
    },
    {
      id: "tvs",
      name: "TVs",
      icon: <Tv className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "tvs").length,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      id: "tablets",
      name: "Tablets",
      icon: <Tablet className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "tablets").length,
      gradient: "from-pink-500 to-pink-600",
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: <SportsEsports className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "gaming").length,
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      id: "smart-home",
      name: "Smart Home",
      icon: <Home className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "smart-home")
        .length,
      gradient: "from-teal-500 to-teal-600",
    },
    {
      id: "cameras",
      name: "Cameras",
      icon: <CameraAlt className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "cameras").length,
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      id: "monitors",
      name: "Monitors",
      icon: <Computer className="w-5 h-5" />,
      count: electronicDevices.filter((d) => d.category === "monitors").length,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: <SettingsInputAntenna className="w-5 h-5" />,
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
      // Simulate API call to process payment
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate random payment success (80% success rate)
      const paymentSuccess = Math.random() > 0.2;

      if (paymentSuccess) {
        const orderData = {
          orderId: `ORD${Date.now()}`,
          user: userInfo,
          payment: paymentData,
          items: cart,
          total: getCartTotal(),
          status: "confirmed",
          createdAt: new Date().toISOString(),
        };

        setOrderDetails(orderData);
        setCheckoutStep("success");
        clearCart();
        toast.success("Order placed successfully!");
      } else {
        setPaymentError(
          "Insufficient funds. Please try a different payment method."
        );
        setCheckoutStep("failed");
        toast.error("Payment failed. Please try again.");
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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mt-2 mb-1 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
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
              <div className="relative text-black">
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
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100"
              >
                <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
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
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📂</span>
                  Categories
                </h3>

                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />

                {/* Sort Options */}
                <div className="mt-8 text-black">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🔧</span>
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    Showing {currentProducts.length} of {filteredDevices.length}{" "}
                    products
                  </p>
                  {activeCategory !== "all" && (
                    <p className="text-xs text-blue-600 mt-1">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No devices found
                  </h3>
                  <p className="text-gray-600">
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
              className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto text-black"
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
                        <span className="text-blue-600 font-semibold">
                          {selectedDevice.brand}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {selectedDevice.name}
                      </h1>
                      <StarRating rating={selectedDevice.rating} />
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
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
                      <p className="text-gray-600 mt-3">
                        {selectedDevice.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          ${selectedDevice.price}
                        </span>
                        {selectedDevice.originalPrice >
                          selectedDevice.price && (
                          <>
                            <span className="text-xl text-gray-500 line-through">
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
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDevice.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedDevice.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between border-b border-gray-200 pb-2"
                            >
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>
                              <span className="text-gray-900 font-medium text-right">
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
                isLoading={isLoading}
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

      {/* Invoice Modal */}
      <Invoice
        orderDetails={orderDetails}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
};
