/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  Reply as ReplyIcon,
  Refresh as RefreshIcon,
  LockClock,
} from "@mui/icons-material";

export const QuestionAdmin = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });
  const [answerForm, setAnswerForm] = useState({ message: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://nexusbackend-hdyk.onrender.com/questions";

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      toast.error(
        error.response?.data?.message ||
          "Network or server error while processing your request."
      );
      return Promise.reject(error);
    }
  );

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/");
      const data = res.data?.data?.questions || [];
      setQuestions(data);
      setFilteredQuestions(data);
      toast.success(`Loaded ${data.length} questions`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let filtered = [...questions];
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.status)
      filtered = filtered.filter((q) => q.status === filters.status);
    if (filters.category)
      filtered = filtered.filter((q) => q.category === filters.category);
    if (filters.priority)
      filtered = filtered.filter((q) => q.priority === filters.priority);
    setFilteredQuestions(filtered);
  }, [searchTerm, filters, questions]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await api.delete(`/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Question deleted successfully");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/${id}`, { status });
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status } : q))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion || !answerForm.message.trim()) return;
    try {
      const res = await api.post(`/${selectedQuestion._id}/answer`, {
        answer: answerForm.message,
        answeredBy: "admin",
      });
      const updated = res.data?.data || res.data;
      setQuestions((prev) =>
        prev.map((q) => (q._id === selectedQuestion._id ? updated : q))
      );
      setIsAnswerModalOpen(false);
      setAnswerForm({ message: "" });
      toast.success("Answer submitted");
    } catch {
      toast.error("Failed to submit answer");
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const getStatusColor = (status) => {
    const map = {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      answered: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
      spam: "bg-red-100 text-red-800 border-red-200",
    };
    return map[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (p) => {
    const map = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      urgent: "bg-red-100 text-red-800 border-red-200",
    };
    return map[p] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          Loading questions...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          <WarningIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="mb-3">Error: {error}</p>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Question Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and respond to user questions
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={fetchQuestions}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-b from-blue-300 to-violet-500 text-white rounded-lg shadow hover:bg-blue-700"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Refresh</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          {["status", "category", "priority"].map((f) => (
            <select
              key={f}
              value={filters[f]}
              onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                All {f.charAt(0).toUpperCase() + f.slice(1)}s
              </option>
              {f === "status" &&
                ["new", "in-progress", "answered", "closed", "spam"].map(
                  (s) => <option key={s}>{s}</option>
                )}
              {f === "category" &&
                [
                  "general",
                  "technical",
                  "billing",
                  "support",
                  "bug-report",
                  "other",
                ].map((s) => <option key={s}>{s}</option>)}
              {f === "priority" &&
                ["low", "medium", "high", "urgent"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
            </select>
          ))}
        </div>

        {/* TABLE on md+ */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="table-auto w-full min-w-[700px] text-sm sm:text-base">
            <thead className="bg-gray-100 border-b text-gray-600 text-xs sm:text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">
                  Question
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuestions.map((q) => (
                <motion.tr
                  key={q._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <PersonIcon className="text-gray-400 w-4 h-4" />
                        <span className="font-medium text-gray-900 truncate">
                          {q.name || "Unknown"}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs truncate">
                        {q.subject || "No Subject"}
                      </span>
                      <span className="text-gray-400 text-xs truncate max-w-xs">
                        {q.message || "No message"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={q.status || "new"}
                      onChange={(e) =>
                        handleUpdateStatus(q._id, e.target.value)
                      }
                      className={`text-xs font-medium rounded-full border px-2.5 py-0.5 ${getStatusColor(
                        q.status
                      )}`}
                    >
                      <option>new</option>
                      <option>in-progress</option>
                      <option>answered</option>
                      <option>closed</option>
                      <option>spam</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                        q.priority
                      )}`}
                    >
                      {q.priority || "medium"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <LockClock className="w-4 h-4 mr-1 inline" />
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedQuestion(q);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-gradient-to-b from-blue-300 to-indigo-500 hover:bg-blue-50 rounded-lg"
                      >
                        <ViewIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuestion(q);
                          setIsAnswerModalOpen(true);
                        }}
                        className="p-2 bg-gradient-to-b from-green-300 to-green-500 hover:bg-green-50 rounded-lg"
                      >
                        <ReplyIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-2 bg-gradient-to-b from-red-300 to-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GRID view on small screens */}
        <div className="grid md:hidden gap-4">
          {filteredQuestions.map((q) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  {q.subject || "No Subject"}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getPriorityColor(
                    q.priority
                  )}`}
                >
                  {q.priority || "medium"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {q.message || "No message"}
              </p>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <PersonIcon className="w-4 h-4 text-gray-400" />{" "}
                {q.name || "Unknown"}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <LockClock className="w-4 h-4 text-gray-400" />{" "}
                {formatDate(q.createdAt)}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedQuestion(q);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-1 bg-gradient-to-b from-blue-300 to-indigo-500 border border-blue-200 rounded  text-xs"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedQuestion(q);
                    setIsAnswerModalOpen(true);
                  }}
                  className="flex-1 py-1 bg-gradient-to-b from-green-300 to-green-500 border border-green-200 rounded "
                >
                  Reply
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="flex-1 py-1 bg-gradient-to-b from-red-600 to-red-700 rounded "
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Modal */}
        <AnimatePresence>
          {isModalOpen && selectedQuestion && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 bg-gradient-to-b from-red-600 to-red-700"
                >
                  <CloseIcon />
                </button>
                <h2 className="text-xl font-semibold mb-4">Question Details</h2>
                <p className="text-gray-700 mb-2">
                  <strong>Name:</strong> {selectedQuestion.name || "Unknown"}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> {selectedQuestion.email || "No email"}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Subject:</strong>{" "}
                  {selectedQuestion.subject || "No subject"}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Message:</strong>{" "}
                  {selectedQuestion.message || "No message"}
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gradient-to-b from-red-300 to-red-500 rounded-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Modal */}
        <AnimatePresence>
          {isAnswerModalOpen && selectedQuestion && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form
                onSubmit={handleAnswerSubmit}
                className="bg-white rounded-lg max-w-lg w-full p-6 relative"
              >
                <button
                  onClick={() => setIsAnswerModalOpen(false)}
                  type="button"
                  className="absolute top-3 bg-gradient-to-b from-red-600 to-red-700 right-3 text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon />
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  Reply to: {selectedQuestion.name || "Unknown"}
                </h2>
                <textarea
                  value={answerForm.message}
                  onChange={(e) =>
                    setAnswerForm({ ...answerForm, message: e.target.value })
                  }
                  rows="4"
                  placeholder="Write your reply..."
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="flex items-center bg-gradient-to-b from-green-300 to-green-500 justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>Send Reply</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
