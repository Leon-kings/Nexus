/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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
  Campaign,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "https://your-api-endpoint.com/newsletter",
        {
          email: email,
          subscribedAt: new Date().toISOString(),
          source: "website_footer",
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("🎉 Successfully subscribed to our newsletter!");
        setEmail("");
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      if (error.response?.status === 409) {
        toast.warning("This email is already subscribed!");
      } else {
        toast.error("Failed to subscribe. Please try again later.");
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.9,
    },
  };
  const SvgIcons = {
    Logo: () => (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
        <path
          d="M16 8L22 12L16 16L10 12L16 8Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M16 16L22 20L16 24L10 20L16 16Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          d="M22 12L28 16L22 20L16 16L22 12Z"
          fill="white"
          fillOpacity="0.5"
        />
      </svg>
    ),
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

      <footer className="bg-gray-900 mt-2 rounded-2xl mb-0.5 text-white relative overflow-hidden">
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
              <div className="flex-shrink-0 flex items-center">
                <RouterLink
                  to={"/"}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3"
                >
                  <SvgIcons.Logo />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nexus
                  </span>
                </RouterLink>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Building amazing experiences for our users. Join our community
                and stay updated with the latest news and innovations.
              </p>
              <div className="flex space-x-3">
                {[
                  {
                    icon: Facebook,
                    href: "https://facebook.com/",
                    color: "hover:text-blue-400",
                  },
                  {
                    icon: Twitter,
                    href: "https://x.com/",
                    color: "hover:text-blue-300",
                  },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/direct/inbox/",
                    color: "hover:text-pink-400",
                  },
                  {
                    icon: LinkedIn,
                    href: "https://www.linkedin.com/in/akingeneye-leon-5302502b7/",
                    color: "hover:text-blue-500",
                  },
                ].map((social, index) => (
                  <RouterLink
                    key={index}
                    to={social.href}
                    className={`text-gray-400 ${social.color} transition-colors duration-300 bg-gray-800 p-2 rounded-lg`}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <social.icon fontSize="small" />
                  </RouterLink>
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
                  { name: "Home", icon: "🏠", path: "/" },
                  { name: "About", icon: "👥", path: "/about" },
                  { name: "Services", icon: "⚡", path: "/services" },
                ].map((link, index) => (
                  <li key={index}>
                    <motion.div
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 py-2 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm">{link.icon}</span>
                      <RouterLink
                        to={link.path}
                        className="group-hover:text-blue-300 transition-colors"
                      >
                        {link.name}
                      </RouterLink>
                    </motion.div>
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
                    <LocationOn
                      className="text-gray-400 group-hover:text-white"
                      fontSize="small"
                    />
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
                    <Phone
                      className="text-gray-400 group-hover:text-white"
                      fontSize="small"
                    />
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
                    <Email className="text-gray-400 group-hover:text-white" />
                  </div>
                  <RouterLink to={"mailto:info@yourcompany.com"}>
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      info@yourcompany.com
                    </span>
                  </RouterLink>
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
                Subscribe to our newsletter for the latest updates, offers, and
                exclusive content.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    disabled={isLoading}
                  />
                  <Email
                    className="absolute right-3 top-3 text-gray-400"
                    fontSize="small"
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
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
              © {new Date().getFullYear()} LD.
            </p>
            <div className="flex space-x-6 flex-wrap justify-center">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Team of Service", path: "/teams" },
                { name: "Cookie Policy", path: "/cookies" },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-300 py-1 px-2"
                  whileHover={{ scale: 1.05, color: "#60a5fa" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RouterLink to={link.path}>{link.name}</RouterLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </>
  );
};
