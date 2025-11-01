/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Search,
  FilterList,
  Add,
  Delete,
  Archive,
  MarkAsUnread,
  Star,
  StarBorder,
  Label,
  MoreVert,
  Clear,
  Refresh,
  Person,
  Business,
  LocalOffer,
  Schedule,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  Email,
  Phone,
  ChatBubble,
  Work,
  AttachMoney,
  Category,
  Source,
  PriorityHigh,
  NewReleases,
  Inbox,
  DoneAll,
  ScheduleSend,
  Cancel,
  Edit,
  Visibility,
  ContactMail,
  BusinessCenter,
  MonetizationOn,
  TrackChanges,
  WhereToVote,
  Folder,
  FolderOpen,
  Send,
  NoteAdd,
  Flag,
  TrendingUp,
  AccessTime,
  CalendarToday,
  Web,
  PhoneAndroid,
  ShoppingCart,
  DesignServices,
  Campaign,

  Support,
  EventAvailable,
  Timeline,
  Description,
  AttachFile,
  Tag,
  MeetingRoom,
  CalendarMonth,
  Percent,
  Assessment,
  Security,
} from "@mui/icons-material";

export const UserBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [statusEditingBooking, setStatusEditingBooking] = useState(null);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const API_URL = "https://nexusbackend-hdyk.onrender.com/bookings";

  // Get current user email from localStorage
  const getCurrentUserEmail = () => {
    try {
      const possibleKeys = ['user', 'userData', 'authUser', 'currentUser', 'userInfo'];
      
      for (const key of possibleKeys) {
        const userData = localStorage.getItem(key);
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            let userEmail = '';
            
            // Handle different user data structures
            if (parsedUser.user?.email) {
              userEmail = parsedUser.user.email;
            } else if (parsedUser.data?.user?.email) {
              userEmail = parsedUser.data.user.email;
            } else if (parsedUser.email) {
              userEmail = parsedUser.email;
            } else if (parsedUser.data?.email) {
              userEmail = parsedUser.data.email;
            }

            if (userEmail) {
              setCurrentUserEmail(userEmail.toLowerCase());
              console.log("Found user email:", userEmail);
              return userEmail.toLowerCase();
            }
          } catch (parseError) {
            console.warn(`Failed to parse user data from key ${key}:`, parseError);
          }
        }
      }
      
      // If no email found, try to find any email in localStorage
      const allStorage = { ...localStorage };
      for (const [key, value] of Object.entries(allStorage)) {
        if (value.includes('@')) {
          try {
            const parsedData = JSON.parse(value);
            if (parsedData?.email) {
              setCurrentUserEmail(parsedData.email.toLowerCase());
              console.log("Found email in key:", key, parsedData.email);
              return parsedData.email.toLowerCase();
            }
          } catch (e) {
            // Not JSON, check if it's a direct email string
            if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              setCurrentUserEmail(value.toLowerCase());
              console.log("Found direct email in key:", key, value);
              return value.toLowerCase();
            }
          }
        }
      }
      
      console.warn("No user email found in localStorage");
      return null;
    } catch (err) {
      console.error("Error getting user email:", err);
      return null;
    }
  };

  // Fetch bookings from API and filter by current user's email
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userEmail = getCurrentUserEmail();
      const response = await axios.get(API_URL);
      
      if (response.data.success) {
        const allBookings = response.data.data.bookings || [];
        // Filter bookings to show only those with current user's email
        const userBookings = userEmail 
          ? allBookings.filter(booking => 
              booking.email?.toLowerCase() === userEmail
            )
          : [];
        
        setBookings(userBookings);
        setPagination({ 
          current: 1, 
          pages: 1, 
          total: userBookings.length 
        });
        
        if (userEmail && userBookings.length > 0) {
          toast.success(`Loaded ${userBookings.length} of your bookings!`);
        } else if (userEmail) {
          toast.info("No bookings found for your email address.");
        } else {
          toast.warning("Please log in to view your bookings.");
        }
      } else {
        setBookings([]);
        console.warn('API returned unsuccessful response:', response.data);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load your bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search and filters (only user's bookings are shown)
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.requirements?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesPriority = filterPriority === "all" || booking.priority === filterPriority;
    const matchesService = filterService === "all" || booking.serviceType === filterService;

    return matchesSearch && matchesStatus && matchesPriority && matchesService;
  });

  const handleAddBooking = () => {
    setEditingBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsBookingModalOpen(true);
  };

  const handleEditStatus = (booking) => {
    setStatusEditingBooking(booking);
    setIsStatusModalOpen(true);
  };

  const handleViewBooking = (booking) => {
    setViewingBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleDeleteBooking = (booking) => {
    setDeleteBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBooking = async (bookingData) => {
    try {
      // Simulate API call
      if (editingBooking) {
        // Update existing booking
        const updatedBookings = bookings.map(booking => 
          booking._id === editingBooking._id 
            ? { ...booking, ...bookingData }
            : booking
        );
        setBookings(updatedBookings);
        toast.success('Your booking updated successfully!');
      } else {
        // Add new booking
        const newBooking = {
          _id: Date.now().toString(),
          ...bookingData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBookings([newBooking, ...bookings]);
        toast.success('Booking added successfully!');
      }
      setIsBookingModalOpen(false);
      setEditingBooking(null);
    } catch (err) {
      console.error('Error saving booking:', err);
      toast.error('Failed to save booking');
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      const updatedBookings = bookings.map(booking => 
        booking._id === statusEditingBooking._id 
          ? { 
              ...booking, 
              status: statusData.status,
              priority: statusData.priority,
              probability: statusData.probability,
              nextFollowUp: statusData.nextFollowUp,
              isArchived: statusData.isArchived
            } 
          : booking
      );
      
      setBookings(updatedBookings);
      toast.success(`Your booking status updated successfully!`);
      setIsStatusModalOpen(false);
      setStatusEditingBooking(null);
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error('Failed to update booking status');
    }
  };

  const confirmDelete = async () => {
    try {
      const updatedBookings = bookings.filter(booking => booking._id !== deleteBooking._id);
      setBookings(updatedBookings);
      toast.success('Your booking deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeleteBooking(null);
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast.error('Failed to delete booking');
    }
  };

  // Status and Priority configurations
  const statusOptions = [
    { value: "new", label: "New", color: "blue", icon: <NewReleases /> },
    { value: "contacted", label: "Contacted", color: "green", icon: <DoneAll /> },
    { value: "quoted", label: "Quoted", color: "purple", icon: <AttachMoney /> },
    { value: "negotiation", label: "Negotiation", color: "orange", icon: <ScheduleSend /> },
    { value: "won", label: "Won", color: "emerald", icon: <CheckCircle /> },
    { value: "lost", label: "Lost", color: "red", icon: <Cancel /> },
    { value: "cancelled", label: "Cancelled", color: "gray", icon: <Cancel /> }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "gray", icon: <Flag /> },
    { value: "medium", label: "Medium", color: "blue", icon: <Flag /> },
    { value: "high", label: "High", color: "orange", icon: <PriorityHigh /> },
    { value: "urgent", label: "Urgent", color: "red", icon: <Warning /> }
  ];

  const serviceOptions = [
    { value: "web-development", label: "Web Development", icon: <Web /> },
    { value: "mobile-app", label: "Mobile App", icon: <PhoneAndroid /> },
    { value: "ecommerce", label: "E-commerce", icon: <ShoppingCart /> },
    { value: "ui-ux-design", label: "UI/UX Design", icon: <DesignServices /> },
    { value: "digital-marketing", label: "Digital Marketing", icon: <Campaign /> },
    { value: "seo", label: "SEO", icon: <Security /> },
    { value: "consulting", label: "Consulting", icon: <BusinessCenter /> },
    { value: "maintenance", label: "Maintenance", icon: <Support /> },
    { value: "other", label: "Other", icon: <MoreVert /> }
  ];

  const budgetOptions = [
    { value: "1000-5000", label: "$1K - $5K" },
    { value: "5000-10000", label: "$5K - $10K" },
    { value: "10000-25000", label: "$10K - $25K" },
    { value: "25000-50000", label: "$25K - $50K" },
    { value: "50000-100000", label: "$50K - $100K" },
    { value: "100000+", label: "$100K+" },
    { value: "not-specified", label: "Not Specified" }
  ];

  const timelineOptions = [
    { value: "immediate", label: "Immediate", icon: <Warning /> },
    { value: "2-weeks", label: "2 Weeks", icon: <EventAvailable /> },
    { value: "1-month", label: "1 Month", icon: <CalendarMonth /> },
    { value: "2-3-months", label: "2-3 Months", icon: <Timeline /> },
    { value: "3-6-months", label: "3-6 Months", icon: <Schedule /> },
    { value: "6-months-plus", label: "6+ Months", icon: <CalendarToday /> },
    { value: "flexible", label: "Flexible", icon: <EventAvailable /> }
  ];

  const sourceOptions = [
    { value: "website", label: "Website", icon: <Web /> },
    { value: "referral", label: "Referral", icon: <Group /> },
    { value: "social-media", label: "Social Media", icon: <Share /> },
    { value: "email", label: "Email", icon: <Email /> },
    { value: "phone", label: "Phone", icon: <Phone /> },
    { value: "other", label: "Other", icon: <MoreVert /> }
  ];

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
      red: "bg-red-100 text-red-800 border-red-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colorMap[statusConfig?.color] || colorMap.gray;
  };

  const getPriorityColor = (priority) => {
    const priorityConfig = priorityOptions.find(p => p.value === priority);
    const colorMap = {
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200"
    };
    return colorMap[priorityConfig?.color] || colorMap.gray;
  };

  const getServiceIcon = (serviceType) => {
    const serviceConfig = serviceOptions.find(s => s.value === serviceType);
    return serviceConfig?.icon || <Work />;
  };

  const getBudgetLabel = (budget) => {
    const budgetConfig = budgetOptions.find(b => b.value === budget);
    return budgetConfig?.label || budget;
  };

  const getTimelineLabel = (timeline) => {
    const timelineConfig = timelineOptions.find(t => t.value === timeline);
    return timelineConfig?.label || timeline;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}m ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    } else {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    }
  };

  // Booking Form Modal Component
  const BookingFormModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "web-development",
      budget: "not-specified",
      timeline: "flexible",
      requirements: "",
      source: "website",
      tags: []
    });

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
      if (editingBooking) {
        setFormData({
          name: editingBooking.name || "",
          email: editingBooking.email || "",
          phone: editingBooking.phone || "",
          company: editingBooking.company || "",
          serviceType: editingBooking.serviceType || "web-development",
          budget: editingBooking.budget || "not-specified",
          timeline: editingBooking.timeline || "flexible",
          requirements: editingBooking.requirements || "",
          source: editingBooking.source || "website",
          tags: editingBooking.tags || []
        });
      } else {
        // Pre-fill email with current user's email for new bookings
        const userEmail = getCurrentUserEmail();
        if (userEmail) {
          setFormData(prev => ({
            ...prev,
            email: userEmail
          }));
        }
      }
    }, [editingBooking]);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveBooking(formData);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    const handleAddTag = () => {
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
        setTagInput("");
      }
    };

    const handleRemoveTag = (tagToRemove) => {
      setFormData({
        ...formData,
        tags: formData.tags.filter(tag => tag !== tagToRemove)
      });
    };

    const handleTagInputKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsBookingModalOpen(false);
          setEditingBooking(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <EventAvailable className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {editingBooking ? 'Edit Your Booking' : 'New Service Booking'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsBookingModalOpen(false);
                  setEditingBooking(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            {!editingBooking && currentUserEmail && (
              <p className="text-blue-100 text-xs sm:text-sm mt-2">
                This booking will be associated with your email: {currentUserEmail}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Basic Information */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Basic Information</h3>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter email address"
                    readOnly={!!editingBooking}
                  />
                  {editingBooking && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      This is your booking - you can edit other details
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Project Details</h3>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    {serviceOptions.map(service => (
                      <option key={service.value} value={service.value}>{service.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Range *
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    {budgetOptions.map(budget => (
                      <option key={budget.value} value={budget.value}>{budget.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeline *
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    {timelineOptions.map(timeline => (
                      <option key={timeline.value} value={timeline.value}>{timeline.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    {sourceOptions.map(source => (
                      <option key={source.value} value={source.value}>{source.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Clear className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Add className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Requirements *
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={6}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base resize-none"
                placeholder="Describe your project requirements in detail..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 sm:gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsBookingModalOpen(false);
                  setEditingBooking(null);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-xs sm:text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <EventAvailable className="w-3 h-3 sm:w-4 sm:h-4" />
                {editingBooking ? 'Update Booking' : 'Create Booking'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Status Edit Modal Component
  const StatusEditModal = () => {
    const [formData, setFormData] = useState({
      status: "new",
      priority: "medium",
      probability: 0,
      nextFollowUp: "",
      isArchived: false
    });

    useEffect(() => {
      if (statusEditingBooking) {
        setFormData({
          status: statusEditingBooking.status || "new",
          priority: statusEditingBooking.priority || "medium",
          probability: statusEditingBooking.probability || 0,
          nextFollowUp: statusEditingBooking.nextFollowUp ? new Date(statusEditingBooking.nextFollowUp).toISOString().split('T')[0] : "",
          isArchived: statusEditingBooking.isArchived || false
        });
      }
    }, [statusEditingBooking]);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateStatus(formData);
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    };

    if (!statusEditingBooking) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsStatusModalOpen(false);
          setStatusEditingBooking(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-xs xsm:max-w-sm sm:max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <TrackChanges className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Update Booking Status</h2>
              </div>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingBooking(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <p className="text-purple-100 mt-1 sm:mt-2 text-xs sm:text-sm">Update status for your booking: {statusEditingBooking.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Booking Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
              <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {statusEditingBooking.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{statusEditingBooking.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{statusEditingBooking.company}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">{statusEditingBooking.serviceType?.replace('-', ' ')}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Your Booking</span>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Booking Status
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {statusOptions.map((status) => (
                  <label 
                    key={status.value}
                    className={`relative flex flex-col items-center p-2 sm:p-3 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.status === status.value 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                      formData.status === status.value ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {status.icon}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium text-center ${
                      formData.status === status.value ? 'text-purple-900 dark:text-purple-100' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {priorityOptions.map((priority) => (
                  <label 
                    key={priority.value}
                    className={`relative flex flex-col items-center p-2 sm:p-3 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.priority === priority.value 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${
                      formData.priority === priority.value ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {priority.icon}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      formData.priority === priority.value ? 'text-orange-900 dark:text-orange-100' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {priority.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Probability */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Win Probability
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  name="probability"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-center">
                  {formData.probability}%
                </span>
              </div>
            </div>

            {/* Next Follow-up */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Next Follow-up
              </label>
              <input
                type="date"
                name="nextFollowUp"
                value={formData.nextFollowUp}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
            </div>

            {/* Archive Option */}
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3">
                {formData.isArchived ? <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /> : <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                <div>
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">Archive Booking</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Move to archived bookings</p>
                </div>
              </div>
              <input
                type="checkbox"
                name="isArchived"
                checked={formData.isArchived}
                onChange={handleChange}
                className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingBooking(null);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-xs sm:text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <TrackChanges className="w-3 h-3 sm:w-4 sm:h-4" />
                Update Status
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!deleteBooking) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsDeleteModalOpen(false);
          setDeleteBooking(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-xs xsm:max-w-sm sm:max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <Delete className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Delete Your Booking</h2>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteBooking(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl">
              <Warning className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">
                This action cannot be undone. Your booking will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl mb-6">
              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                {deleteBooking.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{deleteBooking.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{deleteBooking.company}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{deleteBooking.serviceType?.replace('-', ' ')}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Your Booking</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteBooking(null);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-xs sm:text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Delete className="w-3 h-3 sm:w-4 sm:h-4" />
                Delete My Booking
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // View Booking Modal
  const ViewBookingModal = () => {
    if (!viewingBooking) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsViewModalOpen(false);
          setViewingBooking(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 bg-white/20 rounded-lg sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl">
                  {viewingBooking.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{viewingBooking.name}</h2>
                  <p className="text-blue-100 text-sm sm:text-base truncate">{viewingBooking.company}</p>
                  <p className="text-blue-200 text-sm capitalize">{viewingBooking.serviceType?.replace('-', ' ')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-green-200 text-sm">Your Booking</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingBooking(null);
                }}
                className="text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(viewingBooking.status)}`}>
                {statusOptions.find(s => s.value === viewingBooking.status)?.icon}
                {statusOptions.find(s => s.value === viewingBooking.status)?.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getPriorityColor(viewingBooking.priority)}`}>
                {priorityOptions.find(p => p.value === viewingBooking.priority)?.icon}
                {priorityOptions.find(p => p.value === viewingBooking.priority)?.label}
              </span>
              {viewingBooking.probability > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                  {viewingBooking.probability}% Win Chance
                </span>
              )}
              {viewingBooking.isArchived && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                  <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  Archived
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Contact Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ContactMail className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Information
                </h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Email className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base truncate">{viewingBooking.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Phone className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base">{viewingBooking.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Business className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Company</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base truncate">{viewingBooking.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Source className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Source</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base capitalize">{viewingBooking.source?.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Work className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                  Project Details
                </h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    {getServiceIcon(viewingBooking.serviceType)}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Service Type</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base capitalize">{viewingBooking.serviceType?.replace('-', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <AttachMoney className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Budget</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                        {getBudgetLabel(viewingBooking.budget)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Timeline className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Timeline</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base">
                        {getTimelineLabel(viewingBooking.timeline)}
                      </p>
                    </div>
                  </div>

                  {viewingBooking.estimatedValue && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <Assessment className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">Estimated Value</p>
                        <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                          ${viewingBooking.estimatedValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {viewingBooking.tags && viewingBooking.tags.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <Tag className="text-purple-500 w-4 h-4 sm:w-5 sm:h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewingBooking.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <Description className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
                Project Requirements
              </h3>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl max-h-48 overflow-y-auto">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm sm:text-base">{viewingBooking.requirements}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <AccessTime className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Created</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-right">{formatDate(viewingBooking.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-right">{formatDate(viewingBooking.updatedAt)}</span>
                </div>
                {viewingBooking.nextFollowUp && (
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl sm:col-span-2">
                    <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Next Follow-up</span>
                    <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 text-right">{formatDate(viewingBooking.nextFollowUp)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditStatus(viewingBooking);
                }}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <TrackChanges className="w-4 h-4 sm:w-5 sm:h-5" />
                Update Status
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditBooking(viewingBooking);
                }}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                Edit Booking
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteBooking(viewingBooking);
                }}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Booking Card Component
  const BookingCard = ({ booking }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {booking.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{booking.name}</h3>
              <p className="text-blue-100 text-xs sm:text-sm truncate">{booking.company}</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3 text-green-300" />
                <span className="text-green-200 text-xs">Your Booking</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
            <span className={`inline-flex items-center gap-1 px-1 sm:px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
              {statusOptions.find(s => s.value === booking.status)?.icon}
            </span>
            <span className={`inline-flex items-center gap-1 px-1 sm:px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(booking.priority)}`}>
              {priorityOptions.find(p => p.value === booking.priority)?.icon}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
            {statusOptions.find(s => s.value === booking.status)?.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(booking.priority)}`}>
            {priorityOptions.find(p => p.value === booking.priority)?.label}
          </span>
          {booking.probability > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Percent className="w-3 h-3" />
              {booking.probability}%
            </span>
          )}
          {booking.isArchived && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
              <FolderOpen className="w-3 h-3" />
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6">
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Email className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate flex-1">{booking.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{booking.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {getServiceIcon(booking.serviceType)}
            <span className="capitalize">{booking.serviceType?.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <AttachMoney className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{getBudgetLabel(booking.budget)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Timeline className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{getTimelineLabel(booking.timeline)}</span>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{booking.requirements}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTimeAgo(booking.createdAt)}</span>
          <span className="capitalize">{booking.source?.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewBooking(booking)}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-200 text-xs sm:text-sm flex items-center gap-1"
          >
            <Visibility className="w-3 h-3 sm:w-4 sm:h-4" />
            View
          </motion.button>
          
          <div className="flex gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditStatus(booking)}
              className="p-1 sm:p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
              title="Update Status"
            >
              <TrackChanges className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditBooking(booking)}
              className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              title="Edit Booking"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteBooking(booking)}
              className="p-1 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
              title="Delete Booking"
            >
              <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Loading and Error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-2 xsm:p-3 sm:p-4">
        <div className="container mx-auto px-2 xsm:px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-2 xsm:p-3 sm:p-4">
      <div className="container mx-auto px-2 xsm:px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                My Bookings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
                Manage your {pagination.total} service bookings and projects
                {currentUserEmail && (
                  <span className="block text-sm text-green-600 dark:text-green-400">
                    Showing bookings for: {currentUserEmail}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full lg:w-auto mt-2 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchBookings}
                className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg sm:rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Refresh className="w-3 h-3 sm:w-4 sm:h-4" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddBooking}
                className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Add className="w-4 h-4 sm:w-5 sm:h-5" />
                New Booking
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div className="xsm:col-span-2 md:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search your bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="xsm:col-span-1">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="xsm:col-span-1">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="all">All Priorities</option>
                  {priorityOptions.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              {/* Service Filter */}
              <div className="xsm:col-span-2 md:col-span-2 lg:col-span-1">
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="all">All Services</option>
                  {serviceOptions.map(service => (
                    <option key={service.value} value={service.value}>{service.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bookings Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredBookings.map((booking, index) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-12 max-w-xs sm:max-w-md mx-auto">
                <EventAvailable className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">No bookings found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : currentUserEmail 
                      ? `No bookings found for your email: ${currentUserEmail}`
                      : 'Please log in to view your bookings'
                  }
                </p>
                {!searchTerm && currentUserEmail && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddBooking}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    Create Your First Booking
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isBookingModalOpen && <BookingFormModal />}
        {isStatusModalOpen && <StatusEditModal />}
        {isDeleteModalOpen && <DeleteConfirmationModal />}
        {isViewModalOpen && <ViewBookingModal />}
      </AnimatePresence>
    </div>
  );
};

// Additional icons
const Group = () => <span>👥</span>;
const Share = () => <span>📱</span>;