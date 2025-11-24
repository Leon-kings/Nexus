/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Edit,
  Delete,
  Visibility,
  Add,
  Search,
  FilterList,
  Close,
  Save,
  Cancel,
  CheckCircle,
  Error,
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage,
  Refresh,
  Download,
  Upload,
  Person,
  Email,
  CalendarToday,
  Category,
  MoreVert,
  Block,
  Check,
  Warning,
} from "@mui/icons-material";

const API_BASE_URL = "https://nexusbackend-hdyk.onrender.com/subscription";

export const SubscriptionManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "subscribedAt", direction: "desc" });
  
  // Modal states
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    status: "active",
    source: "website_footer"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch subscribers from API
  const fetchSubscribers = async () => {
    try {
      setIsLoadingData(true);
      const response = await axios.get(`${API_BASE_URL}/`);
      console.log("API Response:", response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setSubscribers(response.data.data);
        setFilteredSubscribers(response.data.data);
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setModalMessage("Failed to fetch subscribers. Please try again.");
      setIsErrorModalOpen(true);
      // Set empty arrays to prevent errors
      setSubscribers([]);
      setFilteredSubscribers([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = subscribers;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }
    
    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(sub => sub.source === sourceFilter);
    }
    
    setFilteredSubscribers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [subscribers, searchTerm, statusFilter, sourceFilter]);

  // Sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedSubscribers.slice(startIndex, endIndex);

  // CRUD Operations
  const handleView = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsViewModalOpen(true);
  };

  const handleEdit = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setFormData({
      email: subscriber.email || "",
      status: subscriber.status || "active",
      source: subscriber.source || "website_footer"
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      email: "",
      status: "active",
      source: "website_footer"
    });
    setIsAddModalOpen(true);
  };

  // API Operations
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/${selectedSubscriber._id}`);
      await fetchSubscribers(); // Refresh the list
      setModalMessage("Subscriber deleted successfully!");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      setModalMessage("Failed to delete subscriber. Please try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/${selectedSubscriber._id}`, formData);
      await fetchSubscribers(); // Refresh the list
      setModalMessage("Subscriber updated successfully!");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error updating subscriber:", error);
      setModalMessage("Failed to update subscriber. Please try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const handleAddSubmit = async () => {
    setIsLoading(true);
    try {
      const subscriberData = {
        email: formData.email,
        status: formData.status,
        source: formData.source,
        subscribedAt: new Date().toISOString(),
      };
      
      await axios.post(`${API_BASE_URL}/subscribe`, subscriberData);
      await fetchSubscribers(); // Refresh the list
      setModalMessage("New subscriber added successfully!");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error adding subscriber:", error);
      if (error.response?.status === 409) {
        setModalMessage("This email is already subscribed!");
      } else {
        setModalMessage("Failed to add subscriber. Please try again.");
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
    }
  };

  // Toggle subscriber status
  const toggleStatus = async (subscriber) => {
    try {
      const newStatus = subscriber.status === "active" ? "inactive" : "active";
      await axios.put(`${API_BASE_URL}/${subscriber._id}`, { status: newStatus });
      await fetchSubscribers(); // Refresh the list
      setModalMessage(`Subscriber ${newStatus === "active" ? "activated" : "deactivated"} successfully!`);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error toggling status:", error);
      setModalMessage("Failed to update status. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
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
    
    return pages;
  };

  // Modal variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Table row animation
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status count
  const getStatusCount = (status) => {
    return subscribers.filter(sub => sub.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 xs:p-3 sm:p-4 md:p-6 transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 xs:mb-5 sm:mb-6 md:mb-8"
      >
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">
              Subscriber Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base">
              Manage your newsletter subscribers from the API
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm p-3 xs:p-4 sm:p-6 mb-4 xs:mb-5 sm:mb-6 transition-colors duration-300"
      >
        <div className="flex flex-col lg:flex-row gap-3 xs:gap-4 sm:gap-6 items-stretch lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-base xs:text-lg sm:text-xl" />
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm xs:text-base"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 min-w-[140px] px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="flex-1 min-w-[140px] px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
            >
              <option value="all">All Sources</option>
              <option value="website_footer">Website Footer</option>
              <option value="landing_page">Landing Page</option>
              <option value="referral">Referral</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 xs:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg text-sm xs:text-base"
            >
              <Add className="text-base xs:text-lg sm:text-xl" />
              <span className="hidden xs:inline">Add Subscriber</span>
              <span className="xs:hidden">Add</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-5 sm:mb-6"
      >
        {[
          { label: "Total Subscribers", value: subscribers.length, icon: Person, color: "blue" },
          { label: "Active", value: getStatusCount("active"), icon: CheckCircle, color: "green" },
          { label: "Inactive", value: getStatusCount("inactive"), icon: Error, color: "red" },
          { label: "This Month", value: subscribers.filter(s => {
            const subDate = new Date(s.subscribedAt);
            const now = new Date();
            return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
          }).length, icon: CalendarToday, color: "purple" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm p-3 xs:p-4 sm:p-6 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm font-medium truncate">
                  {stat.label}
                </p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 xs:mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 xs:p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-base xs:text-lg sm:text-xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm overflow-hidden transition-colors duration-300"
      >
        {/* Loading State */}
        {isLoadingData && (
          <div className="flex items-center justify-center py-6 xs:py-8 sm:py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 xs:h-6 sm:h-8 w-5 xs:w-6 sm:w-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"
            />
            <span className="ml-2 xs:ml-3 text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base">
              Loading subscribers...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingData && filteredSubscribers.length === 0 && (
          <div className="text-center py-6 xs:py-8 sm:py-12 px-3 xs:px-4">
            <Email className="mx-auto text-gray-400 dark:text-gray-500 text-2xl xs:text-3xl sm:text-4xl mb-2 xs:mb-3 sm:mb-4" />
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 xs:mb-2">
              No subscribers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base mb-3 xs:mb-4 sm:mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || sourceFilter !== "all" 
                ? "Try adjusting your search or filters"
                : "Get started by adding your first subscriber"
              }
            </p>
            {!searchTerm && statusFilter === "all" && sourceFilter === "all" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg mx-auto text-sm xs:text-base"
              >
                <Add />
                Add First Subscriber
              </motion.button>
            )}
          </div>
        )}

        {/* Table Content */}
        {!isLoadingData && filteredSubscribers.length > 0 && (
          <>
            {/* Items Per Page Selector - Mobile */}
            <div className="flex items-center justify-between p-2 xs:p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
              <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs xs:text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {[
                      { key: "email", label: "Email", showMobile: true, showXSM: true },
                      { key: "status", label: "Status", showMobile: true, showXSM: true },
                      { key: "source", label: "Source", showMobile: false, showXSM: false },
                      { key: "subscribedAt", label: "Subscribed", showMobile: false, showXSM: false },
                      { key: "actions", label: "Actions", showMobile: true, showXSM: true }
                    ].map((column) => (
                      <th
                        key={column.key}
                        className={`px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 ${
                          !column.showMobile ? 'hidden lg:table-cell' : 
                          !column.showXSM ? 'hidden sm:table-cell' : ''
                        }`}
                        onClick={() => column.key !== "actions" && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-1 xs:gap-2">
                          <span className="truncate">{column.label}</span>
                          {sortConfig.key === column.key && (
                            <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {currentItems.map((subscriber, index) => (
                      <motion.tr
                        key={subscriber._id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
                            <div className="w-5 xs:w-6 sm:w-8 h-5 xs:h-6 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs xs:text-sm font-medium flex-shrink-0">
                              {subscriber.email?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white truncate">
                                {subscriber.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleStatus(subscriber)}
                            className={`inline-flex items-center px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              subscriber.status === "active" 
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30" 
                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
                            }`}
                          >
                            {subscriber.status === "active" ? 
                              <Check className="w-2.5 xs:w-3 sm:w-4 h-2.5 xs:h-3 sm:h-4 mr-0.5 xs:mr-1" /> : 
                              <Block className="w-2.5 xs:w-3 sm:w-4 h-2.5 xs:h-3 sm:h-4 mr-0.5 xs:mr-1" />
                            }
                            <span className="hidden xs:inline">{subscriber.status || "unknown"}</span>
                            <span className="xs:hidden">{subscriber.status === "active" ? "Act" : "Inact"}</span>
                          </motion.button>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <span className="text-xs xs:text-sm text-gray-900 dark:text-gray-100 capitalize">
                            {subscriber.source ? subscriber.source.replace('_', ' ') : "unknown"}
                          </span>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <p className="text-xs xs:text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(subscriber.subscribedAt)}
                          </p>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleView(subscriber)}
                              className="p-1 xs:p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                              title="View"
                            >
                              <Visibility fontSize="small" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(subscriber)}
                              className="p-1 xs:p-1.5 sm:p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit fontSize="small" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(subscriber)}
                              className="p-1 xs:p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <Delete fontSize="small" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col xs:flex-row items-center justify-between px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 gap-2 xs:gap-3 transition-colors duration-300"
              >
                <div className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 text-center xs:text-left">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredSubscribers.length)} of{" "}
                  {filteredSubscribers.length} entries
                </div>
                
                {/* Items Per Page Selector - Desktop */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs xs:text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2">
                  {/* First Page */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-1 xs:p-1.5 sm:p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-600 dark:text-gray-400"
                  >
                    <FirstPage fontSize="small" />
                  </motion.button>

                  {/* Previous Page */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 xs:p-1.5 sm:p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-600 dark:text-gray-400"
                  >
                    <NavigateBefore fontSize="small" />
                  </motion.button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-0.5 xs:gap-1">
                    {getPageNumbers().map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goToPage(page)}
                        className={`px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-xs xs:text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-lg"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  {/* Next Page */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 xs:p-1.5 sm:p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-600 dark:text-gray-400"
                  >
                    <NavigateNext fontSize="small" />
                  </motion.button>

                  {/* Last Page */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 xs:p-1.5 sm:p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-600 dark:text-gray-400"
                  >
                    <LastPage fontSize="small" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedSubscriber && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 xs:mx-3 sm:mx-4 p-3 xs:p-4 sm:p-6 relative transition-colors duration-300"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Close fontSize="small" />
              </motion.button>

              <div className="text-center space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="w-12 xs:w-14 sm:w-16 md:w-20 h-12 xs:h-14 sm:h-16 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg xs:text-xl sm:text-2xl font-bold mx-auto">
                  {selectedSubscriber.email?.[0]?.toUpperCase() || "U"}
                </div>

                <div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2">
                    Subscriber Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base break-all">
                    {selectedSubscriber.email || "No email"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm">
                  <div className="text-center p-2 xs:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white text-xs xs:text-sm">Status</p>
                    <span className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedSubscriber.status === "active" 
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400" 
                        : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                    }`}>
                      {selectedSubscriber.status || "unknown"}
                    </span>
                  </div>
                  <div className="text-center p-2 xs:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white text-xs xs:text-sm">Source</p>
                    <p className="text-gray-600 dark:text-gray-400 capitalize mt-1 text-xs xs:text-sm">
                      {selectedSubscriber.source ? selectedSubscriber.source.replace('_', ' ') : "unknown"}
                    </p>
                  </div>
                </div>

                <div className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p className='text-indigo-300'>Subscribed: {formatDate(selectedSubscriber.subscribedAt)}</p>
                  <p className='text-blue-200'>Created: {formatDate(selectedSubscriber.createdAt)}</p>
                  <p className='text-violet-300'>Updated: {formatDate(selectedSubscriber.updatedAt)}</p>
                  <p className="break-all text-red-500">ID: {selectedSubscriber._id}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedSubscriber && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 xs:mx-3 sm:mx-4 p-3 xs:p-4 sm:p-6 relative transition-colors duration-300"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Close fontSize="small" />
              </motion.button>

              <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 sm:mb-6">Edit Subscriber</h3>

              <form className="space-y-3 xs:space-y-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                      Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
                    >
                      <option value="website_footer">Website Footer</option>
                      <option value="landing_page">Landing Page</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2 xs:pt-3 sm:pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-1 xs:gap-2 text-sm xs:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Cancel fontSize="small" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isLoading || !formData.email}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-1 xs:gap-2 disabled:opacity-50 text-sm xs:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Save fontSize="small" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 xs:mx-3 sm:mx-4 p-3 xs:p-4 sm:p-6 relative transition-colors duration-300"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Close fontSize="small" />
              </motion.button>

              <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 sm:mb-6">Add New Subscriber</h3>

              <form className="space-y-3 xs:space-y-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm xs:text-base"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                      Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm xs:text-base"
                    >
                      <option value="website_footer">Website Footer</option>
                      <option value="landing_page">Landing Page</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2 xs:pt-3 sm:pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-1 xs:gap-2 text-sm xs:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Cancel fontSize="small" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleAddSubmit}
                    disabled={isLoading || !formData.email}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-1 xs:gap-2 disabled:opacity-50 text-sm xs:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Add fontSize="small" />
                        Add Subscriber
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedSubscriber && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 xs:mx-3 sm:mx-4 p-3 xs:p-4 sm:p-6 relative transition-colors duration-300"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="w-10 xs:w-12 sm:w-14 md:w-16 h-10 xs:h-12 sm:h-14 md:h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Warning className="text-red-600 dark:text-red-400 text-lg xs:text-xl sm:text-2xl" />
                </div>

                <div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2">
                    Delete Subscriber
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base">
                    Are you sure you want to delete <strong className="break-all">{selectedSubscriber.email}</strong>? 
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                  <motion.button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 text-sm xs:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmDelete}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-1 xs:gap-2 disabled:opacity-50 text-sm xs:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Delete fontSize="small" />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 xs:mx-3 sm:mx-4 p-3 xs:p-4 sm:p-6 relative transition-colors duration-300"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="w-10 xs:w-12 sm:w-14 md:w-16 h-10 xs:h-12 sm:h-14 md:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="text-green-600 dark:text-green-400 text-lg xs:text-xl sm:text-2xl" />
                </div>

                <div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2">
                    Success!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base">{modalMessage}</p>
                </div>

                <motion.button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 text-sm xs:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {isErrorModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 xs:mx-3 sm:mx-4 p-3 xs:p-4 sm:p-6 relative transition-colors duration-300"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="w-10 xs:w-12 sm:w-14 md:w-16 h-10 xs:h-12 sm:h-14 md:h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Error className="text-red-600 dark:text-red-400 text-lg xs:text-xl sm:text-2xl" />
                </div>

                <div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2">
                    Error!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base">{modalMessage}</p>
                </div>

                <motion.button
                  onClick={() => setIsErrorModalOpen(false)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 text-sm xs:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};