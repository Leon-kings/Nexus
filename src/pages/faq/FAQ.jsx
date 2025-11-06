/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faqData } from "../../assets/images/images";
import axios from "axios";

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl border border-gray-200 dark:border-gray-600"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Question Submitted Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your question. We've received it and will
              get back to you within 24 hours.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              Close
            </button>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, errorMessage, onContactDirectly }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl border border-gray-200 dark:border-gray-600"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
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
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Failed to Submit Question
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {errorMessage ||
                "There was an error submitting your question. Please try again."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              If the problem persists, please try contacting us directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-br from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={onContactDirectly}
                className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                Contact Directly
              </button>
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

// FAQ Item Component
const FAQItem = ({ item, isOpen, onClick, categoryGradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <button
        onClick={() => onClick(item.id)}
        className="w-full text-left p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black dark:text-white pr-4 transition-colors duration-200">
            {item.question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${categoryGradient} flex items-center justify-center shadow-md`}
            >
              <svg
                className="w-4 h-4 text-white"
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
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 font-medium"
          >
            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-600 pt-4">
              <p className="text-black dark:text-white bg-gradient-to-tr from-blue-100 to-gray-50 dark:from-blue-800 dark:to-gray-700 rounded-2xl p-4 mb-4 leading-relaxed">
                {item.answer}
              </p>

              {/* Detailed Answer with Better Formatting */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-800 dark:to-indigo-900 rounded-xl p-4 border border-blue-100 dark:border-blue-700">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  More Details
                </h4>
                <div className="text-blue-800 dark:text-blue-200 text-sm whitespace-pre-line leading-relaxed">
                  {item.detailedAnswer}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// FAQ Section Component
const FAQSection = ({ section, openItems, onItemClick, sectionKey }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg`}
        >
          <span className="text-xl text-white">{section.icon}</span>
        </div>
        <h2 className="text-3xl font-bold text-black dark:text-white">
          {section.title}
        </h2>
      </div>

      <div className="space-y-4">
        {section.questions.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FAQItem
              item={item}
              isOpen={openItems.includes(item.id)}
              onClick={onItemClick}
              categoryGradient={section.gradient}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Replace this URL with your actual API endpoint
  const API_URL = "https://nexusbackend-hdyk.onrender.com/questions";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(API_URL, formData);

      const data = response.data;

      if (response.status === 200 && data.success) {
        setShowSuccessModal(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general",
        });
      } else {
        setErrorMessage(
          data.message || "Failed to submit your question. Please try again."
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      
      // Handle different types of Axios errors
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        setErrorMessage(
          error.response.data?.message || 
          `Server error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something else happened
        setErrorMessage(
          "An unexpected error occurred. Please try again."
        );
      }
      
      setShowErrorModal(true);
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

  const handleContactDirectly = () => {
    setShowErrorModal(false);
    // Open email client for direct contact
    setTimeout(() => {
      window.open('mailto:support@nexuscomputers.com?subject=Question from FAQ Page', '_blank');
    }, 100);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h3 className="text-3xl text-gray-800 dark:text-white font-bold mb-3">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Can't find the answer you're looking for? Please reach out to our
            support team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Question Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="general" className="text-gray-900 dark:text-white">
                General Inquiry
              </option>
              <option value="products" className="text-gray-900 dark:text-white">
                Products & Services
              </option>
              <option value="shipping" className="text-gray-900 dark:text-white">
                Shipping & Delivery
              </option>
              <option value="warranty" className="text-gray-900 dark:text-white">
                Warranty & Support
              </option>
              <option value="payment" className="text-gray-900 dark:text-white">
                Payment & Financing
              </option>
              <option value="technical" className="text-gray-900 dark:text-white">
                Technical Support
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Brief subject of your question"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Question <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="Please describe your question in detail..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-lg py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Your Question"
            )}
          </button>
        </form>
      </motion.div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        onContactDirectly={handleContactDirectly}
      />
    </>
  );
};

// Main FAQ Component
export const FAQ = () => {
  const [openItems, setOpenItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleItemClick = (itemId) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAll = () => {
    if (openItems.length === getAllQuestions().length) {
      setOpenItems([]);
    } else {
      setOpenItems(getAllQuestions().map((q) => q.id));
    }
  };

  const getAllQuestions = () => {
    return Object.values(faqData).flatMap((section) => section.questions);
  };

  const filteredQuestions = getAllQuestions().filter(
    (question) =>
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.detailedAnswer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSections = Object.entries(faqData).reduce(
    (acc, [key, section]) => {
      const filteredSectionQuestions = section.questions.filter(
        (question) =>
          question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.detailedAnswer
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

      if (
        filteredSectionQuestions.length > 0 ||
        activeCategory === "all" ||
        activeCategory === key
      ) {
        acc[key] = {
          ...section,
          questions:
            activeCategory === "all" || activeCategory === key
              ? filteredSectionQuestions
              : [],
        };
      }

      return acc;
    },
    {}
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 mt-2 mb-1 rounded-2xl py-16 sm:py-24 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-400 mb-6">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Find quick answers to common questions about our products,
              services, and support. Can't find what you're looking for? Contact
              our support team.
            </p>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === "all"
                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                    : "bg-gradient-to-br from-blue-300 to-blue-500 text-gray-800 hover:shadow-md"
                }`}
              >
                All Questions
              </button>

              {Object.entries(faqData).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeCategory === key
                      ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                      : "bg-gradient-to-l from-blue-300 to-blue-400 text-gray-800 hover:shadow-md"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={toggleAll}
                className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                {openItems.length === getAllQuestions().length
                  ? "Collapse All"
                  : "Expand All"}
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById("contact-form");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Ask New Question
              </button>
            </motion.div>
          </motion.div>

          {/* FAQ Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            {Object.entries(filteredSections).map(([key, section]) => (
              <FAQSection
                key={key}
                section={section}
                openItems={openItems}
                onItemClick={handleItemClick}
                sectionKey={key}
              />
            ))}

            {/* No Results Message */}
            {searchTerm &&
              Object.values(filteredSections).every(
                (section) => section.questions.length === 0
              ) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-8xl mb-6 opacity-50">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    No questions matched your search for "
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {searchTerm}
                    </span>
                    ". Try different keywords or ask a new question.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-gradient-to-tl from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 mt-4"
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
          </motion.div>

          {/* Contact Form */}
          <div id="contact-form" className="mb-16">
            <ContactForm />
          </div>

          {/* Quick Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Need Immediate Help?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "📞",
                    title: "Call Us",
                    detail: "+250 788 123 456",
                    action: "24/7 Support",
                    gradient: "from-green-500 to-green-600",
                  },
                  {
                    icon: "💬",
                    title: "Live Chat",
                    detail: "Available Now",
                    action: "Instant Help",
                    gradient: "from-blue-500 to-blue-600",
                  },
                  {
                    icon: "🏪",
                    title: "Visit Store",
                    detail: "Kigali City Center",
                    action: "Walk-in Welcome",
                    gradient: "from-purple-500 to-purple-600",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md mx-auto mb-4`}
                    >
                      <span className="text-2xl text-white">{item.icon}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 font-medium">
                      {item.detail}
                    </p>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {item.action}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};