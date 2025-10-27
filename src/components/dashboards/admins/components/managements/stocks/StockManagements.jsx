/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Material Icons
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  Refresh,
  Inventory,
  TrendingUp,
  Sell,
  Warning,
  CheckCircle,
  Cancel,
  Save,
  Close,
  CloudUpload,
  Image,
  AttachMoney,
  Category,
  Star,
  Description,
  Settings,
  Remove,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

export const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [stats, setStats] = useState(null);
  const [sellModal, setSellModal] = useState({ open: false, product: null, quantity: 1 });
  const [stockModal, setStockModal] = useState({ open: false, product: null, quantity: 10 });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, product: null });
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://nexusbackend-hdyk.onrender.com/products');
      if (response.data.success) {
        setProducts(response.data.data);
        calculateStats(response.data.data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate statistics
  const calculateStats = (productsList) => {
    const totalProducts = productsList.length;
    const totalStock = productsList.reduce((sum, product) => sum + (product.stock || 0), 0);
    const totalValue = productsList.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);
    const outOfStock = productsList.filter(product => !product.inStock).length;
    const lowStock = productsList.filter(product => product.stock > 0 && product.stock <= 10).length;
    const totalSold = productsList.reduce((sum, product) => sum + (product.sold || 0), 0);

    setStats({
      totalProducts,
      totalStock,
      totalValue: totalValue.toFixed(2),
      outOfStock,
      lowStock,
      inStock: totalProducts - outOfStock,
      totalSold
    });
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    const matchesStock = filterStock === 'all' || 
                        (filterStock === 'inStock' && product.inStock) ||
                        (filterStock === 'outOfStock' && !product.inStock) ||
                        (filterStock === 'lowStock' && product.stock > 0 && product.stock <= 10);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  // Delete product with confirmation
  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`https://nexusbackend-hdyk.onrender.com/products/${deleteConfirmModal.product._id}`);
      if (response.data.success) {
        toast.success('Product deleted successfully');
        setDeleteConfirmModal({ open: false, product: null });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Sell product
  const handleSellProduct = async () => {
    try {
      const response = await axios.post(`https://nexusbackend-hdyk.onrender.com/products/${sellModal.product._id}/sell`, {
        quantity: sellModal.quantity
      });
      
      if (response.data.success) {
        toast.success(`Sold ${sellModal.quantity} item(s) of ${sellModal.product.name}`);
        setSellModal({ open: false, product: null, quantity: 1 });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error selling product:', error);
      toast.error(error.response?.data?.error || 'Failed to sell product');
    }
  };

  // Add stock
  const handleAddStock = async () => {
    try {
      const response = await axios.post(`https://nexusbackend-hdyk.onrender.com/products/${stockModal.product._id}/stock`, {
        quantity: stockModal.quantity
      });
      
      if (response.data.success) {
        toast.success(`Added ${stockModal.quantity} item(s) to stock`);
        setStockModal({ open: false, product: null, quantity: 10 });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Failed to add stock');
    }
  };

  // Update product
  const handleUpdateProduct = async (formData) => {
    try {
      const response = await axios.put(`https://nexusbackend-hdyk.onrender.com/products/${editingProduct._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  // Create product
  const handleCreateProduct = async (formData) => {
    try {
      const response = await axios.post('https://nexusbackend-hdyk.onrender.com/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success('Product created successfully');
        setShowCreateForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  // Confirmation Modal Component
  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger", children }) => {
    if (!isOpen) return null;

    const buttonColors = {
      danger: "bg-red-600 hover:bg-red-700",
      warning: "bg-orange-600 hover:bg-orange-700",
      primary: "bg-primary-600 hover:bg-primary-700"
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Warning className={`mr-3 ${type === 'danger' ? 'text-red-600' : type === 'warning' ? 'text-orange-600' : 'text-primary-600'}`} />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{message}</p>
              {children}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonColors[type]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Sell Product Modal
  const SellProductModal = () => {
    if (!sellModal.open) return null;

    return (
      <ConfirmationModal
        isOpen={sellModal.open}
        onClose={() => setSellModal({ open: false, product: null, quantity: 1 })}
        onConfirm={handleSellProduct}
        title="Sell Product"
        message={`How many units of "${sellModal.product?.name}" do you want to sell? Current stock: ${sellModal.product?.stock}`}
        confirmText={`Sell ${sellModal.quantity} Unit(s)`}
        type="primary"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity to Sell
          </label>
          <input
            type="number"
            min="1"
            max={sellModal.product?.stock}
            value={sellModal.quantity}
            onChange={(e) => setSellModal(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </ConfirmationModal>
    );
  };

  // Add Stock Modal
  const AddStockModal = () => {
    if (!stockModal.open) return null;

    return (
      <ConfirmationModal
        isOpen={stockModal.open}
        onClose={() => setStockModal({ open: false, product: null, quantity: 10 })}
        onConfirm={handleAddStock}
        title="Add Stock"
        message={`How many units do you want to add to "${stockModal.product?.name}"? Current stock: ${stockModal.product?.stock}`}
        confirmText={`Add ${stockModal.quantity} Unit(s)`}
        type="primary"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity to Add
          </label>
          <input
            type="number"
            min="1"
            value={stockModal.quantity}
            onChange={(e) => setStockModal(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </ConfirmationModal>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!deleteConfirmModal.open) return null;

    return (
      <ConfirmationModal
        isOpen={deleteConfirmModal.open}
        onClose={() => setDeleteConfirmModal({ open: false, product: null })}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirmModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        type="danger"
      />
    );
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const isExpanded = expandedProduct === product._id;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.isNew && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">${product.price}</p>
              {product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
              )}
              {product.discount > 0 && (
                <p className="text-sm text-green-600">-{product.discount}%</p>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium">Category:</span> {product.category}
            </div>
            <div>
              <span className="font-medium">Stock:</span> {product.stock} units
            </div>
            <div>
              <span className="font-medium">Sold:</span> {product.sold || 0} units
            </div>
            <div className="flex items-center">
              <span className="font-medium">Rating:</span> 
              <Star className="text-yellow-400 ml-1" fontSize="small" />
              <span className="ml-1">{product.rating}</span>
            </div>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-4"
              >
                <p className="text-gray-600 mb-3">{product.description}</p>
                
                {product.features && product.features.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.specifications && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specifications:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setExpandedProduct(isExpanded ? null : product._id)}
              className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
              {isExpanded ? 'Less' : 'More'} Details
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => setSellModal({ open: true, product, quantity: 1 })}
                disabled={!product.inStock}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sell Product"
              >
                <Sell />
              </button>
              <button
                onClick={() => setStockModal({ open: true, product, quantity: 10 })}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Add Stock"
              >
                <Inventory />
              </button>
              <button
                onClick={() => setEditingProduct(product)}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                title="Edit Product"
              >
                <Edit />
              </button>
              <button
                onClick={() => setDeleteConfirmModal({ open: true, product })}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Product"
              >
                <Delete />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Statistics Component
  const Statistics = () => {
    if (!stats) return null;

    const statCards = [
      {
        title: 'Total Products',
        value: stats.totalProducts,
        icon: <Inventory className="text-blue-600" />,
        color: 'bg-blue-50 border-blue-200'
      },
      {
        title: 'Total Stock',
        value: stats.totalStock,
        icon: <TrendingUp className="text-green-600" />,
        color: 'bg-green-50 border-green-200'
      },
      {
        title: 'In Stock',
        value: stats.inStock,
        icon: <CheckCircle className="text-green-600" />,
        color: 'bg-green-50 border-green-200'
      },
      {
        title: 'Out of Stock',
        value: stats.outOfStock,
        icon: <Cancel className="text-red-600" />,
        color: 'bg-red-50 border-red-200'
      },
      {
        title: 'Low Stock',
        value: stats.lowStock,
        icon: <Warning className="text-orange-600" />,
        color: 'bg-orange-50 border-orange-200'
      },
      {
        title: 'Total Sold',
        value: stats.totalSold,
        icon: <Sell className="text-purple-600" />,
        color: 'bg-purple-50 border-purple-200'
      }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border-2 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Create/Edit Product Form Component
  const ProductForm = ({ product, onSave, onCancel, mode = 'create' }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      brand: product?.brand || '',
      price: product?.price || '',
      originalPrice: product?.originalPrice || '',
      discount: product?.discount || '',
      category: product?.category || '',
      description: product?.description || '',
      stock: product?.stock || 0,
      rating: product?.rating || 0,
      isNew: product?.isNew || false,
      inStock: product?.inStock !== undefined ? product.inStock : true,
      features: product?.features || [],
      specifications: product?.specifications || {
        size: '',
        resolution: '',
        technology: '',
        features: ''
      }
    });

    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [currentFeature, setCurrentFeature] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSpecChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [name]: value
        }
      }));
    };

    const handleMainImage = (file) => {
      if (file && file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        setMainImage(file);
      }
    };

    const handleAdditionalImages = (files) => {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
      );
      
      if (imageFiles.length !== files.length) {
        toast.error('Some files were skipped - only images under 5MB are allowed');
      }
      
      setAdditionalImages(prev => [...prev, ...imageFiles]);
    };

    const removeAdditionalImage = (index) => {
      setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e, type) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      const files = e.dataTransfer.files;
      if (type === 'main' && files[0]) {
        handleMainImage(files[0]);
      } else if (type === 'additional') {
        handleAdditionalImages(files);
      }
    };

    const addFeature = () => {
      if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, currentFeature.trim()]
        }));
        setCurrentFeature('');
      }
    };

    const removeFeature = (index) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'features' || key === 'specifications') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      if (mainImage) {
        submitData.append('image', mainImage);
      }
      
      additionalImages.forEach(image => {
        submitData.append('images', image);
      });

      await onSave(submitData);
      setLoading(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Add className="text-white" />
                <h2 className="text-xl font-bold text-white">
                  {mode === 'create' ? 'Create New Product' : 'Edit Product'}
                </h2>
              </div>
              <button
                onClick={onCancel}
                className="p-2 text-white hover:bg-primary-500 rounded-lg transition-colors"
              >
                <Close />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Inventory className="mr-2 text-primary-600" size={18} />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="Philips OLED+908"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Category className="mr-2 text-primary-600" size={18} />
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="Philips"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Category className="mr-2 text-primary-600" size={18} />
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="tvs"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AttachMoney className="mr-2 text-primary-600" size={18} />
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="1999"
                  step="0.01"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AttachMoney className="mr-2 text-primary-600" size={18} />
                  Original Price ($)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="2299"
                  step="0.01"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AttachMoney className="mr-2 text-primary-600" size={18} />
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="13"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Stock & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Inventory className="mr-2 text-primary-600" size={18} />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="50"
                  min="0"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Star className="mr-2 text-primary-600" size={18} />
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="4.6"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Description className="mr-2 text-primary-600" size={18} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="OLED TV with MLA technology and 7th Gen P5 processor."
              />
            </div>

            {/* Features */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Settings className="mr-2 text-primary-600" size={18} />
                Features
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add a feature (e.g., MLA OLED)"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Add />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 hover:text-primary-600"
                    >
                      <Remove fontSize="small" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Settings className="mr-2 text-primary-600" size={18} />
                Specifications
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="size"
                  value={formData.specifications.size}
                  onChange={handleSpecChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Size (e.g., 65-inch)"
                />
                <input
                  type="text"
                  name="resolution"
                  value={formData.specifications.resolution}
                  onChange={handleSpecChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Resolution (e.g., 4K UHD)"
                />
                <input
                  type="text"
                  name="technology"
                  value={formData.specifications.technology}
                  onChange={handleSpecChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Technology (e.g., MLA OLED)"
                />
                <input
                  type="text"
                  name="features"
                  value={formData.specifications.features}
                  onChange={handleSpecChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Special features"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Image className="mr-2 text-primary-600" size={18} />
                  Main Image *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'main')}
                >
                  {mainImage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative inline-block"
                    >
                      <img
                        src={URL.createObjectURL(mainImage)}
                        alt="Main preview"
                        className="h-32 w-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setMainImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <CloudUpload className="mx-auto text-gray-400" fontSize="large" />
                      <div className="flex text-sm text-gray-600 justify-center items-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 flex items-center">
                          <CloudUpload className="mr-1" fontSize="small" />
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => handleMainImage(e.target.files[0])}
                          />
                        </label>
                        <p className="pl-2">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Image className="mr-2 text-primary-600" size={18} />
                  Additional Images
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'additional')}
                >
                  <div className="text-center mb-4">
                    <CloudUpload className="mx-auto text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center items-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 flex items-center">
                        <CloudUpload className="mr-1" fontSize="small" />
                        <span>Upload files</span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleAdditionalImages(e.target.files)}
                        />
                      </label>
                      <p className="pl-2">or drag and drop</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {additionalImages.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Additional ${index + 1}`}
                          className="h-20 w-full object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Delete fontSize="small" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Mark as New Product</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2" />
                    {mode === 'create' ? 'Create Product' : 'Update Product'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <Close className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
            <p className="text-gray-600">Manage your inventory and products</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-4 lg:mt-0"
          >
            <Add className="mr-2" />
            Add New Product
          </button>
        </div>

        {/* Statistics */}
        <Statistics />

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
              <option value="lowStock">Low Stock</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchProducts}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Refresh className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Inventory className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateForm && (
          <ProductForm
            onSave={handleCreateProduct}
            onCancel={() => setShowCreateForm(false)}
            mode="create"
          />
        )}

        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSave={handleUpdateProduct}
            onCancel={() => setEditingProduct(null)}
            mode="edit"
          />
        )}
      </AnimatePresence>

      {/* Confirmation Modals */}
      <SellProductModal />
      <AddStockModal />
      <DeleteConfirmationModal />
    </div>
  );
};