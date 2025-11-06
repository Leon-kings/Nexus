// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// // src/components/ElectronicOrdersManagement.js
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//   Add,
//   Clear,
//   Delete,
//   Edit,
//   Inventory,
//   Search,
//   Visibility,
//   Warning,
//   LocalShipping,
//   Payment,
//   CheckCircle,
//   Cancel,
//   Schedule,
//   Person,
//   Phone,
//   Email,
//   LocationOn,
//   Receipt,
//   TrackChanges,
//   Assignment,
//   Star,
//   StarBorder
// } from '@mui/icons-material';

// export const ElectronicOrdersManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [productsLoading, setProductsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterPayment, setFilterPayment] = useState('all');
//   const [sortField, setSortField] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [editingOrder, setEditingOrder] = useState(null);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [orderToDelete, setOrderToDelete] = useState(null);
//   const [viewOrder, setViewOrder] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);

//   // New order form state
//   const [newOrder, setNewOrder] = useState({
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     shippingAddress: '',
//     products: [],
//     totalAmount: '',
//     paymentStatus: 'pending',
//     orderStatus: 'pending',
//     shippingMethod: 'standard',
//     trackingNumber: '',
//     notes: ''
//   });

//   // API base URLs
//   const ORDERS_API = 'https://nexusbackend-hdyk.onrender.com/orders';
//   const PRODUCTS_API = 'https://nexusbackend-hdyk.onrender.com/products';

//   // Status options
//   const statusOptions = [
//     { value: 'all', label: 'All Status', color: 'default' },
//     { value: 'pending', label: 'Pending', color: 'warning' },
//     { value: 'confirmed', label: 'Confirmed', color: 'info' },
//     { value: 'processing', label: 'Processing', color: 'primary' },
//     { value: 'shipped', label: 'Shipped', color: 'success' },
//     { value: 'delivered', label: 'Delivered', color: 'success' },
//     { value: 'cancelled', label: 'Cancelled', color: 'error' },
//     { value: 'refunded', label: 'Refunded', color: 'error' }
//   ];

//   // Payment status options
//   const paymentOptions = [
//     { value: 'all', label: 'All Payments', color: 'default' },
//     { value: 'pending', label: 'Pending', color: 'warning' },
//     { value: 'paid', label: 'Paid', color: 'success' },
//     { value: 'failed', label: 'Failed', color: 'error' },
//     { value: 'refunded', label: 'Refunded', color: 'error' },
//     { value: 'partially_paid', label: 'Partially Paid', color: 'warning' }
//   ];

//   // Shipping methods
//   const shippingMethods = [
//     { value: 'standard', label: 'Standard Shipping', cost: 9.99, days: '5-7' },
//     { value: 'express', label: 'Express Shipping', cost: 19.99, days: '2-3' },
//     { value: 'overnight', label: 'Overnight Shipping', cost: 39.99, days: '1' },
//     { value: 'free', label: 'Free Shipping', cost: 0, days: '7-10' }
//   ];

//   useEffect(() => {
//     loadOrders();
//     loadProducts();
//   }, []);

//   const loadOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(ORDERS_API);
      
//       // Handle different response formats
//       let ordersData = [];
      
//       if (Array.isArray(response.data)) {
//         ordersData = response.data;
//       } else if (response.data && Array.isArray(response.data.orders)) {
//         ordersData = response.data.orders;
//       } else if (response.data && Array.isArray(response.data.data)) {
//         ordersData = response.data.data;
//       } else {
//         console.warn('Unexpected API response format:', response.data);
//         toast.error('Unexpected data format from orders API');
//         setOrders([]);
//         return;
//       }

//       // Transform API data to match our expected structure
//       const transformedOrders = ordersData.map((order, index) => {
//         // Ensure products array exists and has proper structure
//         const products = order.products && Array.isArray(order.products) 
//           ? order.products.map(product => ({
//               id: product.id || product._id || Math.random(),
//               name: product.name || 'Unknown Product',
//               category: product.category || 'Electronics',
//               price: product.price || 0,
//               sku: product.sku || `SKU-${Math.random().toString(36).substr(2, 9)}`,
//               quantity: product.quantity || 1,
//               total: (product.price || 0) * (product.quantity || 1)
//             }))
//           : [];

//         // Calculate totals if not provided
//         const subtotal = order.subtotal || products.reduce((sum, product) => sum + product.total, 0);
//         const shippingCost = order.shippingCost || shippingMethods.find(m => m.value === (order.shippingMethod || 'standard'))?.cost || 0;
//         const tax = order.tax || subtotal * 0.08;
//         const totalAmount = order.totalAmount || subtotal + shippingCost + tax;

//         return {
//           id: order.id || order._id,
//           orderNumber: order.orderNumber || `ORD-${1000 + index}`,
//           customerName: order.customerName || '',
//           customerEmail: order.customerEmail || '',
//           customerPhone: order.customerPhone || '',
//           shippingAddress: order.shippingAddress || '',
//           products,
//           subtotal,
//           shippingCost,
//           tax,
//           totalAmount,
//           paymentStatus: order.paymentStatus || 'pending',
//           orderStatus: order.orderStatus || 'pending',
//           shippingMethod: order.shippingMethod || 'standard',
//           trackingNumber: order.trackingNumber || '',
//           notes: order.notes || '',
//           createdAt: order.createdAt || new Date().toISOString(),
//           updatedAt: order.updatedAt || new Date().toISOString(),
//           estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
//         };
//       });

