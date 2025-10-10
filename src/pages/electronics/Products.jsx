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
} from "@mui/icons-material";
import { electronicDevices, stats } from "../../assets/images/images";

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
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className=" bg-gradient-to-tr from-blue-400 to-indigo-400"
      >
        <ArrowBack className="w-4 h-4" />
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <div onClick={() => onPageChange(1)}>1</div>
          {startPage > 2 && <span className="text-gray-500 px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <div
          key={page}
          onClick={() => onPageChange(page)}
          className="bg-gradient-to-br p-3 rounded-2xl from-indigo-400 to-blue-400"
        >
          {page}
        </div>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-500 px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="bg-gradient-to-b from-blue-600 to-indigo-400"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gradient-to-br from-blue-400 to-indigo-400"
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

  const calculateSubtotal = () => {
    return orderDetails.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="text-blue-600" />
            Invoice
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-gradient-to-l from-green-500 to-green-600"
            >
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={handlePrint}
              className="bg-gradient-to-l from-blue-500 to-blue-600"
            >
              <Print className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gradient-to-l from-red-400 to-red-500 "
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            ref={invoiceRef}
            className="bg-white p-8 rounded-2xl border-2 border-gray-200 invoice-print"
            style={{ minHeight: "1000px" }}
          >
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-gray-300 pb-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Business className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Future Electronics
                  </h1>
                  <p className="text-lg text-gray-600 mb-1">
                    Innovating Tomorrow, Today
                  </p>
                  <div className="text-gray-500 space-y-1">
                    <p className="flex items-center gap-2">
                      <LocationOn className="w-4 h-4" />
                      123 Tech Innovation Avenue, Kigali Heights, Rwanda
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      +250 788 123 456
                    </p>
                    <p className="flex items-center gap-2">
                      <Email className="w-4 h-4" />
                      info@futureelectronics.com
                    </p>
                    <p>www.futureelectronics.com</p>
                  </div>
                </div>
              </div>

              <div className="text-right bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-end gap-2">
                  <Receipt className="text-blue-600" />
                  INVOICE
                </h2>
                <div className="space-y-2 text-lg">
                  <p className="flex items-center justify-end gap-2">
                    <strong className="text-gray-700">Invoice #:</strong>{" "}
                    {orderDetails.orderId}
                  </p>
                  <p className="flex items-center justify-end gap-2">
                    <strong className="text-gray-700">Date:</strong>{" "}
                    {formatDate(orderDetails.createdAt)}
                  </p>
                  <p className="flex items-center justify-end gap-2">
                    <strong className="text-gray-700">Status:</strong>
                    <span className="ml-3 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      PAID
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Person className="mr-3 text-blue-600" />
                  Bill To:
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <p className="font-bold text-xl text-gray-900 mb-2">
                    {orderDetails.user.firstName} {orderDetails.user.lastName}
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Email className="w-4 h-4" />
                      {orderDetails.user.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {orderDetails.user.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <LocationOn className="w-4 h-4" />
                      {orderDetails.user.address}
                    </p>
                    <p>
                      {orderDetails.user.city}, {orderDetails.user.country}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="mr-3 text-green-600" />
                  Payment Method:
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <p className="font-bold text-xl text-gray-900 mb-2 capitalize">
                    {orderDetails.payment.paymentMethod.replace("_", " ")}
                  </p>
                  {orderDetails.payment.paymentMethod === "credit_card" && (
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Card ending in{" "}
                        {orderDetails.payment.paymentDetails.cardNumber.slice(
                          -4
                        )}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📅</span>
                        Expires:{" "}
                        {orderDetails.payment.paymentDetails.expiryDate}
                      </p>
                    </div>
                  )}
                  {orderDetails.payment.paymentMethod === "mobile_money" && (
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        {orderDetails.payment.paymentDetails.network.toUpperCase()}{" "}
                        Mobile Money
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {orderDetails.payment.paymentDetails.mobileNumber}
                      </p>
                    </div>
                  )}
                  <p className="text-green-600 font-semibold mt-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Paid on {formatDate(orderDetails.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <ShoppingCart className="mr-3 text-purple-600" />
                Order Details
              </h3>
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-black">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <tr>
                      <th className="px-8 py-6 text-left text-lg font-bold text-white uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-8 py-6 text-center text-lg font-bold text-white uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-8 py-6 text-right text-lg font-bold text-white uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-8 py-6 text-right text-lg font-bold text-white uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderDetails.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">
                                {item.name}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {item.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-lg">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-semibold text-gray-900 text-lg">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-8 py-6 text-right font-bold text-gray-900 text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-700 font-semibold">
                      Subtotal:
                    </span>
                    <span className="font-bold text-gray-900">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-700 font-semibold">
                      Shipping:
                    </span>
                    <span className="font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-5 h-5" />
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-700 font-semibold">
                      Tax (0%):
                    </span>
                    <span className="font-bold text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        Total:
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        ${orderDetails.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 pt-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <LocalShipping className="w-5 h-5 text-blue-600" />
                    Delivery Info
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <Support className="w-5 h-5 text-green-600" />
                    Support
                  </h4>
                  <p className="text-gray-600 text-sm">
                    support@futureelectronics.com
                    <br />
                    +250 788 123 456
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <span className="text-yellow-600">⭐</span>
                    Thank You
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Thank you for choosing Future Electronics
                  </p>
                </div>
              </div>
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <Receipt className="w-4 h-4" />
                  This is an computer-generated invoice. No signature required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
        className="bg-white rounded-3xl max-w-md w-full text-black overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="text-blue-600 font-semibold">${product.price}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-l from-red-500 to-red-700"
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
                className="bg-gradient-to-t from-red-400 to-red-500"
              >
                <Remove className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gradient-to-r from-blue-300 to-indigo-300"
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
              className="bg-gradient-to-b from-blue-400 to-indigo-400"
            >
              <Add className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onConfirm(product, quantity);
                onViewCart();
              }}
              className="w-full bg-gradient-to-l from-blue-600 to-blue-700"
            >
              Add to Cart & View Cart
            </button>
            <button
              onClick={onClose}
              className="bg-gradient-to-l from-violet-400 to-indigo-400"
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
              className="bg-gradient-to-l from-red-500 to-red-600"
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
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-blue-600 font-semibold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gradient-to-b from-red-400 to-red-500"
                    >
                      <Remove className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gradient-to-t from-blue-400 to-indigo-400"
                    >
                      <Add className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-gradient-to-t from-red-300 to-red-500"
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
              className="w-full bg-gradient-to-t from-purple-600 to-purple-700"
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
      className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="bg-gradient-to-bl from-purple-600 to-purple-700"
        >
          <ArrowBack className="w-4 h-4" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Person className="text-blue-600" />
          Customer Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-2 gap-4">
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
          className="w-full bg-gradient-to-b from-indigo-600 to-indigo-700"
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
      className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="bg-gradient-to-b from-indigo-600 to-indigo-700"
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
          <div className="grid grid-cols-1 xsm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("mobile_money")}
              className="flex-col h-20 bg-gradient-to-r from-green-500 to-green-600"
            >
              <Smartphone className="text-2xl" />
              <span className="text-sm">Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("credit_card")}
              className="flex-col h-20 bg-gradient-to-b from-blue-500 to-blue-600"
            >
              <CreditCard className="text-2xl" />
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

            <div className="grid grid-cols-1 xsm:grid-cols-2 gap-4">
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
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 text-sm ml-2">
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
          className="w-full bg-gradient-to-t from-green-600 to-green-700"
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
    className="bg-white rounded-3xl p-8 text-center max-w-md w-full text-black"
  >
    <div className="w-20 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="text-white text-4xl" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-4">
      Payment Successful!
    </h2>
    <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
    <p className="text-gray-600 mb-6">
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
            ${orderDetails.total}
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

    <div className="space-y-3">
      <button
        onClick={onViewInvoice}
        className="w-full bg-gradient-to-b from-blue-600 to-blue-700"
      >
        <Receipt className="w-5 h-5" />
        View Invoice
      </button>
      <button
        onClick={onContinueShopping}
        className="w-full bg-gradient-to-t from-green-600 to-green-700"
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
    className="bg-white rounded-3xl p-8 text-center max-w-md w-full text-black"
  >
    <div className="w-20 h-20 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <Error className="text-white text-4xl" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
    <p className="text-gray-600 mb-2">
      {errorMessage || "We couldn't process your payment."}
    </p>
    <p className="text-gray-600 mb-6">
      Please check your payment details and try again.
    </p>

    <div className="flex space-x-3">
      <button
        onClick={onCancel}
        className="flex-1 bg-gradient-to-r from-red-400 to-red-600"
      >
        <ArrowBack className="w-5 h-5" />
        Cancel
      </button>
      <button
        onClick={onRetry}
        className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700"
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
          alt=""
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
          <div
            onClick={(e) => {
              e.stopPropagation();
              onLike(device.id);
            }}
            gradient={
              isLiked ? "from-red-500 to-red-600" : "from-gray-400 to-gray-500"
            }
            hoverGradient={
              isLiked ? "from-red-600 to-red-700" : "from-gray-500 to-gray-600"
            }
            size="sm"
            className="w-8 h-8 min-w-0 p-0 "
            startIcon={
              isLiked ? (
                <Favorite className="w-4 h-4" />
              ) : (
                <FavoriteBorder className="w-4 h-4" />
              )
            }
          />
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
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {device.name}
          </h3>
          <div className="flex items-center space-x-1">
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
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700"
          >
            <span className="text-sm">👁️</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(device);
            }}
            disabled={!device.inStock}
            className="bg-gradient-to-t from-blue-500 to-blue-600"
          >
            <ShoppingCart />
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
          className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-full p-3 shadow-lg border border-white/20 relative hover:from-blue-600 hover:to-blue-700"
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

        <div className="relative max-w-7xl mx-auto px-4 xsm:px-4 sm:px-6 lg:px-8 text-center">
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
            <h1 className="text-4xl xsm:text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Future Electronics
            </h1>
            <p className="text-lg xsm:text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
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
        <div className="max-w-7xl mx-auto px-4 xsm:px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 xsm:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 xsm:gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 xsm:p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100"
              >
                <div className="text-2xl xsm:text-2xl sm:text-3xl mb-2">
                  {stat.icon}
                </div>
                <div className="text-xl xsm:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs xsm:text-xs sm:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Filters */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 xsm:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📂</span>
                  Categories
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className="w-full bg-gradient-to-b flex from-blue-400 to-indigo-400 justify-between text-left"
                    >
                      {category.icon}
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          activeCategory === category.id
                            ? "bg-white text-gray-900"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

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
              </div>
            </div>

            {/* Devices Grid */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 xsm:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xsm:gap-4 sm:gap-6">
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
              <div className="p-4 xsm:p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xsm:gap-6 sm:gap-8 md:gap-12">
                  {/* Image Gallery */}
                  <div>
                    <div className="rounded-2xl overflow-hidden mb-4">
                      <img
                        src={selectedDevice.image}
                        alt=""
                        className="w-full h-64 xsm:h-64 sm:h-72 md:h-80 object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 xsm:gap-2 sm:gap-3">
                      {selectedDevice.images.map((img, index) => (
                        <motion.img
                          key={index}
                          src={img}
                          alt={`${selectedDevice.name} ${index + 1}`}
                          className="w-full h-20 xsm:h-20 sm:h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                          whileHover={{ scale: 1.05 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Device Details */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedDevice(null)}
                      className="bg-gradient-to-b from-red-500 to-red-700"
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
                      <h1 className="text-2xl xsm:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {selectedDevice.name}
                      </h1>
                      <StarRating rating={selectedDevice.rating} />
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Favorite className="w-4 h-4 text-red-500" />
                          {getLikes(selectedDevice.id)} likes
                        </span>
                        <button className="bg-gradient-to-b from-blue-400 to-indigo-300" onClick={() => handleLike(selectedDevice.id)}>
                          {isLiked(selectedDevice.id) ? "Liked" : "Like"}
                        </button>
                      </div>
                      <p className="text-gray-600 mt-3">
                        {selectedDevice.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-2xl p-4 xsm:p-4 sm:p-6 mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-2xl xsm:text-2xl sm:text-3xl font-bold text-gray-900">
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
                          className="flex-1 bg-gradient-to-t from-blue-600 to-blue-700"
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
                      <div className="grid grid-cols-1 xsm:grid-cols-1 sm:grid-cols-2 gap-3">
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
