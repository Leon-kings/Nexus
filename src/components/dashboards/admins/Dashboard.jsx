/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  // Material-UI Icons
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
  Inventory,
  Message,
  CalendarToday,
  BarChart,
  PieChart,
  ShowChart,
  CreditCard,
  Smartphone,
  Laptop,
  Headset,
  Watch,
  LocalShipping,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';

// API Service Functions (Mock implementation)
const dashboardAPI = {
  // Fetch overview statistics
  getOverview: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRevenue: 125430,
          totalOrders: 1247,
          totalCustomers: 8456,
          totalProducts: 156,
          revenueGrowth: 12.5,
          orderGrowth: 8.3,
          customerGrowth: 15.2,
          productGrowth: 5.7
        });
      }, 500);
    });
  },

  // Fetch sales data
  getSalesData: async (timeRange) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const monthlyData = [
          { month: 'Jan', revenue: 45000, orders: 234 },
          { month: 'Feb', revenue: 52000, orders: 287 },
          { month: 'Mar', revenue: 48000, orders: 256 },
          { month: 'Apr', revenue: 61000, orders: 312 },
          { month: 'May', revenue: 55000, orders: 298 },
          { month: 'Jun', revenue: 68000, orders: 345 },
          { month: 'Jul', revenue: 72000, orders: 378 },
          { month: 'Aug', revenue: 69000, orders: 356 },
          { month: 'Sep', revenue: 75000, orders: 389 },
          { month: 'Oct', revenue: 82000, orders: 412 },
          { month: 'Nov', revenue: 78000, orders: 398 },
          { month: 'Dec', revenue: 95000, orders: 456 }
        ];

        const dailyData = [
          { day: 'Mon', revenue: 12000, orders: 65 },
          { day: 'Tue', revenue: 15000, orders: 78 },
          { day: 'Wed', revenue: 14000, orders: 72 },
          { day: 'Thu', revenue: 16000, orders: 82 },
          { day: 'Fri', revenue: 18000, orders: 94 },
          { day: 'Sat', revenue: 22000, orders: 115 },
          { day: 'Sun', revenue: 19000, orders: 98 }
        ];

        resolve({
          monthly: monthlyData,
          daily: dailyData,
          currentRange: timeRange
        });
      }, 300);
    });
  },

  // Fetch user statistics
  getUserStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          newUsers: 234,
          activeUsers: 1845,
          returningUsers: 567,
          userGrowth: 15.2,
          demographics: [
            { age: '18-24', count: 1245, percentage: 25 },
            { age: '25-34', count: 2345, percentage: 47 },
            { age: '35-44', count: 987, percentage: 20 },
            { age: '45+', count: 456, percentage: 8 }
          ]
        });
      }, 400);
    });
  },

  // Fetch product statistics
  getProductStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          byCategory: [
            { category: 'Smartphones', count: 45, revenue: 45000, icon: <Smartphone /> },
            { category: 'Laptops', count: 32, revenue: 52000, icon: <Laptop /> },
            { category: 'Audio', count: 28, revenue: 18000, icon: <Headset /> },
            { category: 'Wearables', count: 25, revenue: 12000, icon: <Watch /> },
            { category: 'TVs', count: 15, revenue: 35000, icon: <BarChart /> },
            { category: 'Accessories', count: 11, revenue: 8000, icon: <Inventory /> }
          ],
          stockLevels: [
            { product: 'iPhone 15 Pro', stock: 45, lowStock: 10, category: 'Smartphones' },
            { product: 'MacBook Pro', stock: 23, lowStock: 5, category: 'Laptops' },
            { product: 'Sony Headphones', stock: 67, lowStock: 15, category: 'Audio' },
            { product: 'Samsung Watch', stock: 34, lowStock: 8, category: 'Wearables' },
            { product: 'iPad Air', stock: 56, lowStock: 12, category: 'Tablets' },
            { product: 'Gaming Console', stock: 12, lowStock: 3, category: 'Gaming' }
          ]
        });
      }, 400);
    });
  },

  // Fetch financial data
  getFinancials: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          balances: {
            current: 125430,
            pending: 23450,
            expenses: 78450,
            profit: 46980
          },
          paymentMethods: [
            { method: 'Credit Card', percentage: 45, count: 561, icon: <CreditCard /> },
            { method: 'Mobile Money', percentage: 35, count: 436, icon: <Smartphone /> },
            { method: 'Bank Transfer', percentage: 15, count: 187, icon: <AttachMoney /> },
            { method: 'Cash on Delivery', percentage: 5, count: 63, icon: <LocalShipping /> }
          ]
        });
      }, 350);
    });
  },

  // Fetch messages data
  getMessages: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total: 156,
          unread: 23,
          responded: 133,
          responseRate: 85.3,
          byType: [
            { type: 'Support', count: 89, icon: <Headset /> },
            { type: 'Sales', count: 45, icon: <ShoppingCart /> },
            { type: 'Technical', count: 22, icon: <Laptop /> }
          ]
        });
      }, 300);
    });
  },

  // Fetch bookings data
  getBookings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total: 1247,
          pending: 45,
          confirmed: 1156,
          delivered: 1045,
          cancelled: 46,
          deliveryRate: 83.8
        });
      }, 350);
    });
  }
};

