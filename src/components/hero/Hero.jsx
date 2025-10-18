/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hero from "../../assets/videos/head.mp4";
import { companyData, galleryImages, productCategories } from "../../assets/images/images";

// SVG Icons
const CompanyIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const ContactIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const GalleryIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ProductIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const LoadingSpinner = ({ size = "md", text = "" }) => (
  <div className="flex items-center justify-center space-x-2">
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${
        size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
      }`}
    ></div>
    {text && <span className="text-white text-sm">{text}</span>}
  </div>
);

// Product Details Modal Component
const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {product.name}
                </h2>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-tl from-red-500 to-red-700 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {product.additionalImages?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.fullDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Specifications
                    </h3>
                    <div className="space-y-2">
                      {product.specifications?.map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between border-b border-gray-200 pb-2"
                        >
                          <span className="text-gray-600 font-medium">
                            {spec.name}:
                          </span>
                          <span className="text-gray-800">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Price Range
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {product.priceRange}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Features
                    </h3>
                    <ul className="space-y-2">
                      {product.features?.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Product Categories Modal Component
const ProductsModal = ({ isOpen, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay onClose={onClose}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Our Electronic Products
                  </h2>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-br from-red-600 to-red-700 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <p className="text-gray-600 text-lg mb-8 text-center">
                  Discover our wide range of premium computing solutions
                  tailored to your needs
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200"
                    >
                      <div
                        className={`h-2 bg-gradient-to-r ${category.gradient}`}
                      ></div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {category.name}
                          </h3>
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center`}
                          >
                            <ProductIcon />
                          </div>
                        </div>

                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />

                        <p className="text-gray-600 text-sm mb-3">
                          {category.description}
                        </p>

                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">
                            Products Include:
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {category.products.map((product, index) => (
                              <li key={index} className="flex items-center">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${category.gradient} mr-2`}
                                ></div>
                                {product}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {category.priceRange}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(category)}
                            className={`bg-gradient-to-r ${category.gradient} text-white px-4 py-2 rounded-lg text-xs font-semibold`}
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Can't find what you're looking for? We offer custom
                    solutions!
                  </p>
                </div>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        product={selectedProduct}
      />
    </>
  );
};

// Company Info Modal Component
const CompanyInfoModal = ({ isOpen, onClose }) => {


  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  About Our Company
                </h2>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-bl from-red-600 to-red-700 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Who We Are
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {companyData.about}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Our Mission
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {companyData.mission}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Our Vision
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {companyData.vision}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Our Services
                    </h3>
                    <ul className="space-y-2">
                      {companyData.services.map((service, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Achievements
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {companyData.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 rounded-lg p-3 text-center"
                        >
                          <p className="text-sm text-blue-700 font-medium">
                            {achievement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Gallery Modal Component
const GalleryModal = ({ isOpen, onClose }) => {


  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Our Gallery
                </h2>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-l from-red-500 to-red-700 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt=''
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Contact Form Modal Component
const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    interest: "general",
    budget: "500-1000",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      if (response.data.success) {
        toast.success("Message sent successfully! We'll contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
          interest: "general",
          budget: "500-1000",
        });
        onClose();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white text-black rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-b from-red-600 to-red-700 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area of Interest
                    </label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="gaming">Gaming Computers</option>
                      <option value="business">Business Solutions</option>
                      <option value="creative">Creative Workstations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="5000+">$5,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your message"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <LoadingSpinner text="Sending..." />
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Modal Overlay Component
const ModalOverlay = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </motion.div>
);

// Hover Info Board Component 
const HoverInfoBoard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute top-20 right-4 bg-white/95 dark:text-black backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 max-w-xs z-20"
  >
    <h3 className="text-lg font-bold text-blue-400 mb-3">
      Why Choose Nexus Computers?
    </h3>
    <ul className="space-y-2 text-sm text-gray-600">
      <li className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        15+ Years Experience
      </li>
      <li className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        5000+ Happy Customers
      </li>
      <li className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        24/7 Support
      </li>
      <li className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        ISO Certified
      </li>
    </ul>
  </motion.div>
);

// Main Header Component
export const Hero = () => {
  const [showHoverInfo, setShowHoverInfo] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="w-full mt-2 dark:text-white h-screen rounded-2xl mb-2 relative">
        {/* Video Background */}
        <div className="relative h-screen w-full overflow-hidden">
          <video
            className="absolute inset-0 w-full h-screen object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={hero} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b"></div>

          {/* Content */}
          <div className="relative z-10 py-4 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-7xl mt-18 ">
              {/* Announcement Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    GET YOUR DESIRED COMPUTER AT A REASONABLE PRICE
                  </span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Premium Computing
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Solutions
                </span>
              </motion.h1>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProductsModalOpen(true)}
                  className="bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </motion.button>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCompanyModalOpen(true)}
                    className="bg-gradient-to-tr from-green-500 to-emerald-600 backdrop-blur-lg text-white border border-white/20 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <CompanyIcon />
                    Read More
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsContactModalOpen(true)}
                    className="bg-gradient-to-tr from-orange-500 to-red-600 backdrop-blur-lg text-white border border-white/20 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <ContactIcon />
                    Contact
                  </motion.button>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/5 backdrop-blur-lg border mb-10 border-white/10 rounded-2xl p-6 max-w-4xl mx-auto"
              >
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  Nexus Computer store Rwanda Limited is a full service Technology
                  services provider also called the top IT consulting company in
                  Kigali, Rwanda.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap mb-4 justify-center gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setShowHoverInfo(true)}
                    onMouseLeave={() => setShowHoverInfo(false)}
                    className="bg-gradient-to-tr from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md"
                  >
                    <CompanyIcon />
                    Company Info
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsGalleryModalOpen(true)}
                    className="bg-gradient-to-tr from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md"
                  >
                    <GalleryIcon />
                    View Gallery
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProductsModalOpen(true)}
                    className="bg-gradient-to-tr from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md"
                  >
                    <ProductIcon />
                    View Products
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hover Info Board */}
          <AnimatePresence>
            {showHoverInfo && <HoverInfoBoard />}
          </AnimatePresence>
        </div>

        {/* Modals */}
        <ProductsModal
          isOpen={isProductsModalOpen}
          onClose={() => setIsProductsModalOpen(false)}
        />

        <CompanyInfoModal
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        <GalleryModal
          isOpen={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
        />
      </div>
    </>
  );
};
