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
  Group,
  Business,
  LocalOffer,
  Schedule,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  Send,
  AttachFile,
  EmojiEmotions,
  Mic,
  Block,
  Report,
  Notifications,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  Edit,
  Reply,
  Forward,
  Print,
  Download,
  ContentCopy,
  Share,
  Visibility,
  ChatBubble,
  Email,
  Sms,
  Campaign,
  Inbox,
  Send as SendIcon,
  Drafts,
  Label as LabelIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  ContactMail,
  Settings,
  Help,
  SpaOutlined,
  TramSharp,
  SendAndArchive,
  InboxSharp,
  Receipt,
} from "@mui/icons-material";

export const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [mobileView, setMobileView] = useState("list");
  const messagesEndRef = useRef(null);

  // Mock data
  const messageTypes = [
    { value: "all", label: "All Messages", color: "default" },
    { value: "inbox", label: "Inbox", color: "blue", icon: <InboxSharp /> },
    { value: "sent", label: "Sent", icon: <SendAndArchive /> },
    { value: "drafts", label: "Drafts", icon: <Drafts /> },
    { value: "spam", label: "Spam", icon: <SpaOutlined /> },
    { value: "trash", label: "Trash", icon: <TramSharp /> },
  ];

  const messageCategories = [
    { value: "all", label: "All Categories", color: "default" },
    {
      value: "order",
      label: "Order Related",
      color: "blue",
      icon: <ShoppingCart />,
    },
    {
      value: "support",
      label: "Customer Support",
      color: "green",
      icon: <Support />,
    },
    { value: "billing", label: "Billing", color: "orange", icon: <Receipt /> },
    {
      value: "technical",
      label: "Technical",
      color: "purple",
      icon: <Build />,
    },
    { value: "general", label: "General", color: "gray", icon: <ChatBubble /> },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "gray" },
    { value: "normal", label: "Normal", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" },
  ];

  useEffect(() => {
    loadMessages();
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockMessages = generateMockMessages();
      setMessages(mockMessages);
      toast.success("Messages loaded successfully!");
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const mockConversations = generateMockConversations();
      setConversations(mockConversations);
      if (mockConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const generateMockMessages = () => {
    return Array.from({ length: 25 }, (_, index) => {
      const types = ["inbox", "sent", "drafts"];
      const categories = [
        "order",
        "support",
        "billing",
        "technical",
        "general",
      ];
      const priorities = ["low", "normal", "high", "urgent"];
      const senders = [
        {
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          type: "customer",
          avatar: "👩",
        },
        {
          name: "Mike Chen",
          email: "mike.chen@example.com",
          type: "customer",
          avatar: "👨",
        },
        {
          name: "Emma Wilson",
          email: "emma.w@example.com",
          type: "customer",
          avatar: "👩",
        },
        {
          name: "Support Team",
          email: "support@company.com",
          type: "support",
          avatar: "🏢",
        },
        {
          name: "Billing Dept",
          email: "billing@company.com",
          type: "billing",
          avatar: "💳",
        },
      ];

      const sender = senders[index % senders.length];
      const isInbox = Math.random() > 0.3;

      return {
        id: `msg-${1000 + index}`,
        type: types[index % types.length],
        category: categories[index % categories.length],
        priority: priorities[index % priorities.length],
        sender: isInbox
          ? sender
          : { name: "You", email: "me@company.com", type: "me", avatar: "👤" },
        recipient: isInbox
          ? { name: "You", email: "me@company.com", type: "me", avatar: "👤" }
          : sender,
        subject: `Message about ${categories[index % categories.length]} issue`,
        preview: `This is a preview of the message content regarding the ${
          categories[index % categories.length]
        } topic...`,
        body: `Dear ${isInbox ? "Customer" : sender.name},

This message is regarding your recent inquiry about ${
          categories[index % categories.length]
        }. We wanted to follow up and provide you with the information you requested.

${
  index % 3 === 0
    ? "We have successfully processed your request and everything is now complete."
    : index % 3 === 1
    ? "We need some additional information to proceed with your request."
    : "Your issue has been escalated to our technical team for further investigation."
}

Please let us know if you have any further questions.

Best regards,
${isInbox ? sender.name : "Your Support Team"}`,
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        read: index > 5, // First few messages are unread
        starred: index % 7 === 0,
        important: index % 5 === 0,
        hasAttachments: index % 4 === 0,
        labels:
          index % 3 === 0
            ? ["Follow-up", "Urgent"]
            : index % 3 === 1
            ? ["Completed"]
            : [],
        conversationId: `conv-${Math.floor(index / 5) + 1}`,
      };
    });
  };

  const generateMockConversations = () => {
    const conversationsMap = {};

    messages.forEach((message) => {
      if (!conversationsMap[message.conversationId]) {
        conversationsMap[message.conversationId] = {
          id: message.conversationId,
          participants: [message.sender, message.recipient],
          messages: [],
          subject: message.subject,
          lastMessage: message,
          unreadCount: 0,
          isStarred: false,
        };
      }
      conversationsMap[message.conversationId].messages.push(message);
      if (!message.read && message.type === "inbox") {
        conversationsMap[message.conversationId].unreadCount++;
      }
      if (message.starred) {
        conversationsMap[message.conversationId].isStarred = true;
      }
    });

    return Object.values(conversationsMap).sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      type: "sent",
      category: "general",
      priority: "normal",
      sender: {
        name: "You",
        email: "me@company.com",
        type: "me",
        avatar: "👤",
      },
      recipient: selectedConversation.participants.find((p) => p.type !== "me"),
      subject: selectedConversation.subject,
      body: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      important: false,
      hasAttachments: attachments.length > 0,
      labels: [],
      conversationId: selectedConversation.id,
    };

    // Update conversations
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: newMsg,
          }
        : conv
    );

    setConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find((conv) => conv.id === selectedConversation.id)
    );
    setNewMessage("");
    setAttachments([]);
    toast.success("Message sent!");
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
    toast.success("Message deleted");
  };

  const handleStarMessage = (messageId) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}m ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Custom Components
  const Chip = ({ label, color = "default", size = "medium", icon }) => {
    const colorClasses = {
      default: "bg-gray-100 text-gray-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      gray: "bg-gray-100 text-gray-800",
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
    };

    return (
      <button
        onClick={onClick}
        className={`rounded-full hover:bg-opacity-10 transition-colors ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  const MessageItem = ({ message, onClick, selected }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        selected ? "bg-blue-50" : "hover:bg-gray-50"
      } ${!message.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {message.sender.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span
                className={`font-semibold ${
                  !message.read ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {message.sender.name}
              </span>
              {message.starred && <Star className="text-yellow-500 text-sm" />}
              {message.important && (
                <Warning className="text-orange-500 text-sm" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              {message.hasAttachments && (
                <AttachFile className="text-gray-400 text-sm" />
              )}
              <span className="text-sm text-gray-500">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`font-medium ${
                !message.read ? "text-gray-800" : "text-gray-600"
              }`}
            >
              {message.subject}
            </span>
            <Chip label={message.category} color="blue" size="small" />
          </div>

          <p className="text-sm text-gray-600 truncate">{message.preview}</p>

          <div className="flex items-center space-x-2 mt-2">
            {message.labels.map((label, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ConversationItem = ({ conversation, onClick, isSelected }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 border-l-4 border-l-blue-500"
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {conversation.participants.find((p) => p.type !== "me")?.avatar ||
            "💬"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-800">
                {conversation.participants.find((p) => p.type !== "me")?.name}
              </span>
              {conversation.isStarred && (
                <Star className="text-yellow-500 text-sm" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              {conversation.unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {formatTime(conversation.lastMessage.timestamp)}
              </span>
            </div>
          </div>

          <p className="font-medium text-gray-800 mb-1 truncate">
            {conversation.subject}
          </p>

          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage.preview}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const ChatMessage = ({ message, isOwn }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isOwn ? "flex-row-reverse" : "flex-row"
        } items-end space-x-2`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
            isOwn
              ? "bg-gradient-to-br from-blue-500 to-blue-600"
              : "bg-gradient-to-br from-gray-500 to-gray-600"
          }`}
        >
          {message.sender.avatar}
        </div>

        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          <p className="text-sm">{message.body}</p>
          <p
            className={`text-xs mt-1 ${
              isOwn ? "text-blue-200" : "text-gray-500"
            }`}
          >
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const ComposeModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-0 right-6 w-96 bg-white rounded-t-2xl shadow-2xl border border-gray-200 z-50"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">New Message</h3>
          <button
            onClick={() => setComposeOpen(false)}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <Clear />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <input
            type="email"
            placeholder="Recipient"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <textarea
            placeholder="Type your message..."
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <IconButton>
              <AttachFile className="text-gray-600" />
            </IconButton>
            <IconButton>
              <EmojiEmotions className="text-gray-600" />
            </IconButton>
            <IconButton>
              <Label className="text-gray-600" />
            </IconButton>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-300 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-white rounded-2xl shadow-lg">
                  <ChatBubble className="text-blue-600 text-2xl md:text-3xl" />
                </div>
                Messages & Conversations
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your conversations and communicate with customers
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setComposeOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
              >
                <Add />
                Compose
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <div className="flex space-x-1">
              <button
                onClick={() => setMobileView("list")}
                className={`flex-1 px-4 py-2 rounded-2xl font-medium transition-colors ${
                  mobileView === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Conversations
              </button>
              <button
                onClick={() => setMobileView("chat")}
                className={`flex-1 px-4 py-2 rounded-2xl font-medium transition-colors ${
                  mobileView === "chat"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Messages
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 ${
              mobileView === "list" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="flex space-x-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {messageTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <button className="p-2 border border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors">
                    <FilterList className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation?.id === conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      if (window.innerWidth < 1024) {
                        setMobileView("chat");
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-3 ${
              mobileView === "chat" ? "block" : "hidden lg:block"
            }`}
          >
            {selectedConversation ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {
                          selectedConversation.participants.find(
                            (p) => p.type !== "me"
                          )?.avatar
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {
                            selectedConversation.participants.find(
                              (p) => p.type !== "me"
                            )?.name
                          }
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.unreadCount > 0
                            ? `${selectedConversation.unreadCount} unread messages`
                            : "Online"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <IconButton>
                        <Phone className="text-gray-600" />
                      </IconButton>
                      <IconButton>
                        <VideoCall className="text-gray-600" />
                      </IconButton>
                      <IconButton>
                        <Info className="text-gray-600" />
                      </IconButton>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message.sender.type === "me"}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <IconButton>
                        <AttachFile className="text-gray-600" />
                      </IconButton>
                      <IconButton>
                        <EmojiEmotions className="text-gray-600" />
                      </IconButton>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <ChatBubble className="text-gray-400 text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Conversation Selected
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Choose a conversation from the list to start messaging
                  </p>
                  <button
                    onClick={() => setComposeOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    Start New Conversation
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Compose Modal */}
        <AnimatePresence>{composeOpen && <ComposeModal />}</AnimatePresence>
      </div>
    </div>
  );
};

// Additional icons needed
const ShoppingCart = () => <span>🛒</span>;
const Support = () => <span>🛟</span>;
const Build = () => <span>⚙️</span>;
const VideoCall = () => <span>📹</span>;
