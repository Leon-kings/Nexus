/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/ReportsAnalytics.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BarChart,
  PieChart,
  ShowChart,
  TrendingUp,
  TrendingDown,
  Download,
  FilterList,
  DateRange,
  Refresh,
  Receipt,
  ShoppingCart,
  People,
  AttachMoney,
  Inventory,
  LocalShipping,
  AccountBalance,
  Category,
  Star,
  Visibility,
  Print,
  Share,
  CalendarToday,
  Today,
  ViewWeek,
  EventNote,
  Event
} from '@mui/icons-material';

export const ReportsAnalytics = () => {
  const [reportsData, setReportsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  // Time range options
  const timeRanges = [
    { value: 'daily', label: 'Daily', icon: <Today /> },
    { value: 'weekly', label: 'Weekly', icon: <ViewWeek /> },
    { value: 'monthly', label: 'Monthly', icon: <CalendarToday /> },
    { value: 'quarterly', label: 'Quarterly', icon: <EventNote /> },
    { value: 'yearly', label: 'Yearly', icon: <Event /> }
  ];

  // Report types
  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: <AttachMoney />, color: 'blue' },
    { value: 'orders', label: 'Orders Report', icon: <ShoppingCart />, color: 'green' },
    { value: 'customers', label: 'Customers Report', icon: <People />, color: 'purple' },
    { value: 'products', label: 'Products Report', icon: <Inventory />, color: 'orange' },
    { value: 'revenue', label: 'Revenue Report', icon: <AccountBalance />, color: 'teal' },
    { value: 'inventory', label: 'Inventory Report', icon: <LocalShipping />, color: 'red' }
  ];

  useEffect(() => {
    // Set default date range
    const today = new Date();
    const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(defaultStartDate.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    loadReportsData();
  }, [timeRange, reportType, startDate, endDate]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockData = generateMockReportsData();
      setReportsData(mockData);
      toast.success('Reports data loaded successfully!');
    } catch (error) {
      console.error('Error loading reports data:', error);
      toast.error('Failed to load reports data. Using demo data.');
      setReportsData(generateMockReportsData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockReportsData = () => {
    const periods = timeRange === 'daily' ? 30 : 
                   timeRange === 'weekly' ? 12 : 
                   timeRange === 'monthly' ? 12 : 
                   timeRange === 'quarterly' ? 8 : 5;

    // Generate time labels based on selected range
    const timeLabels = generateTimeLabels(periods);

    // Base data structure
    const baseData = {
      summary: generateSummaryStats(),
      trends: generateTrendData(periods, timeLabels),
      categories: generateCategoryData(),
      topProducts: generateTopProducts(),
      comparison: generateComparisonData(),
      metrics: generateMetrics(),
      timeRange,
      reportType,
      dateRange: { start: startDate, end: endDate }
    };

    return baseData;
  };

  const generateTimeLabels = (periods) => {
    const today = new Date();
    const labels = [];
    
    for (let i = periods - 1; i >= 0; i--) {
      let label;
      const day = new Date(today);
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      switch (timeRange) {
        case 'daily':
          
          day.setDate(day.getDate() - i);
          label = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case 'weekly':
          label = `Week ${i + 1}`;
          break;
        case 'monthly':
          
          label = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          break;
        case 'quarterly':
          label = `Q${4 - Math.floor(i / 3)}-${today.getFullYear() - Math.floor(i / 4)}`;
          break;
        case 'yearly':
          label = `${today.getFullYear() - i}`;
          break;
        default:
          label = `Period ${i + 1}`;
      }
      labels.push(label);
    }
    
    return labels.reverse();
  };

  const generateSummaryStats = () => {
    const baseValue = reportType === 'sales' ? 50000 :
                     reportType === 'orders' ? 150 :
                     reportType === 'customers' ? 75 :
                     reportType === 'products' ? 45 :
                     reportType === 'revenue' ? 75000 : 120;

    const growth = (Math.random() * 20 - 5).toFixed(1); // -5% to +15%

    return {
      current: baseValue * (1 + Math.random() * 0.5),
      previous: baseValue,
      growth: parseFloat(growth),
      target: baseValue * 1.2
    };
  };

  const generateTrendData = (periods, labels) => {
    return labels.map((label, index) => {
      const baseValue = reportType === 'sales' ? 5000 :
                       reportType === 'orders' ? 15 :
                       reportType === 'customers' ? 8 :
                       reportType === 'products' ? 5 :
                       reportType === 'revenue' ? 7500 : 12;

      const value = baseValue * (0.8 + Math.random() * 0.4); // 80% to 120% of base
      
      return {
        period: label,
        value: Math.round(value),
        growth: (Math.random() * 15 - 5).toFixed(1)
      };
    });
  };

  const generateCategoryData = () => {
    const categories = [
      { name: 'Smartphones', value: 35, color: 'blue' },
      { name: 'Laptops', value: 25, color: 'green' },
      { name: 'Tablets', value: 15, color: 'purple' },
      { name: 'Accessories', value: 12, color: 'orange' },
      { name: 'Wearables', value: 8, color: 'red' },
      { name: 'Gaming', value: 5, color: 'teal' }
    ];
    
    return categories;
  };

  const generateTopProducts = () => {
    return [
      { name: 'iPhone 15 Pro', sales: 1245, revenue: 1245000, growth: 12.5 },
      { name: 'MacBook Pro 16"', sales: 867, revenue: 2080800, growth: 8.3 },
      { name: 'Samsung Galaxy S24', sales: 756, revenue: 641880, growth: 15.2 },
      { name: 'iPad Air', sales: 543, revenue: 325257, growth: 5.7 },
      { name: 'Sony WH-1000XM5', sales: 432, revenue: 172368, growth: 22.1 }
    ];
  };

  const generateComparisonData = () => {
    return {
      currentPeriod: 125000,
      previousPeriod: 108000,
      yoyGrowth: 15.7,
      momGrowth: 8.2
    };
  };

  const generateMetrics = () => {
    return [
      { name: 'Conversion Rate', value: '3.2%', change: 0.4, positive: true },
      { name: 'Average Order Value', value: '$156.80', change: 12.5, positive: true },
      { name: 'Customer Lifetime Value', value: '$1,245', change: 8.3, positive: true },
      { name: 'Cart Abandonment Rate', value: '68.2%', change: -2.1, positive: true },
      { name: 'Return Rate', value: '2.8%', change: 0.3, positive: false },
      { name: 'Customer Satisfaction', value: '4.7/5', change: 0.2, positive: true }
    ];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const handleExport = async (format) => {
    setExportLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Report exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExportLoading(false);
    }
  };

  // Custom Components
  const StatCard = ({ title, value, change, subtitle, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="text-sm mr-1" /> : <TrendingDown className="text-sm mr-1" />}
            <span>{Math.abs(change)}% from previous period</span>
          </div>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-xl`}>
          {React.cloneElement(icon, { className: `text-${color}-600 text-xl` })}
        </div>
      </div>
    </motion.div>
  );

  const ChartContainer = ({ title, children, actions }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      </div>
      {children}
    </motion.div>
  );

  const SimpleBarChart = ({ data, title, valuePrefix = '', valueSuffix = '' }) => (
    <div className="h-80">
      <div className="flex items-end justify-between h-60 space-x-2 mb-4">
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map(d => d.value));
          const height = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-700"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-600 mt-2 text-center leading-tight">
                {item.period}
              </span>
              <span className="text-xs font-semibold text-gray-800 mt-1">
                {valuePrefix}{item.value}{valueSuffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PieChartComponent = ({ data, title }) => (
    <div className="h-80 flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 mb-4">
        {data.map((item, index) => {
          const total = data.reduce((sum, d) => sum + d.value, 0);
          const percentage = (item.value / total) * 100;
          const rotation = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
          
          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: `conic(from ${rotation}deg at 50% 50%, var(--color-${item.color}) 0%, var(--color-${item.color}) ${percentage}%, transparent ${percentage}%)`
              }}
            />
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{data.reduce((sum, d) => sum + d.value, 0)}%</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-3 h-3 bg-${item.color}-500 rounded`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 truncate">{item.name}</div>
              <div className="text-sm text-gray-500">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TopProductsList = ({ products }) => (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{product.name}</p>
              <p className="text-sm text-gray-600">{formatNumber(product.sales)} units sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-600">{formatCurrency(product.revenue)}</p>
            <div className={`flex items-center text-sm ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.growth >= 0 ? <TrendingUp className="text-xs mr-1" /> : <TrendingDown className="text-xs mr-1" />}
              <span>{Math.abs(product.growth)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const MetricsGrid = ({ metrics }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{metric.name}</span>
            <div className={`flex items-center text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change >= 0 ? <TrendingUp className="text-xs mr-1" /> : <TrendingDown className="text-xs mr-1" />}
              <span>{Math.abs(metric.change)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
        </div>
      ))}
    </div>
  );

  const ComparisonCard = ({ data }) => (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm opacity-90">Current Period</p>
          <p className="text-2xl font-bold">{formatCurrency(data.currentPeriod)}</p>
        </div>
        <div>
          <p className="text-sm opacity-90">Previous Period</p>
          <p className="text-2xl font-bold">{formatCurrency(data.previousPeriod)}</p>
        </div>
        <div>
          <p className="text-sm opacity-90">YoY Growth</p>
          <p className="text-xl font-semibold text-green-300">+{data.yoyGrowth}%</p>
        </div>
        <div>
          <p className="text-sm opacity-90">MoM Growth</p>
          <p className="text-xl font-semibold text-green-300">+{data.momGrowth}%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
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
                <BarChart className="text-blue-600 text-2xl md:text-3xl" />
              </div>
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights and analytics for your business performance
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('pdf')}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              <Download />
              Export
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadReportsData}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 font-semibold"
            >
              <Refresh />
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          title="Total Revenue"
          value={formatCurrency(reportsData.summary?.current || 0)}
          change={reportsData.summary?.growth || 0}
          subtitle={`Target: ${formatCurrency(reportsData.summary?.target || 0)}`}
          icon={<AttachMoney />}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(reportsData.summary?.current * 0.003 || 0)}
          change={8.5}
          subtitle="Average order value: $156.80"
          icon={<ShoppingCart />}
          color="green"
        />
        <StatCard
          title="New Customers"
          value={formatNumber(reportsData.summary?.current * 0.0015 || 0)}
          change={12.3}
          subtitle="Customer acquisition"
          icon={<People />}
          color="purple"
        />
        <StatCard
          title="Products Sold"
          value={formatNumber(reportsData.summary?.current * 0.004 || 0)}
          change={5.7}
          subtitle="Inventory turnover"
          icon={<Inventory />}
          color="orange"
        />
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <ChartContainer 
          title={`${reportTypes.find(r => r.value === reportType)?.label} Trend`}
          actions={
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Download />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Visibility />
              </button>
            </div>
          }
        >
          {reportsData.trends && (
            <SimpleBarChart 
              data={reportsData.trends}
              valuePrefix={reportType === 'sales' || reportType === 'revenue' ? '$' : ''}
            />
          )}
        </ChartContainer>

        {/* Category Distribution */}
        <ChartContainer 
          title="Category Distribution"
          actions={
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <FilterList />
            </button>
          }
        >
          {reportsData.categories && (
            <PieChartComponent data={reportsData.categories} />
          )}
        </ChartContainer>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Products */}
        <div className="lg:col-span-2">
          <ChartContainer 
            title="Top Performing Products"
            actions={
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Visibility />
              </button>
            }
          >
            {reportsData.topProducts && (
              <TopProductsList products={reportsData.topProducts} />
            )}
          </ChartContainer>
        </div>

        {/* Performance Comparison */}
        <div>
          <ChartContainer title="Performance Overview">
            {reportsData.comparison && (
              <ComparisonCard data={reportsData.comparison} />
            )}
          </ChartContainer>
        </div>
      </div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <ChartContainer 
          title="Key Performance Metrics"
          actions={
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Refresh />
            </button>
          }
        >
          {reportsData.metrics && (
            <MetricsGrid metrics={reportsData.metrics} />
          )}
        </ChartContainer>
      </motion.div>

      {/* Detailed Reports Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Detailed Reports</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Print className="text-sm" />
              Print
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Download className="text-sm" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Daily Report Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <Today className="text-blue-600 text-2xl" />
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Daily</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Daily Sales Report</h3>
            <p className="text-sm text-gray-600 mb-4">Today's performance overview</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(12580)}
              </span>
              <TrendingUp className="text-green-500" />
            </div>
          </div>

          {/* Weekly Report Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <ViewWeek className="text-green-600 text-2xl" />
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Weekly</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Weekly Summary</h3>
            <p className="text-sm text-gray-600 mb-4">Last 7 days performance</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(85640)}
              </span>
              <TrendingUp className="text-green-500" />
            </div>
          </div>

          {/* Monthly Report Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <CalendarToday className="text-purple-600 text-2xl" />
              <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">Monthly</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Monthly Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Complete monthly breakdown</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(345200)}
              </span>
              <TrendingUp className="text-green-500" />
            </div>
          </div>

          {/* Yearly Report Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <Event className="text-orange-600 text-2xl" />
              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">Yearly</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Annual Report</h3>
            <p className="text-sm text-gray-600 mb-4">Year-over-year analysis</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-600">
                {formatCurrency(4125800)}
              </span>
              <TrendingUp className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Report Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setTimeRange('daily')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Today />
            <span>Generate Daily Report</span>
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ViewWeek />
            <span>Generate Weekly Report</span>
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <CalendarToday />
            <span>Generate Monthly Report</span>
          </button>
        </div>
      </motion.div>

      {/* CSS Variables for Pie Chart */}
      <style jsx>{`
        :root {
          --color-blue: #3B82F6;
          --color-green: #10B981;
          --color-purple: #8B5CF6;
          --color-orange: #F59E0B;
          --color-red: #EF4444;
          --color-teal: #14B8A6;
        }
      `}</style>
    </div>
  );
};