/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowBack, Home, Support, SearchOff, Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    issueType: 'technical'
  });

  useEffect(() => {
    toast.error('Page not found!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleGoBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSupport = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      message: '',
      issueType: 'technical'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('https://your-api-endpoint.com/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          page: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        toast.success('Support request sent successfully! We will contact you soon.');
        handleCloseModal();
      } else {
        throw new Error('Failed to send support request');
      }
    } catch (error) {
      console.error('Error sending support request:', error);
      toast.error('Failed to send support request. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-center">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-4"
            >
              <SearchOff className="text-white text-6xl" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold text-white mb-2"
            >
              404
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-white/90 text-lg"
            >
              Page Not Found
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Oops! Lost in the digital space?
              </h2>
              <p className="text-gray-600">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <button
                onClick={handleGoBack}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <ArrowBack />
                Go Back to Previous Page
              </button>

              <button
                onClick={handleHome}
                className="w-full flex items-center justify-center gap-3 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Home />
                Go to Homepage
              </button>

              <button
                onClick={handleSupport}
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Support />
                Get Assistance
              </button>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              variants={itemVariants}
              className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <h3 className="font-semibold text-blue-800 mb-2">Need help?</h3>
              <p className="text-blue-700 text-sm">
                Our support team is here to help you find what you're looking for.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Support Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Get Assistance</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <Close />
                </button>
              </div>
              <p className="text-white/90 mt-2">
                Fill out the form below and our team will help you
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type
                </label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="technical">Technical Issue</option>
                  <option value="navigation">Navigation Help</option>
                  <option value="content">Missing Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How can we help you? *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Please describe the issue you're experiencing..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Support />
                  Send Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