//       setOrders(transformedOrders);
//       toast.success('Orders loaded successfully!');
//     } catch (error) {
//       console.error('Error loading orders:', error);
//       toast.error('Failed to load orders from API.');
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadProducts = async () => {
//     setProductsLoading(true);
//     try {
//       const response = await axios.get(PRODUCTS_API);
      
//       // Handle different response formats
//       let productsData = [];
      
//       if (Array.isArray(response.data)) {
//         productsData = response.data;
//       } else if (response.data && Array.isArray(response.data.products)) {
//         productsData = response.data.products;
//       } else if (response.data && Array.isArray(response.data.data)) {
//         productsData = response.data.data;
//       } else {
//         console.warn('Unexpected API response format:', response.data);
//         toast.error('Unexpected data format from products API');
//         setProducts([]);
//         return;
//       }

//       // Transform products to match your schema structure
//       const transformedProducts = productsData.map(product => ({
//         id: product.id || product._id,
//         name: product.name || 'Unknown Product',
//         description: product.description || '',
//         sku: product.sku || '',
//         category: product.category || 'electronics',
//         price: product.price || 0,
//         comparePrice: product.comparePrice || null,
//         cost: product.cost || null,
//         stock: product.stock || 0,
//         lowStockAlert: product.lowStockAlert || 10,
//         images: product.images || [],
//         variants: product.variants || [],
//         tags: product.tags || [],
//         isActive: product.isActive !== undefined ? product.isActive : true,
//         isDigital: product.isDigital !== undefined ? product.isDigital : false,
//         weight: product.weight || null,
//         dimensions: product.dimensions || {},
//         seo: product.seo || {},
//         metadata: product.metadata || {},
//         createdAt: product.createdAt,
//         updatedAt: product.updatedAt
//       }));

//       setProducts(transformedProducts);
//     } catch (error) {
//       console.error('Error loading products:', error);
//       toast.error('Failed to load products from API.');
//       setProducts([]);
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   // Filter and sort orders
//   const filteredAndSortedOrders = orders
//     .filter(order => {
//       const matchesSearch = 
//         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
//       const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
      
//       return matchesSearch && matchesStatus && matchesPayment;
//     })
//     .sort((a, b) => {
//       let aValue = a[sortField];
//       let bValue = b[sortField];
      
//       if (sortField === 'totalAmount' || sortField === 'subtotal') {
//         aValue = parseFloat(aValue);
//         bValue = parseFloat(bValue);
//       }
      
//       if (sortDirection === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//   // CRUD Operations
//   const handleCreateOrder = async () => {
//     try {
//       // Calculate order details
//       const selectedShipping = shippingMethods.find(m => m.value === newOrder.shippingMethod);
//       const subtotal = newOrder.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
//       const tax = subtotal * 0.08;
//       const totalAmount = subtotal + (selectedShipping?.cost || 0) + tax;

//       const orderData = {
//         customerName: newOrder.customerName,
//         customerEmail: newOrder.customerEmail,
//         customerPhone: newOrder.customerPhone,
//         shippingAddress: newOrder.shippingAddress,
//         products: newOrder.products.map(product => ({
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           quantity: product.quantity,
//           sku: product.sku
//         })),
//         subtotal,
//         shippingCost: selectedShipping?.cost || 0,
//         tax,
//         totalAmount,
//         paymentStatus: newOrder.paymentStatus,
//         orderStatus: newOrder.orderStatus,
//         shippingMethod: newOrder.shippingMethod,
//         trackingNumber: newOrder.trackingNumber,
//         notes: newOrder.notes
//       };

//       const response = await axios.post(ORDERS_API, orderData);
      
//       // Add the new order to state with the ID from response
//       const createdOrder = {
//         ...orderData,
//         id: response.data.id || response.data._id,
//         orderNumber: response.data.orderNumber || `ORD-${1000 + Date.now()}`,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
//       };

//       setOrders(prev => [createdOrder, ...prev]);
//       setIsCreateModalOpen(false);
//       resetNewOrderForm();
//       toast.success('Order created successfully!');
//     } catch (error) {
//       console.error('Error creating order:', error);
//       toast.error('Failed to create order');
//     }
//   };

//   const handleUpdateOrder = async (orderId, updates) => {
//     try {
//       // Send PUT request to update the order
//       await axios.put(`${ORDERS_API}/${orderId}`, updates);
      
//       // Update local state
//       setOrders(prev => 
//         prev.map(order => 
//           order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
//         )
//       );
//       setEditingOrder(null);
//       toast.success('Order updated successfully!');
//     } catch (error) {
//       console.error('Error updating order:', error);
//       toast.error('Failed to update order');
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     try {
//       // Send DELETE request
//       await axios.delete(`${ORDERS_API}/${orderId}`);
      
//       // Update local state
//       setOrders(prev => prev.filter(order => order.id !== orderId));
//       setIsDeleteModalOpen(false);
//       setOrderToDelete(null);
//       toast.success('Order deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       toast.error('Failed to delete order');
//     }
//   };

//   const updateOrderStatus = (orderId, newStatus) => {
//     handleUpdateOrder(orderId, { orderStatus: newStatus });
//   };

//   const updatePaymentStatus = (orderId, newPaymentStatus) => {
//     handleUpdateOrder(orderId, { paymentStatus: newPaymentStatus });
//   };

//   const resetNewOrderForm = () => {
//     setNewOrder({
//       customerName: '',
//       customerEmail: '',
//       customerPhone: '',
//       shippingAddress: '',
//       products: [],
//       totalAmount: '',
//       paymentStatus: 'pending',
//       orderStatus: 'pending',
//       shippingMethod: 'standard',
//       trackingNumber: '',
//       notes: ''
//     });
//   };

//   // Add product to new order
//   const addProductToOrder = (product) => {
//     const existingProduct = newOrder.products.find(p => p.id === product.id);
//     if (existingProduct) {
//       // Increase quantity if product already exists
//       setNewOrder(prev => ({
//         ...prev,
//         products: prev.products.map(p =>
//           p.id === product.id ? { ...p, quantity: p.quantity + 1, total: p.price * (p.quantity + 1) } : p
//         )
//       }));
//     } else {
//       // Add new product with complete structure
//       setNewOrder(prev => ({
//         ...prev,
//         products: [...prev.products, { 
//           id: product.id,
//           name: product.name,
//           description: product.description,
//           category: product.category,
//           price: product.price,
//           sku: product.sku,
//           stock: product.stock,
//           quantity: 1, 
//           total: product.price,
//           images: product.images || []
//         }]
//       }));
//     }
//   };

//   // Remove product from new order
//   const removeProductFromOrder = (productId) => {
//     setNewOrder(prev => ({
//       ...prev,
//       products: prev.products.filter(p => p.id !== productId)
//     }));
//   };

//   // Update product quantity in new order
//   const updateProductQuantity = (productId, quantity) => {
//     if (quantity < 1) {
//       removeProductFromOrder(productId);
//       return;
//     }
    
//     setNewOrder(prev => ({
//       ...prev,
//       products: prev.products.map(p =>
//         p.id === productId ? { ...p, quantity, total: p.price * quantity } : p
//       )
//     }));
//   };

//   // Utility functions
//   const getStatusColor = (status) => {
//     const statusOption = statusOptions.find(opt => opt.value === status);
//     return statusOption ? statusOption.color : 'default';
//   };

//   const getStatusLabel = (status) => {
//     const statusOption = statusOptions.find(opt => opt.value === status);
//     return statusOption ? statusOption.label : status;
//   };

//   const getPaymentColor = (paymentStatus) => {
//     const paymentOption = paymentOptions.find(opt => opt.value === paymentStatus);
//     return paymentOption ? paymentOption.color : 'default';
//   };

//   const getPaymentLabel = (paymentStatus) => {
//     const paymentOption = paymentOptions.find(opt => opt.value === paymentStatus);
//     return paymentOption ? paymentOption.label : paymentStatus;
//   };

//   const getShippingMethodLabel = (method) => {
//     const shippingMethod = shippingMethods.find(m => m.value === method);
//     return shippingMethod ? shippingMethod.label : method;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   // Get primary image URL
//   const getProductImage = (product) => {
//     if (product.images && product.images.length > 0) {
//       const primaryImage = product.images.find(img => img.isPrimary);
//       return primaryImage ? primaryImage.url : product.images[0].url;
//     }
//     return null;
//   };

//   // Custom Components
//   const Chip = ({ label, color = 'default', size = 'medium', variant = 'filled' }) => {
//     const colorClasses = {
//       default: 'bg-gray-100 text-gray-800',
//       success: 'bg-green-100 text-green-800',
//       warning: 'bg-yellow-100 text-yellow-800',
//       error: 'bg-red-100 text-red-800',
//       info: 'bg-blue-100 text-blue-800',
//       primary: 'bg-purple-100 text-purple-800'
//     };

//     const sizeClasses = {
//       small: 'px-2 py-1 text-xs',
//       medium: 'px-3 py-1 text-sm'
//     };

//     const baseClasses = 'inline-flex items-center font-medium rounded-full';

//     return (
//       <span className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[color]}`}>
//         {label}
//       </span>
//     );
//   };

//   const IconButton = ({ children, onClick, className = '', size = 'medium', ...props }) => {
//     const sizeClasses = {
//       small: 'p-1',
//       medium: 'p-2'
//     };

//     return (
//       <button
//         onClick={onClick}
//         className={`rounded-full hover:bg-opacity-10 transition-colors ${sizeClasses[size]} ${className}`}
//         {...props}
//       >
//         {children}
//       </button>
//     );
//   };

//   const Tooltip = ({ children, title }) => {
//     const [showTooltip, setShowTooltip] = useState(false);

//     return (
//       <div className="relative inline-block">
//         <div
//           onMouseEnter={() => setShowTooltip(true)}
//           onMouseLeave={() => setShowTooltip(false)}
//         >
//           {children}
//         </div>
//         {showTooltip && (
//           <div className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded bottom-full mb-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
//             {title}
//             <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const Modal = ({ open, onClose, children, maxWidth = 'md' }) => {
//     if (!open) return null;

//     const maxWidthClasses = {
//       sm: 'max-w-sm',
//       md: 'max-w-md',
//       lg: 'max-w-lg',
//       xl: 'max-w-xl',
//       '2xl': 'max-w-2xl',
//       '3xl': 'max-w-3xl',
//       '4xl': 'max-w-4xl'
//     };

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//         <div className={`w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}>
//           {children}
//         </div>
//       </div>
//     );
//   };

//   const ModalHeader = ({ children, onClose, gradient = 'from-blue-600 to-blue-700' }) => (
//     <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${gradient} text-white rounded-t-2xl sticky top-0 z-10`}>
//       <div className="text-xl font-bold">{children}</div>
//       <IconButton onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20">
//         <Clear />
//       </IconButton>
//     </div>
//   );

//   const ModalContent = ({ children, className = '' }) => (
//     <div className={`p-6 ${className}`}>
//       {children}
//     </div>
//   );

//   const ModalActions = ({ children, className = '' }) => (
//     <div className={`flex items-center justify-end space-x-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white ${className}`}>
//       {children}
//     </div>
//   );

//   // Loading skeleton
//   const OrderSkeleton = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className="h-6 bg-gray-300 rounded w-32"></div>
//         <div className="h-6 bg-gray-300 rounded w-24"></div>
//       </div>
//       <div className="space-y-3">
//         <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//         <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//         <div className="h-4 bg-gray-300 rounded w-2/3"></div>
//       </div>
//       <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//         <div className="h-8 bg-gray-300 rounded w-20"></div>
//         <div className="h-8 bg-gray-300 rounded w-24"></div>
//       </div>
//     </div>
//   );

//   // Product Skeleton
//   const ProductSkeleton = () => (
//     <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 animate-pulse">
//       <div className="flex items-center space-x-3">
//         <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
//         <div className="flex-1">
//           <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
//           <div className="h-3 bg-gray-300 rounded w-24"></div>
//         </div>
//       </div>
//       <div className="h-8 bg-gray-300 rounded w-16"></div>
//     </div>
//   );

//   // Order Card Component
//   const OrderCard = ({ order }) => (
//     <motion.div
//       layout
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       whileHover={{ y: -4, transition: { duration: 0.2 } }}
//       className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
//     >
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
//             <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
//           </div>
//           <div className="text-right">
//             <p className="font-bold text-xl text-blue-600">{formatCurrency(order.totalAmount)}</p>
//             <p className="text-sm text-gray-600">{order.products.length} item(s)</p>
//           </div>
//         </div>

//         {/* Customer Info */}
//         <div className="mb-4">
//           <div className="flex items-center space-x-2 mb-2">
//             <Person className="text-gray-400 text-sm" />
//             <span className="font-semibold text-gray-800">{order.customerName}</span>
//           </div>
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <Email className="text-gray-400 text-sm" />
//             <span>{order.customerEmail}</span>
//           </div>
//         </div>

//         {/* Status Badges */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <Chip
//             label={getStatusLabel(order.orderStatus)}
//             color={getStatusColor(order.orderStatus)}
//             size="small"
//           />
//           <Chip
//             label={getPaymentLabel(order.paymentStatus)}
//             color={getPaymentColor(order.paymentStatus)}
//             size="small"
//           />
//         </div>

//         {/* Products Preview */}
//         <div className="mb-4">
//           <p className="text-sm font-semibold text-gray-700 mb-2">Products:</p>
//           <div className="space-y-1">
//             {order.products.slice(0, 2).map((product, index) => (
//               <div key={index} className="flex justify-between text-sm text-gray-600">
//                 <span className="truncate">{product.name} × {product.quantity}</span>
//                 <span>{formatCurrency(product.total)}</span>
//               </div>
//             ))}
//             {order.products.length > 2 && (
//               <div className="text-sm text-gray-500">
//                 +{order.products.length - 2} more items
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//           <Tooltip title="View Order Details">
//             <IconButton
//               size="small"
//               onClick={() => setViewOrder(order)}
//               className="text-blue-600 hover:bg-blue-50"
//             >
//               <Visibility fontSize="small" />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Edit Order">
//             <IconButton
//               size="small"
//               onClick={() => setEditingOrder(order)}
//               className="text-green-600 hover:bg-green-50"
//             >
//               <Edit fontSize="small" />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Update Status">
//             <IconButton
//               size="small"
//               onClick={() => setViewOrder(order)}
//               className="text-purple-600 hover:bg-purple-50"
//             >
//               <TrackChanges fontSize="small" />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Delete Order">
//             <IconButton
//               size="small"
//               onClick={() => {
//                 setOrderToDelete(order);
//                 setIsDeleteModalOpen(true);
//               }}
//               className="text-red-600 hover:bg-red-50"
//             >
//               <Delete fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-2xl shadow-lg">
//                 <LocalShipping className="text-blue-600 text-2xl md:text-3xl" />
//               </div>
//               Electronic Orders Management
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Manage customer orders, track shipments, and process electronic device orders
//             </p>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsCreateModalOpen(true)}
//             className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
//           >
//             <Add />
//             Create New Order
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Stats Overview */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
//       >
//         {[
//           { label: 'Total Orders', value: orders.length, icon: <Receipt />, color: 'blue' },
//           { label: 'Pending', value: orders.filter(o => o.orderStatus === 'pending').length, icon: <Schedule />, color: 'yellow' },
//           { label: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length, icon: <Inventory />, color: 'purple' },
//           { label: 'Shipped', value: orders.filter(o => o.orderStatus === 'shipped').length, icon: <LocalShipping />, color: 'green' },
//           { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length, icon: <CheckCircle />, color: 'green' },
//           { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'cancelled').length, icon: <Cancel />, color: 'red' }
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 * index }}
//             className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//               </div>
//               <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
//                 {React.cloneElement(stat.icon, { className: `text-${stat.color}-600 text-xl` })}
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Controls Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//         className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
//       >
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Search */}
//           <div className="flex-1 max-w-md">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search orders by number, customer, or tracking..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//               />
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-wrap gap-3">
//             {/* Status Filter */}
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//             >
//               {statusOptions.map(status => (
//                 <option key={status.value} value={status.value}>
//                   {status.label}
//                 </option>
//               ))}
//             </select>

//             {/* Payment Filter */}
//             <select
//               value={filterPayment}
//               onChange={(e) => setFilterPayment(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//             >
//               {paymentOptions.map(payment => (
//                 <option key={payment.value} value={payment.value}>
//                   {payment.label}
//                 </option>
//               ))}
//             </select>

//             {/* Sort */}
//             <select
//               value={`${sortField}-${sortDirection}`}
//               onChange={(e) => {
//                 const [field, direction] = e.target.value.split('-');
//                 setSortField(field);
//                 setSortDirection(direction);
//               }}
//               className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//             >
//               <option value="createdAt-desc">Newest First</option>
//               <option value="createdAt-asc">Oldest First</option>
//               <option value="totalAmount-desc">Amount High-Low</option>
//               <option value="totalAmount-asc">Amount Low-High</option>
//               <option value="customerName-asc">Customer A-Z</option>
//               <option value="customerName-desc">Customer Z-A</option>
//             </select>
//           </div>
//         </div>
//       </motion.div>

//       {/* Orders Grid */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className="mb-8"
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-gray-800">
//             Orders ({filteredAndSortedOrders.length})
//           </h2>
//           <div className="text-sm text-gray-600">
//             Showing {filteredAndSortedOrders.length} of {orders.length} orders
//           </div>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <OrderSkeleton key={index} />
//             ))}
//           </div>
//         ) : filteredAndSortedOrders.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
//           >
//             <Assignment className="text-gray-400 text-6xl mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
//             <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterStatus('all');
//                 setFilterPayment('all');
//               }}
//               className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
//             >
//               Clear Filters
//             </button>
//           </motion.div>
//         ) : (
//           <AnimatePresence>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {filteredAndSortedOrders.map(order => (
//                 <OrderCard key={order.id} order={order} />
//               ))}
//             </div>
//           </AnimatePresence>
//         )}
//       </motion.div>

