/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Search,
  FilterList,
  Add,
  Delete,
  Edit,
  Person,
  Email,
  Phone,
  Business,
  Message,
  Clear,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Block,
  Visibility,
  ChatBubble,
  ContactMail,
  SpaOutlined,
  TramSharp,
  AttachMoney,
  Category,
  Flag,
  Archive,
  Unarchive,
  ChevronLeft,
  ChevronRight,
  Close,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

export const MessagesManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterInterest, setFilterInterest] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(12);
  const [showContactModal, setShowContactModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://nexusbackend-hdyk.onrender.com/contact");
      setContacts(response.data.data.contacts || []);
      toast.success("Contacts loaded successfully!");
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Delete contact
  const handleDeleteContact = async (contactId) => {
    try {
      await axios.delete(`https://nexusbackend-hdyk.onrender.com/contact/${contactId}`);
      setContacts(contacts.filter(contact => contact._id !== contactId));
      setDeleteConfirm(null);
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
        setIsEditing(false);
        setShowContactModal(false);
      }
      toast.success("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact.");
    }
  };

  // Update contact
  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://nexusbackend-hdyk.onrender.com/contact/${selectedContact._id}`,
        editForm
      );
      setContacts(contacts.map(contact => 
        contact._id === selectedContact._id ? response.data : contact
      ));
      setSelectedContact(response.data);
      setIsEditing(false);
      toast.success("Contact updated successfully!");
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact.");
    }
  };

  // Toggle archive status
  const handleToggleArchive = async (contactId) => {
    try {
      const contact = contacts.find(c => c._id === contactId);
      const response = await axios.put(
        `https://nexusbackend-hdyk.onrender.com/contact/${contactId}`,
        { isArchived: !contact.isArchived }
      );
      
      setContacts(contacts.map(c => 
        c._id === contactId ? response.data : c
      ));
      
      if (selectedContact?._id === contactId) {
        setSelectedContact(response.data);
      }
      
      toast.success(`Contact ${!contact.isArchived ? 'archived' : 'unarchived'}!`);
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact.");
    }
  };

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    const matchesInterest = filterInterest === "all" || contact.interest === filterInterest;
    const matchesPriority = filterPriority === "all" || contact.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesInterest && matchesPriority;
  });

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // Handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsEditing(false);
    setShowContactModal(true);
  };

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status", color: "default" },
    { value: "new", label: "New", color: "blue" },
    { value: "read", label: "Read", color: "green" },
    { value: "replied", label: "Replied", color: "purple" },
    { value: "archived", label: "Archived", color: "gray" },
  ];

  // Interest options
  const interestOptions = [
    { value: "all", label: "All Interests" },
    { value: "general", label: "General" },
    { value: "consulting", label: "Consulting" },
    { value: "development", label: "Development" },
    { value: "support", label: "Support" },
  ];

  // Priority options
  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Budget options
  const budgetOptions = {
    "500-1000": "$500-1,000",
    "1000-5000": "$1,000-5,000",
    "5000-10000": "$5,000-10,000",
    "10000-50000": "$10,000-50,000",
    "50000+": "$50,000+"
  };

  // Gradient button styles
  const gradientStyles = {
    primary: "bg-gradient-to-t from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600",
    secondary: "bg-gradient-to-t from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600",
    success: "bg-gradient-to-t from-green-600 to-green-500 hover:from-green-700 hover:to-green-600",
    warning: "bg-gradient-to-t from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600",
    danger: "bg-gradient-to-t from-red-600 to-red-500 hover:from-red-700 hover:to-red-600",
    info: "bg-gradient-to-t from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600",
  };

  // Custom Components
  const Chip = ({ label, color = "default", size = "medium", icon }) => {
    const colorClasses = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    const sizeClasses = {
      small: "px-2 py-1 text-xs",
      medium: "px-3 py-1 text-sm",
    };

    return (
      <span
        className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </span>
    );
  };

  const GradientButton = ({
    children,
    onClick,
    className = "",
    size = "medium",
    variant = "primary",
    ...props
  }) => {
    const sizeClasses = {
      xsmall: "px-2 py-1 text-xs",
      small: "px-3 py-2 text-sm",
      medium: "px-4 py-2 text-sm",
      large: "px-6 py-3 text-base",
    };

    return (
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} ${gradientStyles[variant]} text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  const IconButton = ({
    children,
    onClick,
    className = "",
    size = "medium",
    ...props
  }) => {
    const sizeClasses = {
      small: "p-1",
      medium: "p-2",
      large: "p-3",
    };

    return (
      <button
        onClick={onClick}
        className={`rounded-full hover:bg-opacity-10 transition-colors ${sizeClasses[size]} ${className} dark:text-gray-300 dark:hover:bg-gray-700`}
        {...props}
      >
        {children}
      </button>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
        <div className="text-sm text-gray-700 dark:text-gray-300 text-center xs:text-left">
          Showing {indexOfFirstContact + 1} to {Math.min(indexOfLastContact, filteredContacts.length)} of {filteredContacts.length} results
        </div>
        <div className="flex items-center justify-center space-x-1">
          <GradientButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="secondary"
            size="xsmall"
            className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronLeft className="text-lg" />
          </GradientButton>
          
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }

            return (
              <GradientButton
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "primary" : "secondary"}
                size="xsmall"
                className="min-w-[2rem]"
              >
                {page}
              </GradientButton>
            );
          })}
          
          <GradientButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="secondary"
            size="xsmall"
            className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronRight className="text-lg" />
          </GradientButton>
        </div>
      </div>
    );
  };

  const ContactItem = ({ contact, onClick, isSelected }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 border border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected 
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500" 
          : "bg-white dark:bg-gray-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
      } ${contact.isArchived ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          <Person />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                {contact.name || "Unknown"}
              </span>
              {contact.isArchived && (
                <Archive className="text-gray-400 text-sm" />
              )}
              <Chip 
                label={contact.status || "new"} 
                color={
                  contact.status === "read" ? "green" : 
                  contact.status === "replied" ? "purple" : 
                  contact.status === "archived" ? "gray" : "blue"
                } 
                size="small" 
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(contact.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Email className="text-gray-400 text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {contact.email || "No email"}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Category className="text-gray-400 text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {contact.interest || "general"}
            </span>
          </div>

          {contact.subject && (
            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2 line-clamp-1">
              {contact.subject}
            </p>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {contact.message || "No message provided"}
          </p>

          <div className="flex items-center flex-wrap gap-2">
            {contact.budget && (
              <Chip 
                label={budgetOptions[contact.budget] || contact.budget} 
                color="green" 
                size="small" 
                icon={<AttachMoney className="text-xs" />}
              />
            )}
            {contact.priority && (
              <Chip 
                label={contact.priority} 
                color={
                  contact.priority === "high" ? "orange" : 
                  contact.priority === "urgent" ? "red" : "gray"
                } 
                size="small" 
                icon={<Flag className="text-xs" />}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ContactModal = () => {
    if (!selectedContact) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 xs:p-4"
        onClick={() => setShowContactModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-4 xs:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  <Person />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xl">
                    {selectedContact.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedContact.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <IconButton
                  onClick={() => handleToggleArchive(selectedContact._id)}
                  className={selectedContact.isArchived ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20" : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}
                >
                  {selectedContact.isArchived ? <Unarchive /> : <Archive />}
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsEditing(true);
                    setEditForm(selectedContact);
                  }}
                  className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => setDeleteConfirm(selectedContact._id)}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <Delete />
                </IconButton>
                <IconButton
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Close />
                </IconButton>
              </div>
            </div>
          </div>

          {/* Contact Details - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 xs:p-6">
            {isEditing ? (
              <form onSubmit={handleUpdateContact} className="space-y-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={editForm.company || ""}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editForm.subject || ""}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={editForm.message || ""}
                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interest
                    </label>
                    <select
                      value={editForm.interest || "general"}
                      onChange={(e) => setEditForm({ ...editForm, interest: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {interestOptions.slice(1).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={editForm.status || "new"}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {statusOptions.slice(1).map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={editForm.priority || "medium"}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {priorityOptions.slice(1).map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-x-3 pt-4">
                  <GradientButton
                    type="submit"
                    variant="success"
                    className="flex-1"
                  >
                    Save Changes
                  </GradientButton>
                  <GradientButton
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </GradientButton>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h4>
                      <p className="text-gray-800 dark:text-gray-200">{selectedContact.email || "Not provided"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h4>
                      <p className="text-gray-800 dark:text-gray-200">{selectedContact.phone || "Not provided"}</p>
                    </div>
                    {selectedContact.company && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Company</h4>
                        <p className="text-gray-800 dark:text-gray-200">{selectedContact.company}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h4>
                      <Chip 
                        label={selectedContact.status || "new"} 
                        color={
                          selectedContact.status === "read" ? "green" : 
                          selectedContact.status === "replied" ? "purple" : 
                          selectedContact.status === "archived" ? "gray" : "blue"
                        } 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</h4>
                      <Chip 
                        label={selectedContact.priority || "medium"} 
                        color={
                          selectedContact.priority === "high" ? "orange" : 
                          selectedContact.priority === "urgent" ? "red" : "gray"
                        } 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Interest</h4>
                      <Chip 
                        label={selectedContact.interest || "general"} 
                        color="purple"
                      />
                    </div>
                  </div>
                </div>

                {selectedContact.budget && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Budget</h4>
                    <Chip 
                      label={budgetOptions[selectedContact.budget] || selectedContact.budget} 
                      color="green"
                      icon={<AttachMoney />}
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</h4>
                  <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{selectedContact.subject}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Message</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {selectedContact.message || "No message provided"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Received</h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {new Date(selectedContact.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const DeleteConfirmation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Delete Contact
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this contact? This action cannot be undone.
        </p>
        <div className="flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-x-3">
          <GradientButton
            onClick={() => setDeleteConfirm(null)}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </GradientButton>
          <GradientButton
            onClick={() => handleDeleteContact(deleteConfirm)}
            variant="danger"
            className="flex-1"
          >
            Delete
          </GradientButton>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    <ContactMail className="text-blue-600 dark:text-blue-400 text-2xl md:text-3xl" />
                  </div>
                  Contact Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage and respond to customer inquiries ({contacts.length} contacts)
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <IconButton
                  onClick={toggleDarkMode}
                  className="text-gray-600 dark:text-gray-400"
                  size="large"
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                
                <GradientButton
                  onClick={fetchContacts}
                  variant="info"
                  className="flex items-center gap-2"
                >
                  <Refresh />
                  Refresh
                </GradientButton>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterInterest}
                  onChange={(e) => setFilterInterest(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {interestOptions.map((interest) => (
                    <option key={interest.value} value={interest.value}>
                      {interest.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contacts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {currentContacts.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
                  <ContactMail className="text-4xl mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg">No contacts found</p>
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                currentContacts.map((contact) => (
                  <ContactItem
                    key={contact._id}
                    contact={contact}
                    isSelected={selectedContact?._id === contact._id}
                    onClick={() => handleContactSelect(contact)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination />
          </div>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {showContactModal && <ContactModal />}
          {deleteConfirm && <DeleteConfirmation />}
        </AnimatePresence>
      </div>
    </div>
  );
};