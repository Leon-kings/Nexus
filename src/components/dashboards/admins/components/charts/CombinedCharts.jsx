/* eslint-disable no-unused-vars */
// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  People,
  ShoppingCart,
  AttachMoney,
  Inventory,
  Message,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  Dashboard,
  Notifications,
  PersonAdd,
  Warning,
  BarChart,
  PieChart,
  ShowChart,
  DonutLarge,
  TrendingUp as TrendingUpIcon,
  Refresh,
  Download,
  FilterList,
  Search,
  Email,
  Phone,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  DashboardCustomize,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar, PolarArea } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardChart = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    balance: 0,
    stock: 0,
    messages: 0,
    bookings: 0,
    profit: 0,
    loss: 0,
  });

  const [activeChart, setActiveChart] = useState("all");
  const [timeRange, setTimeRange] = useState("monthly");

  // Mock API base URL
  const API_BASE = "https://jsonplaceholder.typicode.com";

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls with axios
      const [
        usersResponse,
        productsResponse,
        financialResponse,
        activitiesResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/posts`),
        axios.get(`${API_BASE}/comments`),
        axios.get(`${API_BASE}/todos`),
      ]);

      // Transform API data to match our needs
      const usersData = usersResponse.data;
      const productsData = productsResponse.data;
      const financialData = financialResponse.data;
      const activitiesData = activitiesResponse.data;

      // Update stats with transformed data
      setStats({
        users: usersData.length * 124,
        products: productsData.length,
        balance: 125430 + financialData.length * 100,
        stock: 456 + productsData.length * 2,
        messages: activitiesData.filter((act) => !act.completed).length,
        bookings: activitiesData.filter((act) => act.completed).length,
        profit: 45200 + financialData.length * 50,
        loss: 3200 + productsData.length * 10,
      });

      toast.success("Dashboard data loaded successfully! 🚀");
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load dashboard data. Using demo data.");

      // Fallback demo data
      setStats({
        users: 1245,
        products: 89,
        balance: 125430,
        stock: 456,
        messages: 23,
        bookings: 67,
        profit: 45200,
        loss: 3200,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
    toast.info("Refreshing data...");
  };

  const exportData = () => {
    toast.success("Exporting dashboard data...");
    // In real app, this would generate and download a file
  };

  // Chart data configurations
  const chartData = {
    users: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Active Users",
          data: [650, 790, 900, 1020, 1150, 1245],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
        },
      ],
    },
    products: {
      labels: ["Laptops", "Smartphones", "Tablets", "Accessories"],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(139, 92, 246)",
          ],
          borderWidth: 3,
          borderColor: "#fff",
          hoverOffset: 15,
        },
      ],
    },
    revenue: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Revenue",
          data: [120000, 135000, 142000, 155000],
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: "Loss",
          data: [8000, 6500, 3200, 4800],
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    stock: {
      labels: ["Laptops", "Phones", "Tablets", "Monitors", "Accessories"],
      datasets: [
        {
          data: [120, 85, 65, 45, 141],
          backgroundColor: [
            "rgba(59, 130, 246, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(245, 158, 11, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(236, 72, 153, 0.7)",
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    balance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Balance Amount",
          data: [85000, 92000, 105000, 112000, 118000, 125430],
          borderColor: "rgb(245, 158, 11)",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
        },
      ],
    },
    profitLoss: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Profit",
          data: [38000, 42000, 39500, 45200, 48500, 51000],
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: "Loss",
          data: [2800, 3200, 2500, 3100, 2900, 3200],
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value) {
            return value >= 1000 ? value / 1000 + "K" : value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const chartTypes = [
    { id: "all", label: "All Charts", icon: <TrendingUpIcon /> },
    { id: "users", label: "Users", icon: <ShowChart /> },
    { id: "products", label: "Products", icon: <PieChart /> },
    { id: "revenue", label: "Revenue", icon: <BarChart /> },
    { id: "stock", label: "Stock", icon: <DonutLarge /> },
  ];

  const timeRanges = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];

  const renderChart = (chartKey, title, type) => {
    const options = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          display: true,
          text: title,
          color: "#1f2937",
          font: {
            size: 16,
            weight: "600",
          },
          padding: 20,
        },
      },
    };

    switch (type) {
      case "line":
        return <Line data={chartData[chartKey]} options={options} />;
      case "doughnut":
        return <Doughnut data={chartData[chartKey]} options={options} />;
      case "bar":
        return <Bar data={chartData[chartKey]} options={options} />;
      case "polarArea":
        return <PolarArea data={chartData[chartKey]} options={options} />;
      default:
        return <Line data={chartData[chartKey]} options={options} />;
    }
  };

  const charts = [
    {
      key: "users",
      title: "Users Growth Analytics",
      type: "line",
      cols: "lg:col-span-2",
      icon: <People />,
    },
    {
      key: "products",
      title: "Product Distribution",
      type: "doughnut",
      cols: "lg:col-span-1",
      icon: <ShoppingCart />,
    },
    {
      key: "revenue",
      title: "Revenue vs Loss Analysis",
      type: "bar",
      cols: "lg:col-span-2",
      icon: <AttachMoney />,
    },
    {
      key: "stock",
      title: "Electronics Stock Levels",
      type: "polarArea",
      cols: "lg:col-span-1",
      icon: <Inventory />,
    },
    {
      key: "balance",
      title: "Balance Trend Overview",
      type: "line",
      cols: "lg:col-span-2",
      icon: <TrendingUp />,
    },
    {
      key: "profitLoss",
      title: "Profit & Loss Analysis",
      type: "bar",
      cols: "lg:col-span-2",
      icon: <BarChart />,
    },
  ];

  const filteredCharts =
    activeChart === "all"
      ? charts
      : charts.filter((chart) => chart.key === activeChart);

  // Recent Activities Data
  const activities = [
    {
      id: 1,
      type: "message",
      title: "New customer message",
      description: "John Doe sent a new inquiry about MacBook Pro",
      time: "2 min ago",
      icon: <Message className="text-blue-600" />,
      status: "new",
    },
    {
      id: 2,
      type: "order",
      title: "New order placed",
      description: 'Order #12345 for MacBook Pro 16"',
      time: "5 min ago",
      icon: <ShoppingCart className="text-green-600" />,
      status: "completed",
    },
    {
      id: 3,
      type: "user",
      title: "New user registered",
      description: "Sarah Johnson joined the platform",
      time: "10 min ago",
      icon: <PersonAdd className="text-purple-600" />,
      status: "new",
    },
    {
      id: 4,
      type: "alert",
      title: "Low stock alert",
      description: "iPhone 14 Pro running low (12 units left)",
      time: "15 min ago",
      icon: <Warning className="text-yellow-600" />,
      status: "warning",
    },
    {
      id: 5,
      type: "notification",
      title: "System update completed",
      description: "Dashboard updated to v2.1 with new features",
      time: "1 hour ago",
      icon: <Notifications className="text-gray-600" />,
      status: "info",
    },
  ];

  // Stock Items Data
  const stockItems = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      category: "Laptops",
      stock: 45,
      price: 2499,
      status: "in-stock",
      trend: "up",
      icon: <Laptop className="text-blue-500" />,
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      category: "Smartphones",
      stock: 12,
      price: 1199,
      status: "low",
      trend: "down",
      icon: <Smartphone className="text-green-500" />,
    },
    {
      id: 3,
      name: "iPad Air",
      category: "Tablets",
      stock: 28,
      price: 799,
      status: "in-stock",
      trend: "stable",
      icon: <Phone className="text-purple-500" />,
    },
    {
      id: 4,
      name: "AirPods Pro",
      category: "Accessories",
      stock: 65,
      price: 249,
      status: "in-stock",
      trend: "up",
      icon: <Headphones className="text-pink-500" />,
    },
    {
      id: 5,
      name: "Apple Watch",
      category: "Wearables",
      stock: 8,
      price: 399,
      status: "low",
      trend: "down",
      icon: <Watch className="text-orange-500" />,
    },
  ];

  const StatCard = ({ title, value, icon, change, changeType, loading }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={loading ? "loading" : value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mt-2"
            >
              {loading ? "..." : value}
            </motion.p>
          </AnimatePresence>
          <div
            className={`flex items-center mt-3 ${
              changeType === "increase" ? "text-green-600" : "text-red-600"
            }`}
          >
            {changeType === "increase" ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-semibold">
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Dashboard...
          </h2>
          <p className="text-gray-500 mt-2">Fetching latest analytics data</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-2 bg-white rounded-2xl shadow-lg"
              >
                <DashboardCustomize className="text-blue-600 text-3xl" />
              </motion.div>
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive overview of your business performance
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Refresh className="text-blue-600" />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300"
            >
              <Download />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Users"
            value={stats.users.toLocaleString()}
            icon={<People className="text-blue-600 text-2xl" />}
            change={12.5}
            changeType="increase"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Products"
            value={stats.products}
            icon={<ShoppingCart className="text-green-600 text-2xl" />}
            change={8.2}
            changeType="increase"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Balance Amount"
            value={`$${stats.balance.toLocaleString()}`}
            icon={<AttachMoney className="text-yellow-600 text-2xl" />}
            change={5.7}
            changeType="increase"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Electronics Stock"
            value={stats.stock}
            icon={<Inventory className="text-purple-600 text-2xl" />}
            change={-3.1}
            changeType="decrease"
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Second Row Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Messages"
            value={stats.messages}
            icon={<Message className="text-indigo-600 text-2xl" />}
            change={15.3}
            changeType="increase"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Bookings"
            value={stats.bookings}
            icon={<CalendarToday className="text-pink-600 text-2xl" />}
            change={22.1}
            changeType="increase"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Profit"
            value={`$${stats.profit.toLocaleString()}`}
            icon={<TrendingUp className="text-green-600 text-2xl" />}
            change={18.4}
            changeType="increase"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Loss"
            value={`$${stats.loss.toLocaleString()}`}
            icon={<TrendingDown className="text-red-600 text-2xl" />}
            change={-2.3}
            changeType="decrease"
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
          {/* Charts Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Analytics Overview
              </h2>
              <p className="text-gray-600 mt-1">
                Interactive charts and data visualization
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              {/* Chart Type Filter */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1">
                {chartTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveChart(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeChart === type.id
                        ? "bg-white text-blue-600 shadow-lg"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </motion.button>
                ))}
              </div>

              {/* Time Range Filter */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setTimeRange(range.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      timeRange === range.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCharts.map((chart, index) => (
              <motion.div
                key={chart.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${chart.cols} bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl">{chart.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {chart.title}
                  </h3>
                </div>
                <div className="h-64">
                  {renderChart(chart.key, "", chart.type)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white"
          >
            <div className="text-center">
              <div className="text-2xl font-bold">98.2%</div>
              <div className="text-sm opacity-90">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm opacity-90">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1.2s</div>
              <div className="text-sm opacity-90">Avg. Response</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tables Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
      >
        {/* Recent Activities */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Recent Activities
            </h3>
            <div className="flex items-center gap-2">
              <Search className="text-gray-400" />
              <FilterList className="text-gray-400" />
            </div>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 hover:bg-blue-50 rounded-2xl transition-all duration-300 group"
              >
                <div className="p-3 bg-white rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === "new"
                        ? "bg-green-100 text-green-800"
                        : activity.status === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : activity.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Electronics Stock
            </h3>
            <div className="flex items-center gap-2">
              <Search className="text-gray-400" />
              <FilterList className="text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-300"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.stock}</span>
                        {item.trend === "up" && (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        )}
                        {item.trend === "down" && (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">${item.price}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "in-stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "in-stock" ? "In Stock" : "Low Stock"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