//       {/* Create Order Modal */}
//       <Modal
//         open={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         maxWidth="4xl"
//       >
//         <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
//           Create New Order
//         </ModalHeader>
//         <ModalContent>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Customer Information & Order Details */}
//             <div className="space-y-6">
//               {/* Customer Information */}
//               <div className="bg-gray-50 rounded-2xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <Person />
//                   Customer Information
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
//                     <input
//                       type="text"
//                       value={newOrder.customerName}
//                       onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter customer name"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//                     <input
//                       type="email"
//                       value={newOrder.customerEmail}
//                       onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter email address"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                     <input
//                       type="tel"
//                       value={newOrder.customerPhone}
//                       onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter phone number"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
//                     <textarea
//                       value={newOrder.shippingAddress}
//                       onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter complete shipping address"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Order Details */}
//               <div className="bg-gray-50 rounded-2xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <Assignment />
//                   Order Details
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
//                     <select
//                       value={newOrder.orderStatus}
//                       onChange={(e) => setNewOrder({ ...newOrder, orderStatus: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                     >
//                       {statusOptions.filter(opt => opt.value !== 'all').map(option => (
//                         <option key={option.value} value={option.value}>{option.label}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
//                     <select
//                       value={newOrder.paymentStatus}
//                       onChange={(e) => setNewOrder({ ...newOrder, paymentStatus: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                     >
//                       {paymentOptions.filter(opt => opt.value !== 'all').map(option => (
//                         <option key={option.value} value={option.value}>{option.label}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
//                     <select
//                       value={newOrder.shippingMethod}
//                       onChange={(e) => setNewOrder({ ...newOrder, shippingMethod: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                     >
//                       {shippingMethods.map(method => (
//                         <option key={method.value} value={method.value}>{method.label}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
//                     <input
//                       type="text"
//                       value={newOrder.trackingNumber}
//                       onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter tracking number"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes</label>
//                     <textarea
//                       value={newOrder.notes}
//                       onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter any special notes or instructions"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Products Selection & Order Summary */}
//             <div className="space-y-6">
//               {/* Products Selection */}
//               <div className="bg-gray-50 rounded-2xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <Inventory />
//                   Add Products
//                 </h3>
//                 <div className="space-y-3 max-h-60 overflow-y-auto">
//                   {productsLoading ? (
//                     Array.from({ length: 5 }).map((_, index) => (
//                       <ProductSkeleton key={index} />
//                     ))
//                   ) : products.length === 0 ? (
//                     <p className="text-gray-500 text-center py-4">No products available</p>
//                   ) : (
//                     products.map(product => (
//                       <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
//                         <div className="flex items-center space-x-3">
//                           {getProductImage(product) ? (
//                             <img 
//                               src={getProductImage(product)} 
//                               alt={product.name}
//                               className="w-12 h-12 rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
//                               <Inventory className="text-gray-400" />
//                             </div>
//                           )}
//                           <div>
//                             <p className="font-semibold text-gray-800">{product.name}</p>
//                             <p className="text-sm text-gray-600">{product.category} • {formatCurrency(product.price)}</p>
//                             {product.sku && (
//                               <p className="text-xs text-gray-500">SKU: {product.sku}</p>
//                             )}
//                             <p className="text-xs text-gray-500">Stock: {product.stock}</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => addProductToOrder(product)}
//                           disabled={product.stock === 0}
//                           className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
//                         >
//                           {product.stock === 0 ? 'Out of Stock' : 'Add'}
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* Selected Products */}
//               <div className="bg-gray-50 rounded-2xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <Receipt />
//                   Selected Products ({newOrder.products.length})
//                 </h3>
//                 {newOrder.products.length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">No products selected</p>
//                 ) : (
//                   <div className="space-y-3">
//                     {newOrder.products.map(product => (
//                       <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
//                         <div className="flex items-center space-x-3">
//                           {product.images && product.images.length > 0 ? (
//                             <img 
//                               src={getProductImage(product)} 
//                               alt={product.name}
//                               className="w-10 h-10 rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
//                               <Inventory className="text-gray-400 text-sm" />
//                             </div>
//                           )}
//                           <div className="flex-1">
//                             <p className="font-semibold text-gray-800">{product.name}</p>
//                             <p className="text-sm text-gray-600">{formatCurrency(product.price)} each</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
//                             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
//                           >
//                             -
//                           </button>
//                           <span className="w-8 text-center font-semibold">{product.quantity}</span>
//                           <button
//                             onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
//                             disabled={product.quantity >= product.stock}
//                             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                           >
//                             +
//                           </button>
//                           <button
//                             onClick={() => removeProductFromOrder(product.id)}
//                             className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-300"
//                           >
//                             <Clear fontSize="small" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Order Summary */}
//               <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal:</span>
//                     <span className="font-semibold">
//                       {formatCurrency(newOrder.products.reduce((sum, product) => sum + product.total, 0))}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping:</span>
//                     <span className="font-semibold">
//                       {formatCurrency(shippingMethods.find(m => m.value === newOrder.shippingMethod)?.cost || 0)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax (8%):</span>
//                     <span className="font-semibold">
//                       {formatCurrency(newOrder.products.reduce((sum, product) => sum + product.total, 0) * 0.08)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between border-t border-gray-200 pt-2">
//                     <span className="text-lg font-bold text-gray-800">Total:</span>
//                     <span className="text-lg font-bold text-blue-600">
//                       {formatCurrency(
//                         newOrder.products.reduce((sum, product) => sum + product.total, 0) +
//                         (shippingMethods.find(m => m.value === newOrder.shippingMethod)?.cost || 0) +
//                         (newOrder.products.reduce((sum, product) => sum + product.total, 0) * 0.08)
//                       )}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </ModalContent>
//         <ModalActions>
//           <button
//             onClick={() => setIsCreateModalOpen(false)}
//             className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreateOrder}
//             className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={!newOrder.customerName || !newOrder.customerEmail || !newOrder.shippingAddress || newOrder.products.length === 0}
//           >
//             Create Order
//           </button>
//         </ModalActions>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         open={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         maxWidth="sm"
//       >
//         <div className="bg-red-50 text-red-800 p-6 rounded-t-2xl">
//           <h3 className="text-lg font-semibold">Confirm Order Deletion</h3>
//         </div>
//         <ModalContent>
//           <div className="flex items-center space-x-4">
//             <Warning className="text-red-600 text-2xl" />
//             <div>
//               <p className="font-semibold text-gray-800">
//                 Are you sure you want to delete order "{orderToDelete?.orderNumber}"?
//               </p>
//               <p className="text-gray-600 mt-1">
//                 This action cannot be undone. All order data will be permanently removed.
//               </p>
//             </div>
//           </div>
//         </ModalContent>
//         <ModalActions>
//           <button
//             onClick={() => setIsDeleteModalOpen(false)}
//             className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => handleDeleteOrder(orderToDelete?.id)}
//             className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-300"
//           >
//             Delete Order
//           </button>
//         </ModalActions>
//       </Modal>

//       {/* View Order Modal */}
//       {viewOrder && (
//         <Modal
//           open={!!viewOrder}
//           onClose={() => setViewOrder(null)}
//           maxWidth="4xl"
//         >
//           <ModalHeader onClose={() => setViewOrder(null)} gradient="from-purple-600 to-purple-700">
//             Order Details - {viewOrder.orderNumber}
//           </ModalHeader>
//           <ModalContent>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Order Summary */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Customer Information */}
//                 <div className="bg-gray-50 rounded-2xl p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <Person />
//                     Customer Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-600">Customer Name</p>
//                       <p className="font-semibold text-gray-800">{viewOrder.customerName}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Email</p>
//                       <p className="font-semibold text-gray-800">{viewOrder.customerEmail}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Phone</p>
//                       <p className="font-semibold text-gray-800">{viewOrder.customerPhone}</p>
//                     </div>
//                     <div className="md:col-span-2">
//                       <p className="text-sm text-gray-600">Shipping Address</p>
//                       <p className="font-semibold text-gray-800">{viewOrder.shippingAddress}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="bg-gray-50 rounded-2xl p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <Inventory />
//                     Order Items
//                   </h3>
//                   <div className="space-y-3">
//                     {viewOrder.products.map((product, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                             <Inventory className="text-blue-600 text-sm" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">{product.name}</p>
//                             <p className="text-sm text-gray-600">SKU: {product.sku} | Qty: {product.quantity}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-gray-800">{formatCurrency(product.total)}</p>
//                           <p className="text-sm text-gray-600">{formatCurrency(product.price)} each</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Order Notes */}
//                 {viewOrder.notes && (
//                   <div className="bg-gray-50 rounded-2xl p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <Assignment />
//                       Order Notes
//                     </h3>
//                     <p className="text-gray-700">{viewOrder.notes}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Order Status & Actions */}
//               <div className="space-y-6">
//                 {/* Order Status */}
//                 <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Order Status:</span>
//                       <Chip
//                         label={getStatusLabel(viewOrder.orderStatus)}
//                         color={getStatusColor(viewOrder.orderStatus)}
//                       />
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Payment Status:</span>
//                       <Chip
//                         label={getPaymentLabel(viewOrder.paymentStatus)}
//                         color={getPaymentColor(viewOrder.paymentStatus)}
//                       />
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Shipping Method:</span>
//                       <span className="font-semibold text-gray-800">{getShippingMethodLabel(viewOrder.shippingMethod)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Tracking Number:</span>
//                       <span className="font-semibold text-gray-800">{viewOrder.trackingNumber}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal:</span>
//                       <span className="font-semibold">{formatCurrency(viewOrder.subtotal)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping:</span>
//                       <span className="font-semibold">{formatCurrency(viewOrder.shippingCost)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Tax:</span>
//                       <span className="font-semibold">{formatCurrency(viewOrder.tax)}</span>
//                     </div>
//                     <div className="flex justify-between border-t border-gray-200 pt-2">
//                       <span className="text-lg font-bold text-gray-800">Total:</span>
//                       <span className="text-lg font-bold text-blue-600">{formatCurrency(viewOrder.totalAmount)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
//                   <div className="space-y-2">
//                     <button
//                       onClick={() => updateOrderStatus(viewOrder.id, 'processing')}
//                       className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
//                     >
//                       Mark as Processing
//                     </button>
//                     <button
//                       onClick={() => updateOrderStatus(viewOrder.id, 'shipped')}
//                       className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
//                     >
//                       Mark as Shipped
//                     </button>
//                     <button
//                       onClick={() => updateOrderStatus(viewOrder.id, 'delivered')}
//                       className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-300 text-sm font-semibold"
//                     >
//                       Mark as Delivered
//                     </button>
//                     <button
//                       onClick={() => setEditingOrder(viewOrder)}
//                       className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 text-sm font-semibold"
//                     >
//                       Edit Order
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </ModalContent>
//           <ModalActions>
//             <button
//               onClick={() => setViewOrder(null)}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
//             >
//               Close
//             </button>
//             <button
//               onClick={() => {
//                 setEditingOrder(viewOrder);
//                 setViewOrder(null);
//               }}
//               className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors duration-300"
//             >
//               Edit Order
//             </button>
//           </ModalActions>
//         </Modal>
//       )}

