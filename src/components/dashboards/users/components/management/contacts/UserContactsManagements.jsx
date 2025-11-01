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
} from "@mui/icons-material";

export const UserContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterInterest, setFilterInterest] = useState("all");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [statusEditingContact, setStatusEditingContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const API_URL = "https://nexusbackend-hdyk.onrender.com/contact";

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

  // Fetch contacts from API and filter by current user's email
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const userEmail = getCurrentUserEmail();
      const response = await axios.get(API_URL);
      
      if (response.data.success) {
        const allContacts = response.data.data.contacts || [];
        // Filter contacts to show only those with current user's email
        const userContacts = userEmail 
          ? allContacts.filter(contact => 
              contact.email?.toLowerCase() === userEmail
            )
          : [];
        
        setContacts(userContacts);
        setPagination({ 
          current: 1, 
          pages: 1, 
          total: userContacts.length 
        });
        
        if (userEmail && userContacts.length > 0) {
          toast.success(`Loaded ${userContacts.length} of your contacts!`);
        } else if (userEmail) {
          toast.info("No contacts found for your email address.");
        } else {
          toast.warning("Please log in to view your contacts.");
        }
      } else {
        setContacts([]);
        console.warn('API returned unsuccessful response:', response.data);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Failed to load your contacts.");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search and filters (only user's contacts are shown)
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    const matchesPriority = filterPriority === "all" || contact.priority === filterPriority;
    const matchesInterest = filterInterest === "all" || contact.interest === filterInterest;

    return matchesSearch && matchesStatus && matchesPriority && matchesInterest;
  });

  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleEditStatus = (contact) => {
    setStatusEditingContact(contact);
    setIsStatusModalOpen(true);
  };

  const handleViewContact = (contact) => {
    setViewingContact(contact);
    setIsViewModalOpen(true);
  };

  const handleDeleteContact = (contact) => {
    setDeleteContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      // Simulate API call
      if (editingContact) {
        // Update existing contact
        const updatedContacts = contacts.map(contact => 
          contact._id === editingContact._id 
            ? { ...contact, ...contactData }
            : contact
        );
        setContacts(updatedContacts);
        toast.success('Your contact updated successfully!');
      } else {
        // Add new contact
        const newContact = {
          _id: Date.now().toString(),
          ...contactData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setContacts([newContact, ...contacts]);
        toast.success('Contact added successfully!');
      }
      setIsContactModalOpen(false);
      setEditingContact(null);
    } catch (err) {
      console.error('Error saving contact:', err);
      toast.error('Failed to save contact');
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      const updatedContacts = contacts.map(contact => 
        contact._id === statusEditingContact._id 
          ? { 
              ...contact, 
              status: statusData.status,
              priority: statusData.priority,
              isArchived: statusData.isArchived
            } 
          : contact
      );
      
      setContacts(updatedContacts);
      toast.success(`Your contact status updated successfully!`);
      setIsStatusModalOpen(false);
      setStatusEditingContact(null);
    } catch (err) {
      console.error('Error updating contact status:', err);
      toast.error('Failed to update contact status');
    }
  };

  const confirmDelete = async () => {
    try {
      const updatedContacts = contacts.filter(contact => contact._id !== deleteContact._id);
      setContacts(updatedContacts);
      toast.success('Your contact deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeleteContact(null);
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error('Failed to delete contact');
    }
  };

  // Status and Priority configurations
  const statusOptions = [
    { value: "new", label: "New", color: "blue", icon: <NewReleases /> },
    { value: "contacted", label: "Contacted", color: "green", icon: <DoneAll /> },
    { value: "qualified", label: "Qualified", color: "purple", icon: <CheckCircle /> },
    { value: "proposal", label: "Proposal Sent", color: "orange", icon: <Send /> },
    { value: "negotiation", label: "Negotiation", color: "amber", icon: <ScheduleSend /> },
    { value: "closed", label: "Closed", color: "gray", icon: <Cancel /> }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "gray", icon: <Flag /> },
    { value: "medium", label: "Medium", color: "blue", icon: <Flag /> },
    { value: "high", label: "High", color: "orange", icon: <PriorityHigh /> },
    { value: "urgent", label: "Urgent", color: "red", icon: <Warning /> }
  ];

  const interestOptions = [
    { value: "consulting", label: "Consulting", icon: <BusinessCenter /> },
    { value: "development", label: "Development", icon: <Work /> },
    { value: "design", label: "Design", icon: <Palette /> },
    { value: "marketing", label: "Marketing", icon: <TrendingUp /> },
    { value: "support", label: "Support", icon: <Support /> }
  ];

  const budgetOptions = [
    { value: "5000-15000", label: "$5K - $15K" },
    { value: "15000-30000", label: "$15K - $30K" },
    { value: "30000-50000", label: "$30K - $50K" },
    { value: "50000+", label: "$50K+" }
  ];

  const sourceOptions = [
    { value: "website", label: "Website", icon: <Language /> },
    { value: "referral", label: "Referral", icon: <Group /> },
    { value: "social", label: "Social Media", icon: <Share /> },
    { value: "event", label: "Event", icon: <Event /> },
    { value: "cold", label: "Cold Outreach", icon: <Email /> }
  ];

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      amber: "bg-amber-100 text-amber-800 border-amber-200",
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

  const getInterestIcon = (interest) => {
    const interestConfig = interestOptions.find(i => i.value === interest);
    return interestConfig?.icon || <Work />;
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

  // Contact Form Modal Component
  const ContactFormModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      interest: "consulting",
      budget: "5000-15000",
      source: "website",
      status: "new",
      priority: "medium"
    });

    useEffect(() => {
      if (editingContact) {
        setFormData({
          name: editingContact.name || "",
          email: editingContact.email || "",
          phone: editingContact.phone || "",
          company: editingContact.company || "",
          subject: editingContact.subject || "",
          message: editingContact.message || "",
          interest: editingContact.interest || "consulting",
          budget: editingContact.budget || "5000-15000",
          source: editingContact.source || "website",
          status: editingContact.status || "new",
          priority: editingContact.priority || "medium"
        });
      } else {
        // Pre-fill email with current user's email for new contacts
        const userEmail = getCurrentUserEmail();
        if (userEmail) {
          setFormData(prev => ({
            ...prev,
            email: userEmail
          }));
        }
      }
    }, [editingContact]);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveContact(formData);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsContactModalOpen(false);
          setEditingContact(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <ContactMail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {editingContact ? 'Edit Your Contact' : 'Add New Contact'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsContactModalOpen(false);
                  setEditingContact(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            {!editingContact && currentUserEmail && (
              <p className="text-blue-100 text-xs sm:text-sm mt-2">
                This contact will be associated with your email: {currentUserEmail}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                    readOnly={!!editingContact} // Make email read-only when editing
                  />
                  {editingContact && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      This is your contact - you can edit other details
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    Interest Area
                  </label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    {interestOptions.map(interest => (
                      <option key={interest.value} value={interest.value}>{interest.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    {budgetOptions.map(budget => (
                      <option key={budget.value} value={budget.value}>{budget.label}</option>
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

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter subject"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base resize-none"
                placeholder="Enter your message"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 sm:gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsContactModalOpen(false);
                  setEditingContact(null);
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
                <ContactMail className="w-3 h-3 sm:w-4 sm:h-4" />
                {editingContact ? 'Update Your Contact' : 'Add Contact'}
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
      isArchived: false
    });

    useEffect(() => {
      if (statusEditingContact) {
        setFormData({
          status: statusEditingContact.status || "new",
          priority: statusEditingContact.priority || "medium",
          isArchived: statusEditingContact.isArchived || false
        });
      }
    }, [statusEditingContact]);

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

    if (!statusEditingContact) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsStatusModalOpen(false);
          setStatusEditingContact(null);
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
                <h2 className="text-lg sm:text-xl font-bold text-white">Update Your Contact Status</h2>
              </div>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusEditingContact(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <p className="text-purple-100 mt-1 sm:mt-2 text-xs sm:text-sm">Update status for your contact: {statusEditingContact.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Contact Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
              <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {statusEditingContact.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{statusEditingContact.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{statusEditingContact.company}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Your Contact</span>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Contact Status
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {statusOptions.map((status) => (
                  <label 
                    key={status.value}
                    className={`relative flex flex-col items-center p-2 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${
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
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 ${
                      formData.status === status.value ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {status.icon}
                    </div>
                    <span className={`font-medium text-center text-xs sm:text-sm ${
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

            {/* Archive Option */}
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3">
                {formData.isArchived ? <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /> : <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                <div>
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">Archive Contact</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Move to archived contacts</p>
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
                  setStatusEditingContact(null);
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
    if (!deleteContact) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsDeleteModalOpen(false);
          setDeleteContact(null);
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
                <h2 className="text-lg sm:text-xl font-bold text-white">Delete Your Contact</h2>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteContact(null);
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
                This action cannot be undone. Your contact will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl mb-6">
              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                {deleteContact.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{deleteContact.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{deleteContact.company}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{deleteContact.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Your Contact</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteContact(null);
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
                Delete My Contact
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // View Contact Modal
  const ViewContactModal = () => {
    if (!viewingContact) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 xsm:p-3 sm:p-4 z-50"
        onClick={() => {
          setIsViewModalOpen(false);
          setViewingContact(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 bg-white/20 rounded-lg sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl">
                  {viewingContact.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{viewingContact.name}</h2>
                  <p className="text-blue-100 text-sm sm:text-base truncate">{viewingContact.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-green-200 text-sm">Your Contact</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingContact(null);
                }}
                className="text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
              >
                <Clear className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(viewingContact.status)}`}>
                {statusOptions.find(s => s.value === viewingContact.status)?.icon}
                {statusOptions.find(s => s.value === viewingContact.status)?.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getPriorityColor(viewingContact.priority)}`}>
                {priorityOptions.find(p => p.value === viewingContact.priority)?.icon}
                {priorityOptions.find(p => p.value === viewingContact.priority)?.label}
              </span>
              {viewingContact.isArchived && (
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
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base truncate">{viewingContact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Phone className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base">{viewingContact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Business className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Company</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base truncate">{viewingContact.company}</p>
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
                  <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-500">Subject</p>
                    <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base truncate">{viewingContact.subject}</p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Category className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Interest</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base capitalize">{viewingContact.interest}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <AttachMoney className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Budget</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                        {budgetOptions.find(b => b.value === viewingContact.budget)?.label || viewingContact.budget}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <Source className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Source</p>
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base capitalize">{viewingContact.source}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <ChatBubble className="text-purple-500 w-4 h-4 sm:w-5 sm:h-5" />
                Message
              </h3>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl max-h-32 overflow-y-auto">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm sm:text-base">{viewingContact.message}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <AccessTime className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
                Timeline
              </h3>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Created</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-right">{formatDate(viewingContact.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-right">{formatDate(viewingContact.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditStatus(viewingContact);
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
                  handleEditContact(viewingContact);
                }}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                Edit Contact
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteContact(viewingContact);
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

  // Contact Card Component
  const ContactCard = ({ contact }) => (
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
              {contact.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{contact.name}</h3>
              <p className="text-blue-100 text-xs sm:text-sm truncate">{contact.company}</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3 text-green-300" />
                <span className="text-green-200 text-xs">Your Contact</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
            <span className={`inline-flex items-center gap-1 px-1 sm:px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contact.status)}`}>
              {statusOptions.find(s => s.value === contact.status)?.icon}
            </span>
            <span className={`inline-flex items-center gap-1 px-1 sm:px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(contact.priority)}`}>
              {priorityOptions.find(p => p.value === contact.priority)?.icon}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contact.status)}`}>
            {statusOptions.find(s => s.value === contact.status)?.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(contact.priority)}`}>
            {priorityOptions.find(p => p.value === contact.priority)?.label}
          </span>
          {contact.isArchived && (
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
            <span className="truncate flex-1">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {getInterestIcon(contact.interest)}
            <span className="capitalize">{contact.interest}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <AttachMoney className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{budgetOptions.find(b => b.value === contact.budget)?.label || contact.budget}</span>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{contact.subject}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTimeAgo(contact.createdAt)}</span>
          <span className="capitalize">{contact.source}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewContact(contact)}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-200 text-xs sm:text-sm flex items-center gap-1"
          >
            <Visibility className="w-3 h-3 sm:w-4 sm:h-4" />
            View
          </motion.button>
          
          <div className="flex gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditStatus(contact)}
              className="p-1 sm:p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
              title="Update Status"
            >
              <TrackChanges className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditContact(contact)}
              className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              title="Edit Contact"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteContact(contact)}
              className="p-1 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
              title="Delete Contact"
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
                My Contacts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
                Manage your {pagination.total} contacts and leads
                {currentUserEmail && (
                  <span className="block text-sm text-green-600 dark:text-green-400">
                    Showing contacts for: {currentUserEmail}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full lg:w-auto mt-2 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchContacts}
                className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg sm:rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Refresh className="w-3 h-3 sm:w-4 sm:h-4" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddContact}
                className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Add className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Contact
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
                    placeholder="Search your contacts..."
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

              {/* Interest Filter */}
              <div className="xsm:col-span-2 md:col-span-2 lg:col-span-1">
                <select
                  value={filterInterest}
                  onChange={(e) => setFilterInterest(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="all">All Interests</option>
                  {interestOptions.map(interest => (
                    <option key={interest.value} value={interest.value}>{interest.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contacts Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredContacts.map((contact, index) => (
                <ContactCard key={contact._id} contact={contact} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredContacts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-12 max-w-xs sm:max-w-md mx-auto">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">No contacts found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : currentUserEmail 
                      ? `No contacts found for your email: ${currentUserEmail}`
                      : 'Please log in to view your contacts'
                  }
                </p>
                {!searchTerm && currentUserEmail && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddContact}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    Add Your First Contact
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isContactModalOpen && <ContactFormModal />}
        {isStatusModalOpen && <StatusEditModal />}
        {isDeleteModalOpen && <DeleteConfirmationModal />}
        {isViewModalOpen && <ViewContactModal />}
      </AnimatePresence>
    </div>
  );
};

// Additional icons
const Palette = () => <span>🎨</span>;
const Support = () => <span>🛟</span>;
const Language = () => <span>🌐</span>;
const Group = () => <span>👥</span>;
const Share = () => <span>📱</span>;
const Event = () => <span>📅</span>;