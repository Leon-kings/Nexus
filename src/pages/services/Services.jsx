/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

export const Services = () => {
  const [activeService, setActiveService] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [hoveredService, setHoveredService] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    mobileNumber: "",
    provider: "mtn",
  });

  // Enhanced services data with graphics
  const services = [
    {
      id: 1,
      title: "Custom PC Building",
      description:
        "Tailor-made computers designed to your exact specifications and requirements",
      fullDescription:
        "Our expert technicians build custom PCs optimized for gaming, content creation, or business applications. Every component is carefully selected for compatibility and performance. We ensure optimal cooling, cable management, and future-proofing for your investment.",
      icon: "🛠️",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
      features: [
        "Component Selection Guidance",
        "Cable Management Excellence",
        "Performance Optimization",
        "Quality Testing & Burn-in",
        "1-Year Build Warranty",
        "Future-Proofing Advice",
      ],
      process: [
        "Consultation & Requirements Analysis",
        "Component Selection & Quotation",
        "Professional Assembly",
        "Quality Testing & Optimization",
        "Delivery & Setup Support",
      ],
      price: "$99",
      duration: "2-5 Days",
      image:
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=400&fit=crop",
      graphic: "🎮",
      stats: { successRate: "99%", clients: "2K+", satisfaction: "4.9/5" },
    },
    {
      id: 2,
      title: "Enterprise IT Solutions",
      description:
        "Comprehensive technology infrastructure for businesses of all sizes",
      fullDescription:
        "End-to-end IT solutions including network setup, server configuration, and enterprise-grade hardware deployment with ongoing support. We design scalable solutions that grow with your business while maintaining security and reliability.",
      icon: "🏢",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      features: [
        "Network Infrastructure Setup",
        "Server Configuration & Management",
        "Data Security Implementation",
        "24/7 Monitoring & Support",
        "Scalable Solutions",
        "Disaster Recovery Planning",
      ],
      process: [
        "Business Needs Assessment",
        "Infrastructure Planning",
        "Hardware Deployment",
        "System Integration",
        "Ongoing Maintenance",
      ],
      price: "Custom Quote",
      duration: "2-4 Weeks",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      graphic: "💼",
      stats: { successRate: "98%", clients: "500+", satisfaction: "4.8/5" },
    },
    {
      id: 3,
      title: "Device Repair & Maintenance",
      description:
        "Expert repair services for computers, laptops, and mobile devices",
      fullDescription:
        "Fast and reliable repair services with genuine parts and expert technicians. We fix everything from screen replacements to complex motherboard issues. Our diagnostic process ensures we identify the root cause and provide lasting solutions.",
      icon: "🔧",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      features: [
        "Hardware Diagnostics & Repair",
        "Screen & Component Replacement",
        "Data Recovery Services",
        "Virus & Malware Removal",
        "Preventive Maintenance",
        "Warranty Repairs",
      ],
      process: [
        "Diagnostic Assessment",
        "Repair Quotation",
        "Genuine Parts Replacement",
        "Quality Testing",
        "Final Inspection & Delivery",
      ],
      price: "$49",
      duration: "1-3 Days",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop",
      graphic: "⚡",
      stats: { successRate: "96%", clients: "5K+", satisfaction: "4.7/5" },
    },
    {
      id: 4,
      title: "IT Consultation",
      description:
        "Strategic technology guidance for optimal business performance",
      fullDescription:
        "Professional IT consulting to help you make informed technology decisions, optimize your infrastructure, and plan for future growth. We provide actionable insights and roadmaps that align technology with your business objectives.",
      icon: "💡",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
      features: [
        "Technology Strategy Planning",
        "Infrastructure Optimization",
        "Cost-Benefit Analysis",
        "Future-Proofing Solutions",
        "Implementation Roadmaps",
        "Vendor Management",
      ],
      process: [
        "Current State Analysis",
        "Gap Identification",
        "Solution Recommendations",
        "Implementation Planning",
        "Performance Monitoring",
      ],
      price: "$150/hour",
      duration: "Flexible",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      graphic: "📊",
      stats: { successRate: "97%", clients: "1K+", satisfaction: "4.9/5" },
    },
    {
      id: 5,
      title: "Data Recovery Services",
      description:
        "Professional data retrieval from damaged or corrupted storage devices",
      fullDescription:
        "Advanced data recovery services for hard drives, SSDs, and other storage media. High success rate with secure handling of your valuable data. We use state-of-the-art equipment in our certified clean room environment.",
      icon: "💾",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      gradient: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)",
      features: [
        "Hard Drive & SSD Recovery",
        "RAID Array Reconstruction",
        "Corrupted Data Retrieval",
        "Secure Data Handling",
        "Success-Based Pricing",
        "Encrypted Drive Recovery",
      ],
      process: [
        "Media Assessment",
        "Recovery Method Selection",
        "Data Extraction",
        "Integrity Verification",
        "Secure Delivery",
      ],
      price: "$199",
      duration: "3-7 Days",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      graphic: "🔐",
      stats: { successRate: "95%", clients: "3K+", satisfaction: "4.8/5" },
    },
    {
      id: 6,
      title: "Network Setup & Security",
      description: "Secure and efficient network infrastructure installation",
      fullDescription:
        "Complete network setup including wired and wireless solutions with enterprise-grade security measures to protect your business data. We implement robust security protocols and monitoring systems to keep your network safe.",
      icon: "🌐",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      gradient: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
      features: [
        "Wireless Network Deployment",
        "Network Security Implementation",
        "Firewall Configuration",
        "VPN Setup",
        "Ongoing Monitoring",
        "Security Audits",
      ],
      process: [
        "Site Survey & Planning",
        "Hardware Installation",
        "Security Configuration",
        "Performance Testing",
        "Documentation & Training",
      ],
      price: "$299",
      duration: "1-2 Weeks",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      graphic: "🛡️",
      stats: { successRate: "98%", clients: "800+", satisfaction: "4.9/5" },
    },
  ];

  const stats = [
    {
      number: "5000+",
      label: "Custom PCs Built",
      icon: "🎯",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "98%",
      label: "Repair Success Rate",
      icon: "✅",
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: "🛡️",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "1Hr",
      label: "Response Time",
      icon: "⚡",
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      company: "Creative Studio Pro",
      text: "The custom workstation they built transformed our video editing workflow. Incredible performance and reliability!",
      rating: 5,
      service: "Custom PC Building",
      avatar: "👨‍💼",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      company: "TechStart Inc.",
      text: "Their enterprise IT solution scaled perfectly with our growing business. Professional service from start to finish.",
      rating: 5,
      service: "Enterprise IT Solutions",
      avatar: "👩‍💼",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Michael Chen",
      company: "DataFlow Systems",
      text: "Recovered critical business data we thought was lost forever. Exceptional expertise and service.",
      rating: 5,
      service: "Data Recovery Services",
      avatar: "👨‍🔬",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      company: "Design Masters",
      text: "Outstanding consultation services that helped us optimize our IT infrastructure and save costs.",
      rating: 5,
      service: "IT Consultation",
      avatar: "👩‍🎨",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle booking form input changes
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment form input changes
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...bookingForm,
        service: bookingModal?.title,
        serviceId: bookingModal?.id,
        timestamp: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, use:
      // const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);

      // For demo, simulate success
      const response = {
        data: { success: true, bookingId: `BK${Date.now()}` },
      };

      if (response.data.success) {
        setBookingModal({
          ...bookingModal,
          step: "payment",
          bookingId: response.data.bookingId,
        });
        toast.success("Booking request submitted! Proceed to payment.");
      } else {
        toast.error("Failed to submit booking. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const paymentData = {
        ...paymentForm,
        service: bookingModal?.title,
        amount: bookingModal?.price,
        method: paymentMethod,
        bookingId: bookingModal?.bookingId || Date.now().toString(),
      };

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // In real implementation, use:
      // const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);

      // For demo, simulate 80% success rate
      const isSuccess = Math.random() > 0.2;
      const response = {
        data: { success: isSuccess, transactionId: `TXN${Date.now()}` },
      };

      if (response.data.success) {
        setPaymentStatus("success");
        toast.success("Payment successful! Your service has been booked.");
      } else {
        setPaymentStatus("failed");
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("failed");
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset all modals
  const resetModals = () => {
    setBookingModal(null);
    setPaymentStatus(null);
    setActiveService(null);
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "",
      budget: "",
      timeline: "",
      requirements: "",
    });
    setPaymentForm({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolder: "",
      mobileNumber: "",
      provider: "mtn",
    });
  };

  // Open booking modal
  const openBookingModal = (service) => {
    setBookingModal({
      ...service,
      step: "booking",
    });
    setBookingForm((prev) => ({
      ...prev,
      serviceType: service.title,
    }));
  };

  // Floating animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Loading Spinner Component
  const LoadingSpinner = ({ size = "medium" }) => {
    const sizes = {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    };

    return (
      <div
        className={`${sizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}
      ></div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-2 mb-1 rounded-2xl from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Animated Graphics */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 text-6xl opacity-20"
            variants={floatingAnimation}
            animate="animate"
          >
            💻
          </motion.div>
          <motion.div
            className="absolute top-40 right-32 text-4xl opacity-30"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: "1s" }}
          >
            🔧
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-1/4 text-5xl opacity-25"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: "2s" }}
          >
            🛠️
          </motion.div>
        </div>

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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Premium Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience cutting-edge technology solutions with our expert
              services. From custom builds to enterprise solutions, we deliver
              excellence.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/contact"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <span>Get Started Today</span>
                <span>✨</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white text-2xl">⌄</div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`text-center p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              >
                <motion.div
                  className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="font-medium opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="text-4xl">⭐</div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Expert Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of technology services designed
              to meet your every need with precision and excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
                className={`${service.bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer group relative`}
                onClick={() =>
                  setActiveService(
                    activeService?.id === service.id ? null : service
                  )
                }
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  animate={{
                    background:
                      hoveredService === service.id
                        ? [
                            `linear-gradient(135deg, ${
                              service.color.split(" ")[1]
                            } 0%, ${service.color.split(" ")[3]} 100%)`,
                            `linear-gradient(135deg, ${
                              service.color.split(" ")[3]
                            } 0%, ${service.color.split(" ")[1]} 100%)`,
                            `linear-gradient(135deg, ${
                              service.color.split(" ")[1]
                            } 0%, ${service.color.split(" ")[3]} 100%)`,
                          ]
                        : `linear-gradient(135deg, ${
                            service.color.split(" ")[1]
                          } 0%, ${service.color.split(" ")[3]} 100%)`,
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Service Header */}
                <div
                  className={`bg-gradient-to-r ${service.color} p-6 text-white relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute -top-4 -right-4 text-8xl opacity-20"
                    animate={{
                      rotate: hoveredService === service.id ? 360 : 0,
                    }}
                    transition={{ duration: 2 }}
                  >
                    {service.graphic}
                  </motion.div>
                  <div className="relative z-10">
                    <motion.div
                      className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-blue-100">{service.description}</p>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {service.price}
                    </span>
                    <span className="text-gray-600 bg-white/80 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {service.duration}
                    </span>
                  </div>

                  {/* Mini Stats */}
                  <div className="flex justify-between mb-4 text-xs text-gray-600">
                    <div className="text-center">
                      <div className="font-bold">
                        {service.stats.successRate}
                      </div>
                      <div>Success</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{service.stats.clients}</div>
                      <div>Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">
                        {service.stats.satisfaction}
                      </div>
                      <div>Rating</div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center text-gray-700"
                      >
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full mr-3"
                          whileHover={{ scale: 1.5 }}
                        />
                        {feature}
                      </motion.li>
                    ))}
                    {service.features.length > 3 && (
                      <motion.li
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-blue-600 font-medium text-sm"
                      >
                        +{service.features.length - 3} more features
                      </motion.li>
                    )}
                  </ul>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveService(service);
                      }}
                      className="flex-1 bg-gradient-to-tr from-blue-400 to-indigo-400 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Learn More</span>
                      <span>🔍</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookingModal(service);
                      }}
                      className="px-4 bg-gradient-to-br from-blue-300 to-violet-400 border rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center"
                    >
                      <span>⚡</span>
                    </motion.button>
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`bg-gradient-to-r ${activeService.color} p-8 text-white relative overflow-hidden`}
              >
                <motion.div
                  className="absolute -top-8 -right-8 text-9xl opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {activeService.graphic}
                </motion.div>
                <button
                  onClick={() => setActiveService(null)}
                  className="absolute top-6 right-6 bg-gradient-to-tr from-red-500 to-red-700 text-2xl z-10"
                >
                  ✕
                </button>
                <div className="flex items-center space-x-4 mb-4 relative z-10">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {activeService.icon}
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold">
                      {activeService.title}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      {activeService.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">📋</span>
                      Service Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {activeService.fullDescription}
                    </p>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {activeService.price}
                        </span>
                        <span className="text-gray-600 bg-white px-4 py-2 rounded-xl font-semibold shadow-sm">
                          ⏱️ {activeService.duration}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openBookingModal(activeService)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>Book This Service</span>
                        <span>🎯</span>
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">✨</span>
                      Key Features
                    </h3>
                    <ul className="space-y-3 mb-8">
                      {activeService.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-gray-700 bg-gray-50 rounded-xl p-3"
                        >
                          <motion.div
                            className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"
                            whileHover={{ scale: 1.5 }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🔄</span>
                      Our Process
                    </h3>
                    <div className="space-y-3">
                      {activeService.process.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
                        >
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal && bookingModal.step === "booking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setBookingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`bg-gradient-to-r ${bookingModal.color} p-6 text-white relative overflow-hidden`}
              >
                <motion.div
                  className="absolute -top-4 -right-4 text-6xl opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {bookingModal.graphic}
                </motion.div>
                <button
                  onClick={() => setBookingModal(null)}
                  className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-red-600 text-2xl z-10"
                >
                  ✕
                </button>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="text-4xl">{bookingModal.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Book {bookingModal.title}
                    </h2>
                    <p className="text-blue-100">
                      Complete the form below to request this service
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-6 text-black">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={bookingForm.company}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <input
                      type="text"
                      name="serviceType"
                      value={bookingForm.serviceType}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={bookingForm.budget}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select budget range</option>
                      <option value="$100 - $500">$100 - $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000+">$5,000+</option>
                      <option value="Custom Quote">Custom Quote</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    value={bookingForm.timeline}
                    onChange={handleBookingInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select preferred timeline</option>
                    <option value="ASAP">As soon as possible</option>
                    <option value="1-2 weeks">Within 1-2 weeks</option>
                    <option value="2-4 weeks">Within 2-4 weeks</option>
                    <option value="1-2 months">Within 1-2 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={bookingForm.requirements}
                    onChange={handleBookingInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Describe your project requirements, specific needs, or any special considerations..."
                  />
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setBookingModal(null)}
                    className="flex-1 bg-gradient-to-tl from-red-500 to-red-700 py-4 rounded-xl font-semibold  transition-colors duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Payment</span>
                        <span>💰</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {bookingModal && bookingModal.step === "payment" && !paymentStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setBookingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`bg-gradient-to-r ${bookingModal.color} p-6 text-white relative overflow-hidden`}
              >
                <motion.div
                  className="absolute -top-4 -right-4 text-6xl opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  💳
                </motion.div>
                <button
                  onClick={() => setBookingModal(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl z-10"
                >
                  ✕
                </button>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="text-4xl">💳</div>
                  <div>
                    <h2 className="text-2xl font-bold">Complete Payment</h2>
                    <p className="text-blue-100">
                      Secure payment for {bookingModal.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold">
                        {bookingModal.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount</span>
                      <span className="text-2xl font-bold text-green-600">
                        {bookingModal.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold">
                        {bookingModal.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border-2 rounded-xl text-center transition-all duration-300 ${
                        paymentMethod === "card"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-semibold">Credit Card</div>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod("mobile")}
                      className={`p-4 border-2 rounded-xl text-center transition-all duration-300 ${
                        paymentMethod === "mobile"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-semibold">Mobile Money</div>
                    </motion.button>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit}>
                  {paymentMethod === "card" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formatCardNumber(paymentForm.cardNumber)}
                          onChange={(e) =>
                            setPaymentForm((prev) => ({
                              ...prev,
                              cardNumber: e.target.value.replace(/\s/g, ""),
                            }))
                          }
                          maxLength={19}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formatExpiryDate(paymentForm.expiryDate)}
                            onChange={(e) =>
                              setPaymentForm((prev) => ({
                                ...prev,
                                expiryDate: e.target.value.replace(/\//g, ""),
                              }))
                            }
                            maxLength={5}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentForm.cvv}
                            onChange={handlePaymentInputChange}
                            maxLength={4}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Holder Name
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={paymentForm.cardHolder}
                          onChange={handlePaymentInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Network
                        </label>
                        <select
                          name="provider"
                          value={paymentForm.provider}
                          onChange={handlePaymentInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="mtn">MTN Mobile Money</option>
                          <option value="airtel">Airtel Money</option>
                          <option value="vodafone">Vodafone Cash</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={paymentForm.mobileNumber}
                          onChange={handlePaymentInputChange}
                          placeholder="055 123 4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 mt-8">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setBookingModal({ ...bookingModal, step: "booking" })
                      }
                      className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-400 transition-colors duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="small" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay {bookingModal.price}</span>
                          <span>🚀</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                    <span>🔒</span>
                    <span>Secure payment encrypted and processed securely</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Status Modal */}
      <AnimatePresence>
        {paymentStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full text-center p-8"
            >
              {paymentStatus === "success" ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-4xl">✅</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your payment. Your service has been booked
                    successfully.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="text-sm text-gray-600">
                      Booking Reference
                    </div>
                    <div className="font-mono font-bold text-gray-900">
                      {bookingModal?.bookingId}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetModals}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Continue to Dashboard
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 bg-gradient-to-tr from-gray-gray-400 t  rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-4xl">❌</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't process your payment. Please check your payment
                    details and try again.
                  </p>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentStatus(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-400 transition-colors duration-300"
                    >
                      Try Again
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetModals}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials Slider Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="text-4xl">💬</div>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied
              customers have to say about our services.
            </p>
          </motion.div>

          <div className="relative">
            {/* Testimonial Cards */}
            <div className="overflow-hidden">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
                  {/* Client Image */}
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg"
                    >
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 text-center md:text-left">
                    {/* Rating */}
                    <div className="flex justify-center md:justify-start space-x-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map(
                        (_, i) => (
                          <motion.span
                            key={i}
                            className="text-yellow-400 text-2xl"
                            whileHover={{ scale: 1.2 }}
                          >
                            ⭐
                          </motion.span>
                        )
                      )}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-2xl md:text-3xl font-light text-gray-700 mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>

                    {/* Client Info */}
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600 mb-2">
                        {testimonials[currentTestimonial].company}
                      </div>
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full">
                        <span className="text-blue-600">🎯</span>
                        <span className="text-blue-700 font-semibold">
                          {testimonials[currentTestimonial].service}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
