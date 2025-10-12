/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/ProductInventoryManagement.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Add, Clear, Delete, Edit, Inventory, Search, Visibility, Warning } from '@mui/icons-material';

export const ProductInventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    status: 'active',
    sku: '',
    cost: '',
    supplier: '',
    reorderLevel: ''
  });

  // Mock API base URL
  const API_BASE = 'https://jsonplaceholder.typicode.com';

  // Categories for filtering
  const categories = [
    'all',
    'Laptops',
    'Smartphones',
    'Tablets',
    'Accessories',
    'Wearables',
    'Monitors',
    'Components'
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'default' },
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'inactive', label: 'Inactive', color: 'default' },
    { value: 'low-stock', label: 'Low Stock', color: 'warning' },
    { value: 'out-of-stock', label: 'Out of Stock', color: 'error' },
    { value: 'discontinued', label: 'Discontinued', color: 'error' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Simulate API call with axios
      const response = await axios.get(`${API_BASE}/posts?_limit=20`);
      
      // Transform API data to match our product structure
      const productsData = response.data.map((item, index) => ({
        id: item.id,
        name: `Product ${item.id} - ${item.title.split(' ')[0]}`,
        category: categories[(index % (categories.length - 1)) + 1],
        price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
        stock: Math.floor(Math.random() * 200),
        description: item.body,
        image: `https://picsum.photos/200/200?random=${item.id}`,
        status: ['active', 'active', 'active', 'low-stock', 'out-of-stock'][index % 5],
        sku: `SKU-${1000 + item.id}`,
        cost: parseFloat((Math.random() * 800 + 30).toFixed(2)),
        supplier: `Supplier ${(index % 5) + 1}`,
        reorderLevel: 10,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        sales: Math.floor(Math.random() * 500)
      }));

      setProducts(productsData);
      toast.success('Products loaded successfully!');
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products. Using demo data.');
      // Fallback to demo data
      setProducts(generateDemoProducts());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoProducts = () => {
    return Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      category: categories[(index % (categories.length - 1)) + 1],
      price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
      stock: Math.floor(Math.random() * 200),
      description: `Description for product ${index + 1}. This is a detailed description of the product features and specifications.`,
      image: `https://picsum.photos/200/200?random=${index + 1}`,
      status: ['active', 'active', 'active', 'low-stock', 'out-of-stock'][index % 5],
      sku: `SKU-${1000 + index + 1}`,
      cost: parseFloat((Math.random() * 800 + 30).toFixed(2)),
      supplier: `Supplier ${(index % 5) + 1}`,
      reorderLevel: 10,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      sales: Math.floor(Math.random() * 500)
    }));
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'price' || sortField === 'cost') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // CRUD Operations
  const handleCreateProduct = async () => {
    try {
      // Simulate API call
      const newProductData = {
        ...newProduct,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        rating: 0,
        sales: 0,
        image: newProduct.image || 'https://picsum.photos/200/200?random=' + Date.now()
      };

      setProducts(prev => [newProductData, ...prev]);
      setIsCreateModalOpen(false);
      resetNewProductForm();
      toast.success('Product created successfully!');
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setProducts(prev => prev.filter(product => product.id !== productId));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleStatusToggle = (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    handleUpdateProduct(productId, { status: newStatus });
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      status: 'active',
      sku: '',
      cost: '',
      supplier: '',
      reorderLevel: ''
    });
  };

  // Utility functions
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getStockStatus = (stock, reorderLevel) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= reorderLevel) return 'low-stock';
    return 'active';
  };

  const calculateProfitMargin = (price, cost) => {
    return (((price - cost) / price) * 100).toFixed(1);
  };

  // Responsive grid classes
  const getGridClasses = () => {
    return `
      grid 
      grid-cols-1 
      xs:grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 
      2xl:grid-cols-5 
      gap-4 
      md:gap-6
    `;
  };

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  // Custom Chip Component
  const Chip = ({ label, color = 'default', size = 'medium', variant = 'filled' }) => {
    const colorClasses = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      primary: 'bg-blue-100 text-blue-800'
    };

    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1 text-sm'
    };

    const variantClasses = {
      filled: '',
      outlined: 'border bg-transparent'
    };

    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    return (
      <span className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${variantClasses[variant]}`}>
        {label}
      </span>
    );
  };

  // Custom IconButton Component
  const IconButton = ({ children, onClick, className = '', size = 'medium', ...props }) => {
    const sizeClasses = {
      small: 'p-1',
      medium: 'p-2'
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

  // Custom Tooltip Component
  const Tooltip = ({ children, title }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {children}
        </div>
        {showTooltip && (
          <div className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded bottom-full mb-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {title}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  // Custom Switch Component
  const Switch = ({ checked, onChange, color = 'primary' }) => {
    const colorClasses = {
      primary: 'bg-blue-600',
      success: 'bg-green-600'
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          checked ? colorClasses[color] : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  };

  // Product Card Component
  const ProductCard = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <Chip
            label={getStatusLabel(product.status)}
            color={getStatusColor(product.status)}
            size="small"
          />
        </div>
        <div className="absolute top-3 left-3 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-sm">
              {i < Math.floor(product.rating) ? '★' : '☆'}
            </span>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {product.name}
          </h3>
          <Tooltip title="Quick Status Toggle">
            <Switch
              checked={product.status === 'active'}
              onChange={() => handleStatusToggle(product.id, product.status)}
              color="success"
            />
          </Tooltip>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">SKU:</span>
            <span className="font-mono text-gray-800">{product.sku}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Category:</span>
            <Chip label={product.category} size="small" variant="outlined" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Stock:</span>
            <span className={`font-semibold ${
              product.stock === 0 ? 'text-red-600' :
              product.stock <= product.reorderLevel ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {product.stock} units
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Price:</span>
            <span className="font-bold text-blue-600">${product.price}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => setViewProduct(product)}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={() => setEditingProduct(product)}
              className="text-green-600 hover:bg-green-50"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Product">
            <IconButton
              size="small"
              onClick={() => {
                setProductToDelete(product);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:bg-red-50"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );

  // Modal Component
  const Modal = ({ open, onClose, children, maxWidth = 'md' }) => {
    if (!open) return null;

    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl'
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className={`w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl`}>
          {children}
        </div>
      </div>
    );
  };

  // Modal Header Component
  const ModalHeader = ({ children, onClose, gradient = 'from-blue-600 to-blue-700' }) => (
    <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${gradient} text-white rounded-t-2xl`}>
      <div className="text-xl font-bold">{children}</div>
      <IconButton onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20">
        <Clear />
      </IconButton>
    </div>
  );

  // Modal Content Component
  const ModalContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );

  // Modal Actions Component
  const ModalActions = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end space-x-3 p-6 border-t border-gray-200 ${className}`}>
      {children}
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
                <Inventory className="text-blue-600 text-2xl md:text-3xl" />
              </div>
              Product & Inventory Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your products, inventory, and track stock levels
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            <Add />
            Add New Product
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Products', value: products.length, icon: <Inventory />, color: 'blue' },
          { label: 'Low Stock', value: products.filter(p => p.status === 'low-stock').length, icon: <Warning />, color: 'yellow' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'out-of-stock').length, icon: <Warning />, color: 'red' },
          { label: 'Active Products', value: products.filter(p => p.status === 'active').length, icon: <Inventory />, color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                {React.cloneElement(stat.icon, { className: `text-${stat.color}-600 text-xl` })}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="stock-asc">Stock Low-High</option>
              <option value="stock-desc">Stock High-Low</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Products ({filteredAndSortedProducts.length})
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>

        {loading ? (
          <div className={getGridClasses()}>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <Inventory className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className={getGridClasses()}>
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Create Product Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="md"
      >
        <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
          Add New Product
        </ModalHeader>
        <ModalContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Category</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
              <input
                type="number"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter product description"
              />
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProduct}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            disabled={!newProduct.name || !newProduct.category || !newProduct.price}
          >
            Create Product
          </button>
        </ModalActions>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="sm"
      >
        <div className="bg-red-50 text-red-800 p-6 rounded-t-2xl">
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        </div>
        <ModalContent>
          <div className="flex items-center space-x-4">
            <Warning className="text-red-600 text-2xl" />
            <div>
              <p className="font-semibold text-gray-800">
                Are you sure you want to delete "{productToDelete?.name}"?
              </p>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. All product data will be permanently removed.
              </p>
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteProduct(productToDelete?.id)}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-300"
          >
            Delete Product
          </button>
        </ModalActions>
      </Modal>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          maxWidth="md"
        >
          <ModalHeader onClose={() => setEditingProduct(null)} gradient="from-green-600 to-green-700">
            Edit Product
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setEditingProduct(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdateProduct(editingProduct.id, editingProduct)}
              className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300"
            >
              Update Product
            </button>
          </ModalActions>
        </Modal>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <Modal
          open={!!viewProduct}
          onClose={() => setViewProduct(null)}
          maxWidth="lg"
        >
          <ModalHeader onClose={() => setViewProduct(null)} gradient="from-purple-600 to-purple-700">
            Product Details
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div>
                <img
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{viewProduct.name}</h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <Chip
                      label={getStatusLabel(viewProduct.status)}
                      color={getStatusColor(viewProduct.status)}
                    />
                    <Chip
                      label={viewProduct.category}
                      variant="outlined"
                    />
                  </div>
                  <p className="text-gray-600">{viewProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="font-semibold text-gray-800">{viewProduct.sku}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-blue-600">${viewProduct.price}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600">Cost</p>
                    <p className="font-semibold text-gray-800">${viewProduct.cost}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className="font-semibold text-green-600">
                      {calculateProfitMargin(viewProduct.price, viewProduct.cost)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className={`font-semibold ${
                      viewProduct.stock === 0 ? 'text-red-600' :
                      viewProduct.stock <= viewProduct.reorderLevel ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {viewProduct.stock} units
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600">Reorder Level</p>
                    <p className="font-semibold text-gray-800">{viewProduct.reorderLevel} units</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-2">Supplier</p>
                  <p className="font-semibold text-gray-800">{viewProduct.supplier}</p>
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setViewProduct(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                setEditingProduct(viewProduct);
                setViewProduct(null);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors duration-300"
            >
              Edit Product
            </button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};