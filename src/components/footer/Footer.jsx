/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  LocationOn,
  Phone,
  Send,
  Business,
  Link,
  ContactMail,
  Campaign
} from '@mui/icons-material';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('https://your-api-endpoint.com/newsletter', {
        email: email,
        subscribedAt: new Date().toISOString(),
        source: 'website_footer'
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('🎉 Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      if (error.response?.status === 409) {
        toast.warning('This email is already subscribed!');
      } else {
        toast.error('Failed to subscribe. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.9
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
        </div>
        
        <motion.div
          className="container mx-auto px-4 py-12 relative z-10"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Business className="text-blue-400" fontSize="large" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  YourCompany
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Building amazing experiences for our users. Join our community and stay updated with the latest news and innovations.
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                  { icon: Twitter, href: "#", color: "hover:text-blue-300" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                  { icon: LinkedIn, href: "#", color: "hover:text-blue-500" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors duration-300 bg-gray-800 p-2 rounded-lg`}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <social.icon fontSize="small" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Link className="text-blue-400" />
                <h4 className="text-lg font-semibold">Quick Links</h4>
              </div>
              <ul className="space-y-3">
                {[
                  { name: 'Home', icon: '🏠' },
                  { name: 'About', icon: '👥' },
                  { name: 'Services', icon: '⚡' },
                  { name: 'Portfolio', icon: '💼' },
                  { name: 'Contact', icon: '📞' }
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 py-2 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm">{link.icon}</span>
                      <span className="group-hover:text-blue-300 transition-colors">{link.name}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2">
                <ContactMail className="text-blue-400" />
                <h4 className="text-lg font-semibold">Contact Info</h4>
              </div>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                    <LocationOn className="text-gray-400 group-hover:text-white" fontSize="small" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    123 Business Street, City, Country
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-green-500 transition-colors">
                    <Phone className="text-gray-400 group-hover:text-white" fontSize="small" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-red-500 transition-colors">
                    <Email className="text-gray-400 group-hover:text-white" fontSize="small" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    info@yourcompany.com
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Campaign className="text-blue-400" />
                <h4 className="text-lg font-semibold">Newsletter</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for the latest updates, offers, and exclusive content.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    disabled={isLoading}
                  />
                  <Email className="absolute right-3 top-3 text-gray-400" fontSize="small" />
                </motion.div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="text-sm" />
                    </>
                  )}
                </motion.button>
              </form>
              <p className="text-gray-500 text-xs">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
            variants={itemVariants}
          >
            <p className="text-gray-400 text-sm mb-4 md:mb-0 text-center md:text-left">
              © {new Date().getFullYear()} YourCompany. All rights reserved.
            </p>
            <div className="flex space-x-6 flex-wrap justify-center">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-300 py-1 px-2"
                  whileHover={{ scale: 1.05, color: "#60a5fa" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </>
  );
};

