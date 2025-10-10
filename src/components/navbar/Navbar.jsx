/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { LoadingSpinner } from "../../pages/loading/LoadingSpinner";
import { Close } from "@mui/icons-material";

// API Base URL - Update this to your actual API endpoint
const API_BASE_URL = "http://localhost:5000/api";

// Navigation Configuration
const navigationConfig = {
  main: [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "About", path: "/about", icon: "ℹ️" },
    { name: "Services", path: "/services", icon: "⭐" },
    { name: "Pricing", path: "/products", icon: "💰" },
    { name: "FAQ", path: "/faq", icon: "💰" },
    { name: "Contact", path: "#contact", icon: "📞", isButton: true },
  ],
  authenticated: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ],
  admin: [
    { name: "Admin Dashboard", path: "/admin-dashboard", icon: "🛡️" },
    { name: "User Management", path: "/admin/users", icon: "👥" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  ],
};

// SVG Icons Component
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
      <path d="M16 8L22 12L16 16L10 12L16 8Z" fill="white" fillOpacity="0.9" />
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
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  User: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Email: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Message: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API Service functions
const apiService = {
  // Login API call
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  },

  // Register API call
  register: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  },

  // Contact form submission
  contact: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Message sending failed. Please try again."
      );
    }
  },

  // Verify token API call (optional - for token validation)
  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Token verification failed");
    }
  },
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(email, password);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        // Set default authorization header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.register(name, email, password);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        // Set default authorization header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];

    toast.info("You have been logged out");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        try {
          // Set authorization header for existing token
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Optional: Verify token with backend
          // await apiService.verifyToken(token);

          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error initializing auth:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
    if (!isLoading && adminOnly && user?.role !== "admin") {
      navigate("/user-dashboard");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== "admin") {
    return null;
  }

  return children;
};

// Modal Overlay Component - FIXED VERSION
const ModalOverlay = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto flex items-start justify-center z-50 p-4"
    onClick={(e) => {
      // Only close if clicking the backdrop, not the modal content
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  >
    {children}
  </motion.div>
);

// Modal Close Button Component
const ModalCloseButton = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 bg-gradient-to-b from-red-500 to-red-700 text-xl w-8 h-8 flex items-center justify-center z-10"
  >
    <Close className='size-4'/>
  </button>
);