// Data Models
class DashboardData {
  constructor() {
    this.overview = null;
    this.salesData = null;
    this.userStats = null;
    this.productStats = null;
    this.financials = null;
    this.messages = null;
    this.bookings = null;
    this.loading = true;
    this.error = null;
  }

  async loadAllData(timeRange = 'monthly') {
    try {
      this.loading = true;
      
      // Fetch all data in parallel
      const [
        overview,
        salesData,
        userStats,
        productStats,
        financials,
        messages,
        bookings
      ] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getSalesData(timeRange),
        dashboardAPI.getUserStats(),
        dashboardAPI.getProductStats(),
        dashboardAPI.getFinancials(),
        dashboardAPI.getMessages(),
        dashboardAPI.getBookings()
      ]);

      // Assign data to model
      this.overview = overview;
      this.salesData = salesData;
      this.userStats = userStats;
      this.productStats = productStats;
      this.financials = financials;
      this.messages = messages;
      this.bookings = bookings;
      this.loading = false;
      this.error = null;

      return this;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }
}

// Stat Card Component
const StatCard = ({ title, value, growth, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </p>
        <div className={`flex items-center mt-2 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`w-4 h-4 mr-1 ${growth < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">{Math.abs(growth)}%</span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color} ml-4`}>
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
    </div>
  </motion.div>
);


// Pie Chart Component
const PieChartComponent = ({ data, title }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <PieChart className="w-5 h-5 mr-2 text-green-600" />
      {title}
    </h3>
    <div className="space-y-3">
      {data.map((item, index) => {
        const colors = [
          'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
          'bg-red-500', 'bg-purple-500', 'bg-indigo-500'
        ];
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
              <span className="text-sm font-medium text-gray-600">
                {item.category || item.method || item.type}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {item.icon && React.cloneElement(item.icon, { 
                className: "w-4 h-4 text-gray-400" 
              })}
              <span className="text-sm font-semibold text-gray-900">
                {item.percentage || item.count}
              </span>
              <span className="text-sm text-gray-500">
                {item.percentage ? `${item.percentage}%` : `${item.count}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Progress Chart Component
const ProgressChart = ({ data, title }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <ShowChart className="w-5 h-5 mr-2 text-orange-600" />
      {title}
    </h3>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">{item.product}</span>
            <span className={`text-sm font-semibold ${
              item.stock <= item.lowStock ? 'text-red-600' : 'text-green-600'
            }`}>
              {item.stock} in stock
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                item.stock <= item.lowStock ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ 
                width: `${(item.stock / (item.stock + item.lowStock * 2)) * 100}%` 
              }}
            ></div>
          </div>
          {item.stock <= item.lowStock && (
            <div className="flex items-center mt-1">
              <Warning className="w-3 h-3 text-red-500 mr-1" />
              <p className="text-xs text-red-600">Low stock alert</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon, color, status }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-1">
          {status === 'good' && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
          {status === 'warning' && <Warning className="w-4 h-4 text-yellow-500 mr-1" />}
          {status === 'error' && <Error className="w-4 h-4 text-red-500 mr-1" />}
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color} ml-4`}>
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
    </div>
  </motion.div>
);

// Dashboard Component
export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [dashboardData, setDashboardData] = useState(new DashboardData());
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load data from API
  const loadDashboardData = async (range = timeRange) => {
    try {
      const dataModel = new DashboardData();
      const loadedData = await dataModel.loadAllData(range);
      setDashboardData(loadedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    loadDashboardData();
    
    // Set up periodic refresh (every 5 minutes)
    const interval = setInterval(() => {
      loadDashboardData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Handle time range change
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    loadDashboardData(newRange);
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Error className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{dashboardData.error}</p>
          <button
            onClick={() => loadDashboardData()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 xsm:p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xsm:flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl xsm:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Electronics Store Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm xsm:text-sm sm:text-base">
              Real-time analytics and performance metrics
              {lastUpdated && (
                <span className="text-gray-400 ml-2">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 xsm:mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily View</option>
              <option value="monthly">Monthly View</option>
              <option value="yearly">Yearly View</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      {dashboardData.overview && (
        <div className="grid grid-cols-1 xsm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={dashboardData.overview.totalRevenue}
            growth={dashboardData.overview.revenueGrowth}
            icon={<AttachMoney />}
            color="bg-gradient-to-br from-green-500 to-green-600"
            delay={0.1}
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.overview.totalOrders}
            growth={dashboardData.overview.orderGrowth}
            icon={<ShoppingCart />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0.2}
          />
          <StatCard
            title="Total Customers"
            value={dashboardData.overview.totalCustomers}
            growth={dashboardData.overview.customerGrowth}
            icon={<People />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={0.3}
          />
          <StatCard
            title="Total Products"
            value={dashboardData.overview.totalProducts}
            growth={dashboardData.overview.productGrowth}
            icon={<Inventory />}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            delay={0.4}
          />
        </div>
      )}

      {/* Charts Grid 1 */}
      {dashboardData.salesData && dashboardData.productStats && (
        <div className="grid grid-cols-1 xsm:grid-cols-1 lg:grid-cols-2 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          {/* Sales Chart */}
          <BarChart
            data={timeRange === 'monthly' ? dashboardData.salesData.monthly : dashboardData.salesData.daily}
            title={timeRange === 'monthly' ? 'Monthly Revenue Trend' : 'Daily Revenue Trend'}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />

          {/* Product Categories */}
          <PieChartComponent
            data={dashboardData.productStats.byCategory}
            title="Revenue by Product Category"
          />
        </div>
      )}

      {/* Metrics Grid */}
      {dashboardData.financials && dashboardData.bookings && dashboardData.messages && (
        <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          <MetricCard
            title="Current Balance"
            value={`$${dashboardData.financials.balances.current.toLocaleString()}`}
            subtitle="Available funds"
            icon={<CreditCard />}
            color="bg-gradient-to-br from-green-500 to-green-600"
            status="good"
          />
          <MetricCard
            title="Pending Orders"
            value={dashboardData.bookings.pending.toString()}
            subtitle="Awaiting processing"
            icon={<CalendarToday />}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            status="warning"
          />
          <MetricCard
            title="Unread Messages"
            value={dashboardData.messages.unread.toString()}
            subtitle="Require attention"
            icon={<Message />}
            color="bg-gradient-to-br from-red-500 to-red-600"
            status="error"
          />
          <MetricCard
            title="Delivery Rate"
            value={`${dashboardData.bookings.deliveryRate}%`}
            subtitle="Successful deliveries"
            icon={<LocalShipping />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            status="good"
          />
        </div>
      )}

      {/* Charts Grid 2 */}
      {dashboardData.productStats && dashboardData.financials && (
        <div className="grid grid-cols-1 xsm:grid-cols-1 lg:grid-cols-2 gap-4 xsm:gap-3 sm:gap-4 md:gap-6 mb-8">
          {/* Stock Levels */}
          <ProgressChart
            data={dashboardData.productStats.stockLevels}
            title="Product Stock Levels & Alerts"
          />

          {/* Payment Methods */}
          <PieChartComponent
            data={dashboardData.financials.paymentMethods}
            title="Payment Methods Distribution"
          />
        </div>
      )}

      {/* Additional Metrics */}
      {dashboardData.financials && dashboardData.messages && dashboardData.bookings && (
        <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 xsm:gap-3 sm:gap-4 md:gap-6">
          <MetricCard
            title="Monthly Profit"
            value={`$${dashboardData.financials.balances.profit.toLocaleString()}`}
            subtitle="Net profit"
            icon={<TrendingUp />}
            color="bg-gradient-to-br from-green-500 to-green-600"
            status="good"
          />
          <MetricCard
            title="Monthly Expenses"
            value={`$${dashboardData.financials.balances.expenses.toLocaleString()}`}
            subtitle="Operational costs"
            icon={<BarChart />}
            color="bg-gradient-to-br from-red-500 to-red-600"
            status="warning"
          />
          <MetricCard
            title="Response Rate"
            value={`${dashboardData.messages.responseRate}%`}
            subtitle="Customer messages"
            icon={<Message />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            status="good"
          />
          <MetricCard
            title="Confirmed Orders"
            value={dashboardData.bookings.confirmed.toString()}
            subtitle="Ready for delivery"
            icon={<Inventory />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            status="good"
          />
        </div>
      )}

      {/* User Demographics */}
      {dashboardData.userStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <People className="w-5 h-5 mr-2 text-purple-600" />
            Customer Demographics
          </h3>
          <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-4 gap-4">
            {dashboardData.userStats.demographics.map((demo, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{demo.percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">{demo.age}</div>
                <div className="text-xs text-gray-500 mt-1">{demo.count.toLocaleString()} users</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