//       {/* Edit Order Modal */}
//       {editingOrder && (
//         <Modal
//           open={!!editingOrder}
//           onClose={() => setEditingOrder(null)}
//           maxWidth="2xl"
//         >
//           <ModalHeader onClose={() => setEditingOrder(null)} gradient="from-green-600 to-green-700">
//             Edit Order - {editingOrder.orderNumber}
//           </ModalHeader>
//           <ModalContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
//                 <select
//                   value={editingOrder.orderStatus}
//                   onChange={(e) => setEditingOrder({ ...editingOrder, orderStatus: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
//                 >
//                   {statusOptions.filter(opt => opt.value !== 'all').map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
//                 <select
//                   value={editingOrder.paymentStatus}
//                   onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
//                 >
//                   {paymentOptions.filter(opt => opt.value !== 'all').map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
//                 <select
//                   value={editingOrder.shippingMethod}
//                   onChange={(e) => setEditingOrder({ ...editingOrder, shippingMethod: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
//                 >
//                   {shippingMethods.map(method => (
//                     <option key={method.value} value={method.value}>{method.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
//                 <input
//                   type="text"
//                   value={editingOrder.trackingNumber}
//                   onChange={(e) => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
//                 <textarea
//                   value={editingOrder.notes}
//                   onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
//                 />
//               </div>
//             </div>
//           </ModalContent>
//           <ModalActions>
//             <button
//               onClick={() => setEditingOrder(null)}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => handleUpdateOrder(editingOrder.id, editingOrder)}
//               className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300"
//             >
//               Update Order
//             </button>
//           </ModalActions>
//         </Modal>
//       )}
//     </div>
//   );
// };


/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Add,
  Clear,
  Delete,
  Edit,
  Inventory,
  Search,
  Visibility,
  Warning,
  LocalShipping,
  Payment,
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Phone,
  Email,
  LocationOn,
  Receipt,
  TrackChanges,
  Assignment,
  Star,
  StarBorder,
  Category,
  ExpandMore,
  ExpandLess,
  FilterList,
  Image as ImageIcon,
  Save,
  ShoppingCart,
  AttachMoney,
  Storage,
  Smartphone,
  Laptop,
  Headset,
  Watch,
  Tablet,
  SportsEsports,
  Refresh
} from '@mui/icons-material';