// Login Form Component
const LoginForm = ({
  form,
  onChange,
  onSubmit,
  isSubmitting,
  onDemoLogin,
  onSwitchToRegister,
}) => (
  <form onSubmit={onSubmit} className="space-y-6 text-black">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={(e) => onChange({ ...form, email: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Enter your email"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Password
      </label>
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={(e) => onChange({ ...form, password: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Enter your password"
        required
      />
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <LoadingSpinner size="sm" text="Signing in..." />
      ) : (
        "Sign In"
      )}
    </motion.button>

    <div className="mt-8 text-center">
      <p className="text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="bg-gradient-to-b from-blue-400 to-indigo-700 font-semibold"
        >
          Create one here
        </button>
      </p>
    </div>
  </form>
);

// Register Form Component
const RegisterForm = ({
  form,
  onChange,
  onSubmit,
  isSubmitting,
  onSwitchToLogin,
}) => (
  <form onSubmit={onSubmit} className="space-y-6 text-black">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Full Name
      </label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Enter your full name"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={(e) => onChange({ ...form, email: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Enter your email"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Password
      </label>
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={(e) => onChange({ ...form, password: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Enter your password"
        required
        minLength={6}
      />
      <p className="text-xs text-gray-500 mt-2">
        Must be at least 6 characters
      </p>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Confirm Password
      </label>
      <input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={(e) => onChange({ ...form, confirmPassword: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Confirm your password"
        required
      />
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <LoadingSpinner size="sm" text="Creating account..." />
      ) : (
        "Create Account"
      )}
    </motion.button>

    <div className="mt-8 text-center">
      <p className="text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="bg-gradient-to-b from-green-400 to-indigo-700 font-semibold"
        >
          Sign in here
        </button>
      </p>
    </div>
  </form>
);

// Contact Form Component
const ContactForm = ({ form, onChange, onSubmit, isSubmitting }) => (
  <form onSubmit={onSubmit} className="space-y-6 text-black">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => onChange({ ...form, email: e.target.value })}
          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
          placeholder="Enter your email"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Subject
      </label>
      <input
        type="text"
        name="subject"
        value={form.subject}
        onChange={(e) => onChange({ ...form, subject: e.target.value })}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        placeholder="Enter the subject"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Message
      </label>
      <textarea
        name="message"
        value={form.message}
        onChange={(e) => onChange({ ...form, message: e.target.value })}
        rows={6}
        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none"
        placeholder="Enter your message..."
        required
      />
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <LoadingSpinner size="sm" text="Sending message..." />
      ) : (
        "Send Message"
      )}
    </motion.button>

    <div className="text-center text-sm text-gray-500">
      <p>We'll get back to you within 24 hours</p>
    </div>
  </form>
);

// Navbar Component
export const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { isAuthenticated, user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  // Modal handlers
  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    setIsContactOpen(false);
    setIsMobileMenuOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    setIsContactOpen(false);
    setIsMobileMenuOpen(false);
  };

  const openContact = () => {
    setIsContactOpen(true);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsContactOpen(false);
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  // Function to handle switching from login to register
  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    // Pre-fill email if available from login form
    if (loginForm.email) {
      setRegisterForm((prev) => ({
        ...prev,
        email: loginForm.email,
      }));
    }
  };

  // Function to handle switching from register to login
  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    // Pre-fill email if available from register form
    if (registerForm.email) {
      setLoginForm((prev) => ({
        ...prev,
        email: registerForm.email,
      }));
    }
  };

  // Form handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 🎉`);
      // Don't close modal immediately - let user see success message
      setTimeout(() => {
        closeModals();
        navigate("/dashboard");
      }, 1500);
    } else {
      toast.error(result.error || "Login failed! Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setIsSubmitting(true);
    const result = await register(
      registerForm.name,
      registerForm.email,
      registerForm.password
    );
    if (result.success) {
      toast.success(`Welcome to Nexus, ${result.user.name}! 🚀`);
      // After successful registration, switch to login modal instead of closing
      setTimeout(() => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
        setLoginForm({
          email: registerForm.email,
          password: "", // Don't auto-fill password for security
        });
        setIsSubmitting(false);

        // Show success message and prompt to login
        toast.info("Please login with your new account");
      }, 1500);
    } else {
      toast.error(result.error || "Registration failed! Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await apiService.contact(contactForm);
      if (result.success) {
        toast.success(
          "Message sent successfully! We'll get back to you soon. 📧"
        );
        // Don't auto-close contact modal - let user see success
        setTimeout(() => {
          closeModals();
        }, 2000);
      } else {
        toast.error(
          result.error || "Failed to send message. Please try again."
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = {
      admin: { email: "admin@example.com", password: "admin123" },
      user: { email: "user@example.com", password: "user123" },
    };

    const creds = demoCredentials[role];
    setLoginForm(creds);

    const result = await login(creds.email, creds.password);
    if (result.success) {
      toast.success(
        `Demo ${role} login successful! Welcome, ${result.user.name}!`
      );
      closeModals();
      navigate("/dashboard");
    } else {
      toast.error(`Demo ${role} login failed. Please try again.`);
    }
  };

  // Responsive background SVG
  const BackgroundPattern = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute w-full h-full opacity-5"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="20%" cy="30%" r="100" fill="url(#gradient)" opacity="0.1" />
        <circle cx="80%" cy="70%" r="150" fill="url(#gradient)" opacity="0.1" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/60 overflow-visible">
        <BackgroundPattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3"
                >
                  <SvgIcons.Logo />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nexus
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1 max-w-2xl overflow-x-auto">
              {/* Main Navigation */}
              {navigationConfig.main.map((item) => (
                <Link key={item.path} to={item.path}>
                  <button
                    key={item.path}
                    icon={item.icon}
                    className="bg-gradient-to-b from-blue-300 t0-indigo-400"
                    isButton={item.isButton}
                    onClick={item.isButton ? openContact : undefined}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}

              {/* Authenticated Navigation */}
              {isAuthenticated && (
                <>
                  {navigationConfig.authenticated.map((item) => (
                    <Link key={item.path} to={item.path} icon={item.icon}>
                      <button className="bg-gradient-to-b from-blue-400 t0-indigo-400">
                        {item.name}
                      </button>
                    </Link>
                  ))}

                  {/* Admin Navigation */}
                  {user?.role === "admin" && (
                    <>
                      {navigationConfig.admin.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          icon={item.icon}
                          className="bg-gradient-to-b from-blue-300 t0-indigo-400"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User"
                        )}&background=random`
                      }
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-500 flex-shrink-0"
                    />
                    <div className="text-right min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-blue-600 to-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg flex-shrink-0"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openLogin}
                    className="bg-gradient-to-t from-blue-400 to-indigo-400 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-blue-600 hover:bg-blue-50 shadow-sm whitespace-nowrap"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openRegister}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 whitespace-nowrap"
                  >
                    Register
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-gradient-to-t from-blue-400 to-violet-400 p-2"
              >
                {isMobileMenuOpen ? <SvgIcons.Close /> : <SvgIcons.Menu />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-xl absolute top-full left-0 right-0 max-h-[80vh] overflow-y-auto"
            >
              <div className="px-2 grid grid-cols-1 w-full pt-2 pb-4 space-y-1">
                {/* Main Navigation Mobile */}
                {navigationConfig.main.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    className="w-full"
                    mobile
                    isButton={item.isButton}
                    onClick={
                      item.isButton
                        ? openContact
                        : () => setIsMobileMenuOpen(false)
                    }
                  >
                    <button className="w-full bg-gradient-to-t from-blue-400 to-indigo-400">
                      {item.name}
                    </button>
                  </Link>
                ))}

                {/* Authenticated Navigation Mobile */}
                {isAuthenticated && (
                  <>
                    {navigationConfig.authenticated.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        mobile
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {/* Admin Navigation Mobile */}
                    {user?.role === "admin" && (
                      <>
                        {navigationConfig.admin.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            mobile
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </>
                )}

                {/* Auth Buttons Mobile */}
                {!isAuthenticated ? (
                  <div className="px-3 py-4 border-t border-gray-200 mt-2 space-y-3">
                    <button
                      onClick={openLogin}
                      className="block w-full text-center bg-gradient-to-r from-blue-400 to-indigo-400 px-3 py-3 rounded-lg text-base font-medium hover:bg-blue-50 border border-blue-600 transition-all duration-200"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={openRegister}
                      className="block w-full text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-3 rounded-lg text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-4 border-t border-gray-200 mt-2 pt-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User"
                          )}&background=random`
                        }
                        alt={user?.name}
                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center bg-gradient-to-r from-green-600 to-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <ModalOverlay onClose={closeModals}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
              <ModalCloseButton onClose={closeModals} />
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <SvgIcons.User />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">Sign in to your Nexus account</p>
              </div>

              <LoginForm
                form={loginForm}
                onChange={setLoginForm}
                onSubmit={handleLoginSubmit}
                isSubmitting={isSubmitting}
                onDemoLogin={handleDemoLogin}
                onSwitchToRegister={switchToRegister}
              />
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <ModalOverlay onClose={closeModals}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
              <ModalCloseButton onClose={closeModals} />
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">+</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Join Nexus
                </h2>
                <p className="text-gray-600">
                  Create your account and get started
                </p>
              </div>

              <RegisterForm
                form={registerForm}
                onChange={setRegisterForm}
                onSubmit={handleRegisterSubmit}
                isSubmitting={isSubmitting}
                onSwitchToLogin={switchToLogin}
              />
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <ModalOverlay onClose={closeModals}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
              <ModalCloseButton onClose={closeModals} />
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <SvgIcons.Message />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Contact Us
                </h2>
                <p className="text-gray-600">Get in touch with our team</p>
              </div>

              <ContactForm
                form={contactForm}
                onChange={setContactForm}
                onSubmit={handleContactSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};