export const ElectronicOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editingOrder, setEditingOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  
  // Product management states
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  
  // New states for enhanced product selection
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortProductBy, setSortProductBy] = useState('name');

  // Refs for form inputs to prevent cursor jumping
  const shippingAddressRefs = useRef({});
  const billingAddressRefs = useRef({});
  const orderDetailsRefs = useRef({});
  const productFormRefs = useRef({});

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    sku: '',
    category: 'smartphones',
    price: 0,
    comparePrice: 0,
    cost: 0,
    stock: 0,
    lowStockAlert: 10,
    brand: '',
    model: '',
    images: [],
    variants: [],
    tags: [],
    isActive: true,
    isDigital: false,
    isAvailable: true,
    isFeatured: false,
    weight: null,
    dimensions: {
      length: null,
      width: null,
      height: null
    },
    specifications: {},
    features: [],
    warranty: '',
    vendor: '',
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    metadata: {}
  });

  // New order form state
  const [newOrder, setNewOrder] = useState({
    user: '',
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    currency: 'USD',
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: ''
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: ''
    },
    notes: '',
    metadata: {}
  });

  // API base URLs
  const ORDERS_API = 'https://nexusbackend-hdyk.onrender.com/orders';
  const PRODUCTS_API = 'https://nexusbackend-hdyk.onrender.com/products';
  const USERS_API = 'https://nexusbackend-hdyk.onrender.com/admin';

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'default' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'info' },
    { value: 'processing', label: 'Processing', color: 'primary' },
    { value: 'shipped', label: 'Shipped', color: 'success' },
    { value: 'delivered', label: 'Delivered', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
    { value: 'refunded', label: 'Refunded', color: 'error' }
  ];

  // Payment status options
  const paymentOptions = [
    { value: 'all', label: 'All Payments', color: 'default' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'paid', label: 'Paid', color: 'success' },
    { value: 'failed', label: 'Failed', color: 'error' },
    { value: 'refunded', label: 'Refunded', color: 'error' }
  ];

  // Product categories
  const productCategories = [
    { value: 'smartphones', label: 'Smartphones', icon: <Smartphone /> },
    { value: 'laptops', label: 'Laptops', icon: <Laptop /> },
    { value: 'tablets', label: 'Tablets', icon: <Tablet /> },
    { value: 'audio', label: 'Audio Devices', icon: <Headset /> },
    { value: 'wearables', label: 'Wearables', icon: <Watch /> },
    { value: 'gaming', label: 'Gaming', icon: <SportsEsports /> },
    { value: 'accessories', label: 'Accessories', icon: <Headset /> },
    { value: 'storage', label: 'Storage', icon: <Storage /> }
  ];

  // Shipping methods
  const shippingMethods = [
    { value: 'standard', label: 'Standard Shipping', cost: 9.99, days: '5-7' },
    { value: 'express', label: 'Express Shipping', cost: 19.99, days: '2-3' },
    { value: 'overnight', label: 'Overnight Shipping', cost: 39.99, days: '1' },
    { value: 'free', label: 'Free Shipping', cost: 0, days: '7-10' }
  ];

  // Countries for address forms
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'China'
  ];

  // States for address forms
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Product sort options
  const productSortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price', label: 'Price Low-High' },
    { value: 'price-desc', label: 'Price High-Low' },
    { value: 'stock', label: 'Stock Low-High' },
    { value: 'stock-desc', label: 'Stock High-Low' },
    { value: 'rating', label: 'Rating Low-High' },
    { value: 'rating-desc', label: 'Rating High-Low' },
    { value: 'createdAt', label: 'Newest First' },
    { value: 'createdAt-desc', label: 'Oldest First' }
  ];

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(ORDERS_API);
      
      // Handle different response formats
      let ordersData = [];
      
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (response.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else {
        console.warn('Unexpected API response format:', response.data);
        toast.error('Unexpected data format from orders API');
        setOrders([]);
        return;
      }

      // Transform API data to match your schema structure
      const transformedOrders = ordersData.map((order, index) => {
        // Transform items to match your orderItemSchema
        const items = order.items && Array.isArray(order.items) 
          ? order.items.map(item => ({
              product: item.product || item.productId,
              variant: item.variant || { name: '', option: '' },
              quantity: item.quantity || 1,
              price: item.price || 0,
              total: item.total || (item.price || 0) * (item.quantity || 1)
            }))
          : [];

        // Use schema fields directly
        return {
          _id: order._id || order.id,
          orderNumber: order.orderNumber || `ORD-${1000 + index}`,
          user: order.user,
          items,
          subtotal: order.subtotal || 0,
          tax: order.tax || 0,
          shipping: order.shipping || order.shippingCost || 0,
          discount: order.discount || 0,
          total: order.total || order.totalAmount || 0,
          currency: order.currency || 'USD',
          status: order.status || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          payment: order.payment,
          shippingAddress: order.shippingAddress || {
            firstName: '',
            lastName: '',
            address1: '',
            city: '',
            state: '',
            zip: '',
            country: 'United States',
            phone: ''
          },
          billingAddress: order.billingAddress || {
            firstName: '',
            lastName: '',
            address1: '',
            city: '',
            state: '',
            zip: '',
            country: 'United States',
            phone: ''
          },
          notes: order.notes || '',
          metadata: order.metadata || {},
          paidAt: order.paidAt,
          shippedAt: order.shippedAt,
          deliveredAt: order.deliveredAt,
          cancelledAt: order.cancelledAt,
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt || new Date().toISOString()
        };
      });

      setOrders(transformedOrders);
      toast.success('Orders loaded successfully!');
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders from API.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get(PRODUCTS_API);
      
      // Handle different response formats for MongoDB products
      let productsData = [];
      
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else {
        console.warn('Unexpected API response format:', response.data);
        console.log('Using sample products data instead');
        // Use sample data if API fails
        setProducts(getSampleProducts());
        return;
      }

      // Transform products to match MongoDB schema structure
      const transformedProducts = productsData.map(product => ({
        _id: product._id || product.id,
        name: product.name || 'Unknown Product',
        description: product.description || '',
        sku: product.sku || `SKU-${Math.random().toString(36).substr(2, 8)}`,
        category: product.category || 'electronics',
        price: product.price || 0,
        comparePrice: product.comparePrice || product.originalPrice || null,
        cost: product.cost || product.wholesalePrice || null,
        stock: product.stock || product.quantity || product.inventory || 0,
        lowStockAlert: product.lowStockAlert || product.minStock || 10,
        images: product.images || product.image || [],
        variants: product.variants || product.options || [],
        tags: product.tags || product.categories || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        isDigital: product.isDigital !== undefined ? product.isDigital : false,
        weight: product.weight || null,
        dimensions: product.dimensions || {
          length: product.length,
          width: product.width,
          height: product.height
        },
        seo: product.seo || {
          title: product.seoTitle,
          description: product.seoDescription,
          keywords: product.seoKeywords
        },
        metadata: product.metadata || product.customFields || {},
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        // Additional MongoDB fields
        slug: product.slug || product.name?.toLowerCase().replace(/ /g, '-'),
        brand: product.brand || '',
        model: product.model || '',
        features: product.features || [],
        specifications: product.specifications || {},
        warranty: product.warranty || '',
        vendor: product.vendor || '',
        isFeatured: product.isFeatured || false,
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        ratings: product.ratings || {
          average: product.rating || 0,
          count: product.reviewCount || 0
        },
        reviews: product.reviews || []
      }));

      setProducts(transformedProducts);
      toast.success('Products loaded from API!');
    } catch (error) {
      console.error('Error loading products from API:', error);
      console.log('Using sample products data instead');
      setProducts(getSampleProducts());
      toast.info('Using sample products data');
    } finally {
      setProductsLoading(false);
    }
  };

  // Sample products data with electronics categories
  const getSampleProducts = () => [
    {
      _id: "1",
      name: "iPhone 15 Pro",
      description: "Latest iPhone with A17 Pro chip and titanium design",
      sku: "IP15P-256-BLK",
      category: "smartphones",
      price: 999.99,
      comparePrice: 1199.99,
      cost: 750.00,
      stock: 45,
      brand: "Apple",
      model: "iPhone 15 Pro",
      images: [
        {
          url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
          alt: "iPhone 15 Pro",
          isPrimary: true
        }
      ],
      specifications: {
        storage: "256GB",
        color: "Black Titanium",
        screen: "6.1-inch Super Retina XDR",
        chip: "A17 Pro",
        camera: "48MP Main camera"
      },
      features: ["5G", "Face ID", "Ceramic Shield", "IP68 Water resistance"],
      ratings: {
        average: 4.8,
        count: 1247
      },
      isActive: true,
      isAvailable: true,
      isFeatured: true,
      warranty: "1 year",
      vendor: "Apple Inc.",
      weight: 6.60,
      dimensions: {
        length: 5.77,
        width: 2.78,
        height: 0.32
      },
      tags: ["smartphone", "apple", "5g", "premium"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "2",
      name: "Samsung Galaxy S24 Ultra",
      description: "Premium Android smartphone with S Pen",
      sku: "SGS24U-512-GRY",
      category: "smartphones",
      price: 1299.99,
      comparePrice: 1399.99,
      cost: 950.00,
      stock: 32,
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      images: [
        {
          url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
          alt: "Samsung Galaxy S24 Ultra",
          isPrimary: true
        }
      ],
      specifications: {
        storage: "512GB",
        color: "Titanium Gray",
        screen: "6.8-inch Dynamic AMOLED 2X",
        chip: "Snapdragon 8 Gen 3",
        camera: "200MP Main camera"
      },
      features: ["S Pen", "5G", "Under-display camera", "IP68 Water resistance"],
      ratings: {
        average: 4.6,
        count: 892
      },
      isActive: true,
      isAvailable: true,
      isFeatured: true,
      warranty: "2 years",
      vendor: "Samsung Electronics",
      weight: 7.16,
      dimensions: {
        length: 6.39,
        width: 3.11,
        height: 0.34
      },
      tags: ["smartphone", "samsung", "5g", "s-pen"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "3",
      name: "MacBook Pro 16-inch",
      description: "Professional laptop with M3 Max chip",
      sku: "MBP16-M3-1TB",
      category: "laptops",
      price: 2499.99,
      comparePrice: 2799.99,
      cost: 1800.00,
      stock: 18,
      brand: "Apple",
      model: "MacBook Pro 16-inch",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
          alt: "MacBook Pro 16-inch",
          isPrimary: true
        }
      ],
      specifications: {
        storage: "1TB SSD",
        memory: "32GB",
        chip: "M3 Max",
        screen: "16.2-inch Liquid Retina XDR"
      },
      features: ["M3 Max chip", "Liquid Retina XDR display", "Up to 22 hours battery"],
      ratings: {
        average: 4.9,
        count: 567
      },
      isActive: true,
      isAvailable: true,
      isFeatured: true,
      warranty: "1 year",
      vendor: "Apple Inc.",
      weight: 2.15,
      dimensions: {
        length: 14.01,
        width: 9.77,
        height: 0.66
      },
      tags: ["laptop", "apple", "professional", "m3"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "4",
      name: "AirPods Pro (2nd Generation)",
      description: "Wireless earbuds with Active Noise Cancellation",
      sku: "AIRPODSPRO2",
      category: "audio",
      price: 249.99,
      comparePrice: 279.99,
      cost: 150.00,
      stock: 120,
      brand: "Apple",
      model: "AirPods Pro 2",
      images: [
        {
          url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
          alt: "AirPods Pro",
          isPrimary: true
        }
      ],
      specifications: {
        battery: "6 hours",
        connectivity: "Bluetooth 5.3",
        case: "MagSafe Charging Case"
      },
      features: ["Active Noise Cancellation", "Transparency mode", "Spatial Audio"],
      ratings: {
        average: 4.7,
        count: 2341
      },
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      warranty: "1 year",
      vendor: "Apple Inc.",
      weight: 0.19,
      dimensions: {
        length: 1.78,
        width: 0.86,
        height: 0.94
      },
      tags: ["earbuds", "wireless", "noise-cancelling"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "5",
      name: "iPad Air 5th Generation",
      description: "Powerful tablet with M1 chip",
      sku: "IPADAIR5-64-SLV",
      category: "tablets",
      price: 599.99,
      comparePrice: 649.99,
      cost: 400.00,
      stock: 25,
      brand: "Apple",
      model: "iPad Air 5",
      images: [
        {
          url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
          alt: "iPad Air",
          isPrimary: true
        }
      ],
      specifications: {
        storage: "64GB",
        color: "Silver",
        screen: "10.9-inch Liquid Retina",
        chip: "M1"
      },
      features: ["M1 chip", "Touch ID", "USB-C", "Support for Apple Pencil"],
      ratings: {
        average: 4.5,
        count: 892
      },
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      warranty: "1 year",
      vendor: "Apple Inc.",
      weight: 1.02,
      dimensions: {
        length: 9.74,
        width: 7.02,
        height: 0.24
      },
      tags: ["tablet", "apple", "m1", "portable"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "6",
      name: "Sony WH-1000XM5 Headphones",
      description: "Industry-leading noise canceling wireless headphones",
      sku: "SONYWH1000XM5-BLK",
      category: "audio",
      price: 399.99,
      comparePrice: 449.99,
      cost: 250.00,
      stock: 38,
      brand: "Sony",
      model: "WH-1000XM5",
      images: [
        {
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          alt: "Sony WH-1000XM5",
          isPrimary: true
        }
      ],
      specifications: {
        battery: "30 hours",
        noiseCanceling: "Industry-leading",
        connectivity: "Bluetooth 5.2"
      },
      features: ["Industry-leading noise cancellation", "30-hour battery", "Quick charging"],
      ratings: {
        average: 4.8,
        count: 1567
      },
      isActive: true,
      isAvailable: true,
      isFeatured: true,
      warranty: "2 years",
      vendor: "Sony Corporation",
      weight: 0.55,
      dimensions: {
        length: 8.85,
        width: 7.87,
        height: 3.03
      },
      tags: ["headphones", "noise-cancelling", "wireless"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "7",
      name: "Apple Watch Series 9",
      description: "Advanced smartwatch with Double Tap gesture",
      sku: "AWS9-45-ALM",
      category: "wearables",
      price: 429.99,
      comparePrice: 479.99,
      cost: 280.00,
      stock: 67,
      brand: "Apple",
      model: "Watch Series 9",
      images: [
        {
          url: "https://images.unsplash.com/photo-1579586337278-3f436c8c66a2?w=400&h=400&fit=crop",
          alt: "Apple Watch Series 9",
          isPrimary: true
        }
      ],
      specifications: {
        size: "45mm",
        color: "Aluminum Midnight",
        gps: "Built-in"
      },
      features: ["Double Tap gesture", "Advanced health monitoring", "GPS"],
      ratings: {
        average: 4.6,
        count: 2341
      },
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      warranty: "1 year",
      vendor: "Apple Inc.",
      weight: 0.38,
      dimensions: {
        length: 1.77,
        width: 1.53,
        height: 0.43
      },
      tags: ["smartwatch", "wearable", "fitness"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "8",
      name: "Dell XPS 13 Plus",
      description: "Ultra-thin laptop with innovative design",
      sku: "DLLXPS13-9320",
      category: "laptops",
      price: 1299.99,
      comparePrice: 1449.99,
      cost: 900.00,
      stock: 22,
      brand: "Dell",
      model: "XPS 13 Plus",
      images: [
        {
          url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
          alt: "Dell XPS 13 Plus",
          isPrimary: true
        }
      ],
      specifications: {
        storage: "512GB SSD",
        memory: "16GB",
        processor: "Intel Core i7"
      },
      features: ["InfinityEdge display", "Innovative keyboard design", "Ultra-thin"],
      ratings: {
        average: 4.4,
        count: 678
      },
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      warranty: "1 year",
      vendor: "Dell Technologies",
      weight: 1.26,
      dimensions: {
        length: 11.63,
        width: 7.84,
        height: 0.60
      },
      tags: ["laptop", "ultra-thin", "premium"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "9",
      name: "PlayStation 5 Console",
      description: "Next-gen gaming console with 4K gaming",
      sku: "PS5-CONSOLE",
      category: "gaming",
      price: 499.99,
      comparePrice: 549.99,
      cost: 350.00,
      stock: 15,
      brand: "Sony",
      model: "PlayStation 5",
      images: [
        {
          url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
          alt: "PlayStation 5",
          isPrimary: true
        }
      ],
      specifications: {
        storage: "825GB SSD",
        resolution: "4K",
        features: "Ray tracing, 120fps"
      },
      features: ["4K gaming", "Ray tracing", "Ultra-high speed SSD"],
      ratings: {
        average: 4.9,
        count: 3456
      },
      isActive: true,
      isAvailable: true,
      isFeatured: true,
      warranty: "1 year",
      vendor: "Sony Interactive Entertainment",
      weight: 4.50,
      dimensions: {
        length: 15.4,
        width: 10.2,
        height: 4.1
      },
      tags: ["gaming", "console", "4k"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "10",
      name: "Nintendo Switch OLED",
      description: "Gaming console with vibrant OLED screen",
      sku: "NSW-OLED-RED",
      category: "gaming",
      price: 349.99,
      comparePrice: 399.99,
      cost: 220.00,
      stock: 28,
      brand: "Nintendo",
      model: "Switch OLED",
      images: [
        {
          url: "https://images.unsplash.com/photo-1556009114-f6f6d1e61b54?w=400&h=400&fit=crop",
          alt: "Nintendo Switch",
          isPrimary: true
        }
      ],
      specifications: {
        screen: "7-inch OLED",
        storage: "64GB",
        battery: "4.5-9 hours"
      },
      features: ["OLED screen", "Handheld mode", "TV mode", "Tabletop mode"],
      ratings: {
        average: 4.7,
        count: 1890
      },
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      warranty: "1 year",
      vendor: "Nintendo",
      weight: 0.93,
      dimensions: {
        length: 9.4,
        width: 4.0,
        height: 0.55
      },
      tags: ["gaming", "console", "portable"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Get unique categories from products
  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
    return ['all', ...categories];
  };

  // Filter and sort products for the products modal
  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(productSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const isAvailable = isProductInStock(product);
      
      return matchesSearch && matchesCategory && isAvailable;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortProductBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'rating':
          return (a.ratings?.average || 0) - (b.ratings?.average || 0);
        case 'rating-desc':
          return (b.ratings?.average || 0) - (a.ratings?.average || 0);
        case 'createdAt':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'createdAt-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Group products by category for the create order modal
  const getProductsByCategory = () => {
    const availableProducts = products.filter(product => isProductInStock(product));
    const grouped = {};
    
    availableProducts.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort();
    const sortedGrouped = {};
    sortedCategories.forEach(category => {
      sortedGrouped[category] = grouped[category];
    });

    return sortedGrouped;
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shippingAddress?.firstName + ' ' + order.shippingAddress?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress?.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
      
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'total' || sortField === 'subtotal') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // CRUD Operations for Products
  const handleCreateProduct = async () => {
    try {
      // Generate SKU if not provided
      const productData = {
        ...newProduct,
        sku: newProduct.sku || `SKU-${Date.now()}`,
        slug: newProduct.name.toLowerCase().replace(/ /g, '-'),
        ratings: {
          average: 0,
          count: 0
        },
        reviews: []
      };

      const response = await axios.post(PRODUCTS_API, productData);
      
      // Add the new product to state with the ID from response
      const createdProduct = {
        ...productData,
        _id: response.data._id || response.data.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProducts(prev => [createdProduct, ...prev]);
      setIsCreateProductModalOpen(false);
      resetNewProductForm();
      toast.success('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      // Send PUT request to update the product
      await axios.put(`${PRODUCTS_API}/${productId}`, updates);
      
      // Update local state
      setProducts(prev => 
        prev.map(product => 
          product._id === productId ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
        )
      );
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Send DELETE request
      await axios.delete(`${PRODUCTS_API}/${productId}`);
      
      // Update local state
      setProducts(prev => prev.filter(product => product._id !== productId));
      setIsDeleteProductModalOpen(false);
      setProductToDelete(null);
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // CRUD Operations for Orders
  const handleCreateOrder = async () => {
    try {
      // Calculate order details based on your schema
      const subtotal = newOrder.items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08; // 8% tax
      const shippingCost = newOrder.shipping;
      const total = subtotal + tax + shippingCost - newOrder.discount;

      const orderData = {
        user: newOrder.user,
        items: newOrder.items.map(item => ({
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        subtotal,
        tax,
        shipping: shippingCost,
        discount: newOrder.discount,
        total,
        currency: newOrder.currency,
        status: newOrder.status,
        paymentStatus: newOrder.paymentStatus,
        shippingAddress: newOrder.shippingAddress,
        billingAddress: newOrder.billingAddress,
        notes: newOrder.notes,
        metadata: newOrder.metadata
      };

      const response = await axios.post(ORDERS_API, orderData);
      
      // Add the new order to state with the ID from response
      const createdOrder = {
        ...orderData,
        _id: response.data._id || response.data.id,
        orderNumber: response.data.orderNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setOrders(prev => [createdOrder, ...prev]);
      setIsCreateModalOpen(false);
      resetNewOrderForm();
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      // Send PUT request to update the order
      await axios.put(`${ORDERS_API}/${orderId}`, updates);
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
        )
      );
      setEditingOrder(null);
      toast.success('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Send DELETE request
      await axios.delete(`${ORDERS_API}/${orderId}`);
      
      // Update local state
      setOrders(prev => prev.filter(order => order._id !== orderId));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      toast.success('Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    handleUpdateOrder(orderId, { status: newStatus });
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    handleUpdateOrder(orderId, { paymentStatus: newPaymentStatus });
  };

  const resetNewOrderForm = () => {
    setNewOrder({
      user: '',
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: 'USD',
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: {
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
        phone: ''
      },
      billingAddress: {
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
        phone: ''
      },
      notes: '',
      metadata: {}
    });
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      sku: '',
      category: 'smartphones',
      price: 0,
      comparePrice: 0,
      cost: 0,
      stock: 0,
      lowStockAlert: 10,
      brand: '',
      model: '',
      images: [],
      variants: [],
      tags: [],
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: false,
      weight: null,
      dimensions: {
        length: null,
        width: null,
        height: null
      },
      specifications: {},
      features: [],
      warranty: '',
      vendor: '',
      seo: {
        title: '',
        description: '',
        keywords: ''
      },
      metadata: {}
    });
  };

  // Add product to new order
  const addProductToOrder = (product) => {
    const existingItem = newOrder.items.find(item => item.product === product._id);
    if (existingItem) {
      // Increase quantity if product already exists
      setNewOrder(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.product === product._id 
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                total: item.price * (item.quantity + 1) 
              } 
            : item
        )
      }));
    } else {
      // Add new product with complete structure matching orderItemSchema
      setNewOrder(prev => ({
        ...prev,
        items: [...prev.items, { 
          product: product._id,
          variant: { name: '', option: '' },
          quantity: 1, 
          price: product.price,
          total: product.price
        }]
      }));
    }
    toast.success(`${product.name} added to order`);
  };

  // Remove product from new order
  const removeProductFromOrder = (productId) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product !== productId)
    }));
  };

  // Update product quantity in new order
  const updateProductQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeProductFromOrder(productId);
      return;
    }
    
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product === productId 
          ? { ...item, quantity, total: item.price * quantity } 
          : item
      )
    }));
  };

  // Enhanced form handlers that preserve cursor position
  const updateShippingAddress = (field, value) => {
    setNewOrder(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const updateBillingAddress = (field, value) => {
    setNewOrder(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  // Enhanced input handler that preserves cursor position
  const handleInputChange = (setter, field, value, refKey = null) => {
    // Store current cursor position
    let cursorPosition = null;
    if (refKey && shippingAddressRefs.current[refKey]) {
      cursorPosition = shippingAddressRefs.current[refKey].selectionStart;
    }

    // Update state
    setter(field, value);

    // Restore cursor position after state update
    if (cursorPosition !== null && refKey && shippingAddressRefs.current[refKey]) {
      setTimeout(() => {
        shippingAddressRefs.current[refKey].setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  };

  // Enhanced textarea handler for order notes
  const handleNotesChange = (value) => {
    setNewOrder(prev => ({
      ...prev,
      notes: value
    }));
  };

  // Product form handlers
  const handleProductFieldChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductSpecificationChange = (key, value) => {
    setNewProduct(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleProductFeatureChange = (index, value) => {
    const newFeatures = [...newProduct.features];
    newFeatures[index] = value;
    setNewProduct(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addProductFeature = () => {
    setNewProduct(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeProductFeature = (index) => {
    const newFeatures = newProduct.features.filter((_, i) => i !== index);
    setNewProduct(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  // Copy shipping address to billing address
  const copyShippingToBilling = () => {
    setNewOrder(prev => ({
      ...prev,
      billingAddress: { ...prev.shippingAddress }
    }));
    toast.info('Shipping address copied to billing address');
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

  const getPaymentColor = (paymentStatus) => {
    const paymentOption = paymentOptions.find(opt => opt.value === paymentStatus);
    return paymentOption ? paymentOption.color : 'default';
  };

  const getPaymentLabel = (paymentStatus) => {
    const paymentOption = paymentOptions.find(opt => opt.value === paymentStatus);
    return paymentOption ? paymentOption.label : paymentStatus;
  };

  const getShippingMethodLabel = (method) => {
    const shippingMethod = shippingMethods.find(m => m.value === method);
    return shippingMethod ? shippingMethod.label : method;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  };

  // Get product details by ID
  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId) || {};
  };

  // Get primary image URL from product - enhanced to handle various image formats
  const getProductImage = (product) => {
    if (!product) return null;
    
    // Handle images array with objects
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage.url) {
        return firstImage.url;
      } else if (firstImage.imageUrl) {
        return firstImage.imageUrl;
      }
    }
    
    // Handle direct image property
    if (product.image) {
      if (typeof product.image === 'string') {
        return product.image;
      } else if (product.image.url) {
        return product.image.url;
      }
    }
    
    // Handle imageUrl directly on product
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    // Return a placeholder if no image found
    return null;
  };

  // Get product rating stars
  const renderRatingStars = (product) => {
    const rating = product.ratings?.average || product.rating || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <Star key={i} className="text-yellow-400 text-sm" />
        ) : (
          <StarBorder key={i} className="text-gray-300 text-sm" />
        )
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-xs text-gray-500 ml-1">
          ({product.ratings?.count || product.reviewCount || 0})
        </span>
      </div>
    );
  };

  // Check if product is in stock
  const isProductInStock = (product) => {
    return product.stock > 0 && product.isAvailable !== false && product.isActive !== false;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const categoryObj = productCategories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : <Category />;
  };

  // Custom Components
  const Chip = ({ label, color = 'default', size = 'medium', variant = 'filled' }) => {
    const colorClasses = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      primary: 'bg-purple-100 text-purple-800'
    };

    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1 text-sm'
    };

    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    return (
      <span className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[color]}`}>
        {label}
      </span>
    );
  };

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

  const Modal = ({ open, onClose, children, maxWidth = 'md' }) => {
    if (!open) return null;

    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl'
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className={`w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}>
          {children}
        </div>
      </div>
    );
  };

  const ModalHeader = ({ children, onClose, gradient = 'from-blue-600 to-blue-700' }) => (
    <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${gradient} text-white rounded-t-2xl sticky top-0 z-10`}>
      <div className="text-xl font-bold">{children}</div>
      <IconButton onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20">
        <Clear />
      </IconButton>
    </div>
  );

  const ModalContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );

  const ModalActions = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end space-x-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white ${className}`}>
      {children}
    </div>
  );

  // Enhanced Input Component that prevents cursor jumping
  const StableInput = ({ 
    value, 
    onChange, 
    placeholder, 
    type = 'text', 
    className = '',
    refKey = null,
    ...props 
  }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (refKey && inputRef.current) {
        shippingAddressRefs.current[refKey] = inputRef.current;
      }
    }, [refKey]);

    const handleChange = (e) => {
      const newValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      
      onChange(newValue);

      // Restore cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    };

    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${className}`}
        {...props}
      />
    );
  };

  // Enhanced Textarea Component
  const StableTextarea = ({ 
    value, 
    onChange, 
    placeholder, 
    rows = 3,
    className = '',
    ...props 
  }) => {
    const textareaRef = useRef(null);

    const handleChange = (e) => {
      const newValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      
      onChange(newValue);

      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    };

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-vertical ${className}`}
        {...props}
      />
    );
  };

  // Enhanced Select Component
  const StableSelect = ({ 
    value, 
    onChange, 
    children, 
    className = '',
    ...props 
  }) => {
    const selectRef = useRef(null);

    const handleChange = (e) => {
      const newValue = e.target.value;
      onChange(newValue);
    };

    return (
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  };

  // Product Card Component for Products Modal
  const ProductCard = ({ product, onAddToOrder, showAddButton = true, showActions = true }) => {
    const productImage = getProductImage(product);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            {productImage ? (
              <img 
                src={productImage} 
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="text-gray-400" />
              </div>
            )}
            {productImage && (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                <ImageIcon className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-600">{formatCurrency(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
              {product.brand && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className={`inline-flex items-center ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Stock: {product.stock}
                </span>
                {product.category && (
                  <span className="inline-flex items-center">
                    {getCategoryIcon(product.category)}
                    <span className="ml-1">{product.category}</span>
                  </span>
                )}
              </div>
              {renderRatingStars(product)}
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                  <span key={key} className="mr-2">
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {showActions && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
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
                        setIsDeleteProductModalOpen(true);
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>

                {showAddButton && (
                  <button
                    onClick={() => onAddToOrder(product)}
                    disabled={!isProductInStock(product)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {!isProductInStock(product) ? 'Out of Stock' : 'Add to Order'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Category Section Component
  const CategorySection = ({ category, products, isExpanded, onToggle, onAddProduct }) => (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <button
        onClick={() => onToggle(category)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-3">
          {getCategoryIcon(category)}
          <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
          <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
            {products.length} products
          </span>
        </div>
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid gap-3"
          >
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToOrder={onAddProduct}
                showAddButton={true}
                showActions={false}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Enhanced Address Form Component with stable inputs
  const AddressForm = ({ address, onChange, title, type, onFieldChange }) => (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <LocationOn />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <StableInput
            value={address.firstName}
            onChange={(value) => onFieldChange('firstName', value)}
            placeholder="First name"
            refKey={`${type}-firstName`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <StableInput
            value={address.lastName}
            onChange={(value) => onFieldChange('lastName', value)}
            placeholder="Last name"
            refKey={`${type}-lastName`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <StableInput
            value={address.company}
            onChange={(value) => onFieldChange('company', value)}
            placeholder="Company name"
            refKey={`${type}-company`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
          <StableInput
            value={address.address1}
            onChange={(value) => onFieldChange('address1', value)}
            placeholder="Street address"
            refKey={`${type}-address1`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
          <StableInput
            value={address.address2}
            onChange={(value) => onFieldChange('address2', value)}
            placeholder="Apartment, suite, etc."
            refKey={`${type}-address2`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <StableInput
            value={address.city}
            onChange={(value) => onFieldChange('city', value)}
            placeholder="City"
            refKey={`${type}-city`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <StableSelect
            value={address.state}
            onChange={(value) => onFieldChange('state', value)}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </StableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
          <StableInput
            value={address.zip}
            onChange={(value) => onFieldChange('zip', value)}
            placeholder="ZIP code"
            refKey={`${type}-zip`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <StableSelect
            value={address.country}
            onChange={(value) => onFieldChange('country', value)}
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </StableSelect>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <StableInput
            type="tel"
            value={address.phone}
            onChange={(value) => onFieldChange('phone', value)}
            placeholder="Phone number"
            refKey={`${type}-phone`}
          />
        </div>
      </div>
    </div>
  );

  // Products Grid View
  const ProductsGridView = () => (
    <div className="space-y-6">
      {/* Products Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
      >
        {[
          { label: 'Total Products', value: products.length, icon: <Inventory />, color: 'blue' },
          { label: 'In Stock', value: products.filter(p => p.stock > 0).length, icon: <CheckCircle />, color: 'green' },
          { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: <Warning />, color: 'red' },
          { label: 'Featured', value: products.filter(p => p.isFeatured).length, icon: <Star />, color: 'yellow' },
          { label: 'Smartphones', value: products.filter(p => p.category === 'smartphones').length, icon: <Smartphone />, color: 'purple' },
          { label: 'Laptops', value: products.filter(p => p.category === 'laptops').length, icon: <Laptop />, color: 'indigo' }
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

      {/* Products Controls */}
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
              <StableInput
                type="text"
                placeholder="Search products by name, description, or brand..."
                value={productSearchTerm}
                onChange={setProductSearchTerm}
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <StableSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <option value="all">All Categories</option>
              {getCategories().filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </StableSelect>

            {/* Sort */}
            <StableSelect
              value={sortProductBy}
              onChange={setSortProductBy}
            >
              {productSortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </StableSelect>

            {/* Refresh Button */}
            <button
              onClick={loadProducts}
              className="px-4 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
            >
              <Refresh />
              Refresh
            </button>

            {/* Add Product Button */}
            <button
              onClick={() => setIsCreateProductModalOpen(true)}
              className="px-4 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
            >
              <Add />
              Add Product
            </button>
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
            Electronic Products ({getFilteredAndSortedProducts().length})
          </h2>
          <div className="text-sm text-gray-600">
            Showing {getFilteredAndSortedProducts().length} of {products.length} products
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : getFilteredAndSortedProducts().length === 0 ? (
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
                setProductSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredAndSortedProducts().map(product => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <ProductCard
                    product={product}
                    onAddToOrder={addProductToOrder}
                    showAddButton={true}
                    showActions={true}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );

  // Orders Grid View
  const OrdersGridView = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
      >
        {[
          { label: 'Total Orders', value: orders.length, icon: <Receipt />, color: 'blue' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: <Schedule />, color: 'yellow' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, icon: <Inventory />, color: 'purple' },
          { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, icon: <LocalShipping />, color: 'green' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: <CheckCircle />, color: 'green' },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, icon: <Cancel />, color: 'red' }
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
              <StableInput
                type="text"
                placeholder="Search orders by number, customer, or phone..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <StableSelect
              value={filterStatus}
              onChange={setFilterStatus}
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </StableSelect>

            {/* Payment Filter */}
            <StableSelect
              value={filterPayment}
              onChange={setFilterPayment}
            >
              {paymentOptions.map(payment => (
                <option key={payment.value} value={payment.value}>
                  {payment.label}
                </option>
              ))}
            </StableSelect>

            {/* Sort */}
            <StableSelect
              value={`${sortField}-${sortDirection}`}
              onChange={(value) => {
                const [field, direction] = value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="total-desc">Amount High-Low</option>
              <option value="total-asc">Amount Low-High</option>
            </StableSelect>

            {/* Create Order Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
            >
              <Add />
              Create Order
            </button>
          </div>
        </div>
      </motion.div>

      {/* Orders Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Orders ({filteredAndSortedOrders.length})
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedOrders.length} of {orders.length} orders
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <Assignment className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPayment('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedOrders.map(order => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-blue-600">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Person className="text-gray-400 text-sm" />
                        <span className="font-semibold text-gray-800">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="text-gray-400 text-sm" />
                        <span>{order.shippingAddress?.phone || 'No phone'}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                      <Chip
                        label={getPaymentLabel(order.paymentStatus)}
                        color={getPaymentColor(order.paymentStatus)}
                        size="small"
                      />
                    </div>

                    {/* Products Preview */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Products:</p>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600">
                            <span className="truncate">{getProductName(item.product)} × {item.quantity}</span>
                            <span>{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-gray-500">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <Tooltip title="View Order Details">
                        <IconButton
                          size="small"
                          onClick={() => setViewOrder(order)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit Order">
                        <IconButton
                          size="small"
                          onClick={() => setEditingOrder(order)}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          onClick={() => setViewOrder(order)}
                          className="text-purple-600 hover:bg-purple-50"
                        >
                          <TrackChanges fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Order">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOrderToDelete(order);
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
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>
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
                <LocalShipping className="text-blue-600 text-2xl md:text-3xl" />
              </div>
              Electronic Products & Orders Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage electronic products, customer orders, track shipments, and process electronic device orders
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateProductModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-green-700 transition-all duration-300 font-semibold"
            >
              <Add />
              Add Product
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
            >
              <Add />
              Create Order
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-200"
      >
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Inventory />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart />
            Orders ({orders.length})
          </button>
        </div>
      </motion.div>

      {/* Content based on active tab */}
      {activeTab === 'products' ? <ProductsGridView /> : <OrdersGridView />}

      {/* Create Product Modal */}
      <Modal
        open={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        maxWidth="6xl"
      >
        <ModalHeader onClose={() => setIsCreateProductModalOpen(false)} gradient="from-green-600 to-green-700">
          Create New Product
        </ModalHeader>
        <ModalContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Inventory />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <StableInput
                      value={newProduct.name}
                      onChange={(value) => handleProductFieldChange('name', value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <StableTextarea
                      value={newProduct.description}
                      onChange={(value) => handleProductFieldChange('description', value)}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                      <StableInput
                        value={newProduct.sku}
                        onChange={(value) => handleProductFieldChange('sku', value)}
                        placeholder="Product SKU"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <StableSelect
                        value={newProduct.category}
                        onChange={(value) => handleProductFieldChange('category', value)}
                      >
                        {productCategories.map(category => (
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </StableSelect>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AttachMoney />
                  Pricing & Inventory
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <StableInput
                      type="number"
                      value={newProduct.price}
                      onChange={(value) => handleProductFieldChange('price', parseFloat(value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price</label>
                    <StableInput
                      type="number"
                      value={newProduct.comparePrice}
                      onChange={(value) => handleProductFieldChange('comparePrice', parseFloat(value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <StableInput
                      type="number"
                      value={newProduct.cost}
                      onChange={(value) => handleProductFieldChange('cost', parseFloat(value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                    <StableInput
                      type="number"
                      value={newProduct.stock}
                      onChange={(value) => handleProductFieldChange('stock', parseInt(value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Brand & Model */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Category />
                  Brand & Model
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <StableInput
                      value={newProduct.brand}
                      onChange={(value) => handleProductFieldChange('brand', value)}
                      placeholder="Brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <StableInput
                      value={newProduct.model}
                      onChange={(value) => handleProductFieldChange('model', value)}
                      placeholder="Model number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications & Features */}
            <div className="space-y-6">
              {/* Specifications */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Storage />
                  Specifications
                </h3>
                <div className="space-y-3">
                  {Object.entries(newProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <StableInput
                        value={key}
                        onChange={(newKey) => {
                          const newSpecs = { ...newProduct.specifications };
                          delete newSpecs[key];
                          newSpecs[newKey] = value;
                          setNewProduct(prev => ({ ...prev, specifications: newSpecs }));
                        }}
                        placeholder="Specification name"
                      />
                      <StableInput
                        value={value}
                        onChange={(newValue) => handleProductSpecificationChange(key, newValue)}
                        placeholder="Value"
                      />
                      <button
                        onClick={() => {
                          const newSpecs = { ...newProduct.specifications };
                          delete newSpecs[key];
                          setNewProduct(prev => ({ ...prev, specifications: newSpecs }));
                        }}
                        className="px-3 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Clear fontSize="small" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleProductSpecificationChange(`spec_${Date.now()}`, '')}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors duration-300"
                  >
                    + Add Specification
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle />
                  Features
                </h3>
                <div className="space-y-3">
                  {newProduct.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <StableInput
                        value={feature}
                        onChange={(value) => handleProductFeatureChange(index, value)}
                        placeholder="Feature description"
                      />
                      <button
                        onClick={() => removeProductFeature(index)}
                        className="px-3 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Clear fontSize="small" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addProductFeature}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors duration-300"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Status & Settings */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings />
                  Status & Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Active Product</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.isActive}
                        onChange={(e) => handleProductFieldChange('isActive', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Available for Purchase</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.isAvailable}
                        onChange={(e) => handleProductFieldChange('isAvailable', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.isFeatured}
                        onChange={(e) => handleProductFieldChange('isFeatured', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsCreateProductModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProduct}
            className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newProduct.name || !newProduct.price || newProduct.stock === undefined}
          >
            Create Product
          </button>
        </ModalActions>
      </Modal>

      {/* The rest of your modals (Create Order, View Order, Edit Order, Delete Order, Products Modal, Delete Product) */}
      {/* ... (Include all the modal components from your original code) */}

      {/* Create Order Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="7xl"
      >
        <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
          Create New Order
        </ModalHeader>
        <ModalContent>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Customer Information & Addresses */}
            <div className="xl:col-span-2 space-y-6">
              {/* Shipping Address */}
              <AddressForm
                address={newOrder.shippingAddress}
                title="Shipping Address"
                type="shipping"
                onFieldChange={(field, value) => handleInputChange(updateShippingAddress, field, value, `shipping-${field}`)}
              />

              {/* Billing Address */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <LocationOn />
                    Billing Address
                  </h3>
                  <button
                    onClick={copyShippingToBilling}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
                  >
                    Same as Shipping
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <StableInput
                      value={newOrder.billingAddress.firstName}
                      onChange={(value) => handleInputChange(updateBillingAddress, 'firstName', value, 'billing-firstName')}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <StableInput
                      value={newOrder.billingAddress.lastName}
                      onChange={(value) => handleInputChange(updateBillingAddress, 'lastName', value, 'billing-lastName')}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                    <StableInput
                      value={newOrder.billingAddress.address1}
                      onChange={(value) => handleInputChange(updateBillingAddress, 'address1', value, 'billing-address1')}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <StableInput
                      value={newOrder.billingAddress.city}
                      onChange={(value) => handleInputChange(updateBillingAddress, 'city', value, 'billing-city')}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <StableSelect
                      value={newOrder.billingAddress.state}
                      onChange={(value) => updateBillingAddress('state', value)}
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </StableSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <StableInput
                      value={newOrder.billingAddress.zip}
                      onChange={(value) => handleInputChange(updateBillingAddress, 'zip', value, 'billing-zip')}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Assignment />
                  Order Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    <StableSelect
                      value={newOrder.status}
                      onChange={(value) => setNewOrder({ ...newOrder, status: value })}
                    >
                      {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </StableSelect>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    <StableSelect
                      value={newOrder.paymentStatus}
                      onChange={(value) => setNewOrder({ ...newOrder, paymentStatus: value })}
                    >
                      {paymentOptions.filter(opt => opt.value !== 'all').map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </StableSelect>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                    <StableInput
                      type="number"
                      value={newOrder.shipping}
                      onChange={(value) => setNewOrder({ ...newOrder, shipping: parseFloat(value) || 0 })}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                    <StableInput
                      type="number"
                      value={newOrder.discount}
                      onChange={(value) => setNewOrder({ ...newOrder, discount: parseFloat(value) || 0 })}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes</label>
                    <StableTextarea
                      value={newOrder.notes}
                      onChange={handleNotesChange}
                      placeholder="Enter any special notes or instructions"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Selection & Order Summary */}
            <div className="space-y-6">
              {/* Products Selection */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Inventory />
                    Add Products
                  </h3>
                  <button
                    onClick={() => setIsProductsModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
                  >
                    Browse All Products
                  </button>
                </div>

                {/* Categorized Products */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {productsLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-gray-200 animate-pulse rounded-xl p-4 h-20"></div>
                    ))
                  ) : (
                    Object.entries(getProductsByCategory()).map(([category, categoryProducts]) => (
                      <CategorySection
                        key={category}
                        category={category}
                        products={categoryProducts}
                        isExpanded={expandedCategories[category] || false}
                        onToggle={toggleCategory}
                        onAddProduct={addProductToOrder}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Selected Products */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt />
                  Selected Products ({newOrder.items.length})
                </h3>
                {newOrder.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products selected</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {newOrder.items.map(item => {
                      const product = getProductDetails(item.product);
                      const productImage = getProductImage(product);
                      
                      return (
                        <div key={item.product} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                          <div className="flex items-center space-x-3">
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Inventory className="text-gray-400 text-sm" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                              {product.brand && (
                                <p className="text-xs text-gray-500">{product.brand}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateProductQuantity(item.product, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateProductQuantity(item.product, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeProductFromOrder(item.product)}
                              className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-300"
                            >
                              <Clear fontSize="small" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      {formatCurrency(newOrder.items.reduce((sum, item) => sum + item.total, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold">
                      {formatCurrency(newOrder.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%):</span>
                    <span className="font-semibold">
                      {formatCurrency(newOrder.items.reduce((sum, item) => sum + item.total, 0) * 0.08)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-red-600">
                      -{formatCurrency(newOrder.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(
                        newOrder.items.reduce((sum, item) => sum + item.total, 0) +
                        newOrder.shipping +
                        (newOrder.items.reduce((sum, item) => sum + item.total, 0) * 0.08) -
                        newOrder.discount
                      )}
                    </span>
                  </div>
                </div>
              </div>
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
            onClick={handleCreateOrder}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !newOrder.shippingAddress.firstName || 
              !newOrder.shippingAddress.lastName || 
              !newOrder.shippingAddress.address1 || 
              !newOrder.shippingAddress.city || 
              !newOrder.shippingAddress.state || 
              !newOrder.shippingAddress.zip || 
              !newOrder.shippingAddress.phone ||
              newOrder.items.length === 0
            }
          >
            Create Order
          </button>
        </ModalActions>
      </Modal>

      {/* Products Modal for Browsing All Products */}
      <Modal
        open={isProductsModalOpen}
        onClose={() => setIsProductsModalOpen(false)}
        maxWidth="6xl"
      >
        <ModalHeader onClose={() => setIsProductsModalOpen(false)} gradient="from-green-600 to-green-700">
          Browse All Products ({getFilteredAndSortedProducts().length})
        </ModalHeader>
        <ModalContent>
          <div className="space-y-6">
            {/* Products Search and Filters */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <StableInput
                      type="text"
                      placeholder="Search products by name, description, or brand..."
                      value={productSearchTerm}
                      onChange={setProductSearchTerm}
                      className="pl-10 pr-4"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <StableSelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  >
                    <option value="all">All Categories</option>
                    {getCategories().filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </StableSelect>
                  <StableSelect
                    value={sortProductBy}
                    onChange={setSortProductBy}
                  >
                    {productSortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </StableSelect>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-4">
              {getFilteredAndSortedProducts().length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <Inventory className="text-gray-400 text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                getFilteredAndSortedProducts().map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToOrder={(product) => {
                      addProductToOrder(product);
                      setIsProductsModalOpen(false);
                    }}
                    showAddButton={true}
                    showActions={false}
                  />
                ))
              )}
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsProductsModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Close
          </button>
          <div className="text-sm text-gray-600">
            Showing {getFilteredAndSortedProducts().length} of {products.length} products
          </div>
        </ModalActions>
      </Modal>

      {/* Delete Confirmation Modal for Products */}
      <Modal
        open={isDeleteProductModalOpen}
        onClose={() => setIsDeleteProductModalOpen(false)}
        maxWidth="sm"
      >
        <div className="bg-red-50 text-red-800 p-6 rounded-t-2xl">
          <h3 className="text-lg font-semibold">Confirm Product Deletion</h3>
        </div>
        <ModalContent>
          <div className="flex items-center space-x-4">
            <Warning className="text-red-600 text-2xl" />
            <div>
              <p className="font-semibold text-gray-800">
                Are you sure you want to delete product "{productToDelete?.name}"?
              </p>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. All product data will be permanently removed.
              </p>
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button
            onClick={() => setIsDeleteProductModalOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteProduct(productToDelete?._id)}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-300"
          >
            Delete Product
          </button>
        </ModalActions>
      </Modal>

      {/* Delete Confirmation Modal for Orders */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="sm"
      >
        <div className="bg-red-50 text-red-800 p-6 rounded-t-2xl">
          <h3 className="text-lg font-semibold">Confirm Order Deletion</h3>
        </div>
        <ModalContent>
          <div className="flex items-center space-x-4">
            <Warning className="text-red-600 text-2xl" />
            <div>
              <p className="font-semibold text-gray-800">
                Are you sure you want to delete order "{orderToDelete?.orderNumber}"?
              </p>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. All order data will be permanently removed.
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
            onClick={() => handleDeleteOrder(orderToDelete?._id)}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-300"
          >
            Delete Order
          </button>
        </ModalActions>
      </Modal>

      {/* View Product Modal */}
      {viewProduct && (
        <Modal
          open={!!viewProduct}
          onClose={() => setViewProduct(null)}
          maxWidth="4xl"
        >
          <ModalHeader onClose={() => setViewProduct(null)} gradient="from-purple-600 to-purple-700">
            Product Details - {viewProduct.name}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images & Basic Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  {getProductImage(viewProduct) ? (
                    <img 
                      src={getProductImage(viewProduct)} 
                      alt={viewProduct.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                      <ImageIcon className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-semibold">{viewProduct.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold">{viewProduct.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold">{viewProduct.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-semibold">{viewProduct.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Chip
                        label={viewProduct.isActive ? 'Active' : 'Inactive'}
                        color={viewProduct.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{viewProduct.name}</h2>
                  <p className="text-gray-600 mb-4">{viewProduct.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-blue-600">{formatCurrency(viewProduct.price)}</span>
                      {viewProduct.comparePrice && viewProduct.comparePrice > viewProduct.price && (
                        <span className="text-lg text-gray-400 line-through">
                          {formatCurrency(viewProduct.comparePrice)}
                        </span>
                      )}
                    </div>
                    {renderRatingStars(viewProduct)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className={`text-lg font-semibold ${viewProduct.stock > 10 ? 'text-green-600' : viewProduct.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {viewProduct.stock}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Cost</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {viewProduct.cost ? formatCurrency(viewProduct.cost) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                {viewProduct.specifications && Object.keys(viewProduct.specifications).length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(viewProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {viewProduct.features && viewProduct.features.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
                    <ul className="space-y-2">
                      {viewProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="text-green-500 mr-2 text-sm" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          maxWidth="4xl"
        >
          <ModalHeader onClose={() => setEditingProduct(null)} gradient="from-green-600 to-green-700">
            Edit Product - {editingProduct.name}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <StableInput
                  value={editingProduct.name}
                  onChange={(value) => setEditingProduct({ ...editingProduct, name: value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <StableInput
                  type="number"
                  value={editingProduct.price}
                  onChange={(value) => setEditingProduct({ ...editingProduct, price: parseFloat(value) || 0 })}
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <StableInput
                  type="number"
                  value={editingProduct.stock}
                  onChange={(value) => setEditingProduct({ ...editingProduct, stock: parseInt(value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <StableSelect
                  value={editingProduct.category}
                  onChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                >
                  {productCategories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </StableSelect>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <StableTextarea
                  value={editingProduct.description}
                  onChange={(value) => setEditingProduct({ ...editingProduct, description: value })}
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Active Product</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isActive}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
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
              onClick={() => handleUpdateProduct(editingProduct._id, {
                name: editingProduct.name,
                price: editingProduct.price,
                stock: editingProduct.stock,
                category: editingProduct.category,
                description: editingProduct.description,
                isActive: editingProduct.isActive
              })}
              className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300"
            >
              Update Product
            </button>
          </ModalActions>
        </Modal>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <Modal
          open={!!viewOrder}
          onClose={() => setViewOrder(null)}
          maxWidth="4xl"
        >
          <ModalHeader onClose={() => setViewOrder(null)} gradient="from-purple-600 to-purple-700">
            Order Details - {viewOrder.orderNumber}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Person />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-semibold text-gray-800">
                        {viewOrder.shippingAddress?.firstName} {viewOrder.shippingAddress?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">{viewOrder.shippingAddress?.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-semibold text-gray-800">
                        {viewOrder.shippingAddress?.address1}
                        {viewOrder.shippingAddress?.address2 && `, ${viewOrder.shippingAddress.address2}`}
                        {`, ${viewOrder.shippingAddress?.city}, ${viewOrder.shippingAddress?.state} ${viewOrder.shippingAddress?.zip}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Inventory />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {viewOrder.items.map((item, index) => {
                      const product = getProductDetails(item.product);
                      const productImage = getProductImage(product);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <div className="flex items-center space-x-3">
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Inventory className="text-blue-600 text-sm" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              {item.variant?.name && (
                                <p className="text-sm text-gray-600">Variant: {item.variant.name} - {item.variant.option}</p>
                              )}
                              {product.brand && (
                                <p className="text-xs text-gray-500">Brand: {product.brand}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{formatCurrency(item.total)}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Notes */}
                {viewOrder.notes && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Assignment />
                      Order Notes
                    </h3>
                    <p className="text-gray-700">{viewOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Status & Actions */}
              <div className="space-y-6">
                {/* Order Status */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Order Status:</span>
                      <Chip
                        label={getStatusLabel(viewOrder.status)}
                        color={getStatusColor(viewOrder.status)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <Chip
                        label={getPaymentLabel(viewOrder.paymentStatus)}
                        color={getPaymentColor(viewOrder.paymentStatus)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Shipping Cost:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(viewOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(viewOrder.discount)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(viewOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold">{formatCurrency(viewOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">{formatCurrency(viewOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(viewOrder.discount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(viewOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateOrderStatus(viewOrder._id, 'processing')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(viewOrder._id, 'shipped')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() => updateOrderStatus(viewOrder._id, 'delivered')}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-300 text-sm font-semibold"
                    >
                      Mark as Delivered
                    </button>
                    <button
                      onClick={() => setEditingOrder(viewOrder)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 text-sm font-semibold"
                    >
                      Edit Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setViewOrder(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                setEditingOrder(viewOrder);
                setViewOrder(null);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors duration-300"
            >
              Edit Order
            </button>
          </ModalActions>
        </Modal>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <Modal
          open={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          maxWidth="2xl"
        >
          <ModalHeader onClose={() => setEditingOrder(null)} gradient="from-green-600 to-green-700">
            Edit Order - {editingOrder.orderNumber}
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <StableSelect
                  value={editingOrder.status}
                  onChange={(value) => setEditingOrder({ ...editingOrder, status: value })}
                >
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </StableSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <StableSelect
                  value={editingOrder.paymentStatus}
                  onChange={(value) => setEditingOrder({ ...editingOrder, paymentStatus: value })}
                >
                  {paymentOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </StableSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                <StableInput
                  type="number"
                  value={editingOrder.shipping}
                  onChange={(value) => setEditingOrder({ ...editingOrder, shipping: parseFloat(value) || 0 })}
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                <StableInput
                  type="number"
                  value={editingOrder.discount}
                  onChange={(value) => setEditingOrder({ ...editingOrder, discount: parseFloat(value) || 0 })}
                  step="0.01"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
                <StableTextarea
                  value={editingOrder.notes}
                  onChange={(value) => setEditingOrder({ ...editingOrder, notes: value })}
                  rows={3}
                />
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <button
              onClick={() => setEditingOrder(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdateOrder(editingOrder._id, {
                status: editingOrder.status,
                paymentStatus: editingOrder.paymentStatus,
                shipping: editingOrder.shipping,
                discount: editingOrder.discount,
                notes: editingOrder.notes,
                total: editingOrder.subtotal + editingOrder.tax + editingOrder.shipping - editingOrder.discount
              })}
              className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-300"
            >
              Update Order
            </button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};