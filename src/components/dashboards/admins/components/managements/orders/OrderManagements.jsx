// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// // components/OrderManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { 
//   Add, 
//   ShoppingCart,
//   Person,
//   LocationOn,
//   Payment,
//   Save,
//   Close,
//   Delete,
//   Edit,
//   Inventory,
//   LocalShipping,
//   Receipt,
//   AttachMoney,
//   CheckCircle,
//   Pending,
//   Cancel,
//   Refresh,
//   Warning,
//   CheckCircleOutline,
//   Error as ErrorIcon
// } from '@mui/icons-material';

// // Create axios instance with better error handling
// const api = axios.create({
//   baseURL: 'https://newsubackend-hdyk.onrender.com',
//   timeout: 8000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Enhanced response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.code === 'ERR_NETWORK') {
//       console.warn('Network error - backend might be down or CORS issue');
//     }
//     return Promise.reject(error);
//   }
// );

// // Success Modal Component
// const SuccessModal = ({ title, message, onClose }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//   >
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       className="bg-white rounded-2xl shadow-xl w-full max-w-md"
//     >
//       <div className="p-6 text-center">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2 }}
//           className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
//         >
//           <CheckCircleOutline className="w-8 h-8 text-green-600" />
//         </motion.div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//         <p className="text-gray-600 mb-6">{message}</p>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={onClose}
//           className="bg-gradient-to-br from-green-500 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg w-full"
//         >
//           Continue
//         </motion.button>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// // Error Modal Component
// const ErrorModal = ({ title, message, onClose }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//   >
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       className="bg-white rounded-2xl shadow-xl w-full max-w-md"
//     >
//       <div className="p-6 text-center">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2 }}
//           className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
//         >
//           <ErrorIcon className="w-8 h-8 text-red-600" />
//         </motion.div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//         <p className="text-gray-600 mb-6">{message}</p>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={onClose}
//           className="bg-gradient-to-br from-red-500 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg w-full"
//         >
//           Try Again
//         </motion.button>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// export const ElectronicOrdersManagement = () => {
//   // Products State
//   const [products, setProducts] = useState([]);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     description: '',
//     sku: '',
//     category: 'smartphones',
//     price: 0,
//     comparePrice: 0,
//     cost: 0,
//     stock: 0,
//     lowStockAlert: 10,
//     brand: '',
//     model: '',
//     images: [],
//     variants: [],
//     tags: [],
//     isActive: true,
//     isDigital: false,
//     isAvailable: true,
//     isFeatured: false,
//     weight: null,
//     dimensions: { length: null, width: null, height: null },
//     specifications: {},
//     features: [],
//     warranty: '',
//     vendor: '',
//     seo: { title: '', description: '', keywords: '' },
//     metadata: {}
//   });

//   // Orders State
//   const [orders, setOrders] = useState([]);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [newOrder, setNewOrder] = useState({
//     user: '',
//     items: [],
//     subtotal: 0,
//     tax: 0,
//     shipping: 0,
//     discount: 0,
//     total: 0,
//     currency: 'USD',
//     status: 'pending',
//     paymentStatus: 'pending',
//     shippingAddress: {
//       firstName: '', lastName: '', company: '',
//       address1: '', address2: '', city: '', state: '', zip: '',
//       country: 'United States', phone: ''
//     },
//     billingAddress: {
//       firstName: '', lastName: '', company: '',
//       address1: '', address2: '', city: '', state: '', zip: '',
//       country: 'United States', phone: ''
//     },
//     notes: '',
//     metadata: {}
//   });

//   // Modal States
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [modalTitle, setModalTitle] = useState('');
  
//   // Loading States
//   const [loading, setLoading] = useState({ products: false, orders: false });
//   const [apiStatus, setApiStatus] = useState({ products: true, orders: true });

//   // Sample data for demonstration
//   const sampleProducts = [
//     {
//       id: '1',
//       name: 'iPhone 15 Pro',
//       description: 'Latest iPhone with advanced camera system',
//       sku: 'IP15P-256',
//       category: 'smartphones',
//       price: 999,
//       comparePrice: 1099,
//       cost: 750,
//       stock: 50,
//       lowStockAlert: 10,
//       brand: 'Apple',
//       model: 'iPhone 15 Pro',
//       isActive: true,
//       isDigital: false,
//       isAvailable: true,
//       isFeatured: true,
//       createdAt: new Date().toISOString()
//     },
//     {
//       id: '2',
//       name: 'Samsung Galaxy S24',
//       description: 'Powerful Android smartphone with AI features',
//       sku: 'SGS24-256',
//       category: 'smartphones',
//       price: 799,
//       comparePrice: 899,
//       cost: 600,
//       stock: 30,
//       lowStockAlert: 10,
//       brand: 'Samsung',
//       model: 'Galaxy S24',
//       isActive: true,
//       isDigital: false,
//       isAvailable: true,
//       isFeatured: false,
//       createdAt: new Date().toISOString()
//     },
//     {
//       id: '3',
//       name: 'MacBook Air M3',
//       description: 'Lightweight laptop with M3 chip',
//       sku: 'MBA-M3-512',
//       category: 'laptops',
//       price: 1299,
//       comparePrice: 1399,
//       cost: 1000,
//       stock: 20,
//       lowStockAlert: 5,
//       brand: 'Apple',
//       model: 'MacBook Air M3',
//       isActive: true,
//       isDigital: false,
//       isAvailable: true,
//       isFeatured: true,
//       createdAt: new Date().toISOString()
//     }
//   ];

//   const sampleOrders = [
//     {
//       id: 'ORD-001',
//       orderNumber: 'ORD-001',
//       user: 'john@example.com',
//       items: [
//         { productId: '1', name: 'iPhone 15 Pro', price: 999, quantity: 1, sku: 'IP15P-256' }
//       ],
//       subtotal: 999,
//       tax: 79.92,
//       shipping: 15,
//       discount: 0,
//       total: 1093.92,
//       currency: 'USD',
//       status: 'completed',
//       paymentStatus: 'paid',
//       shippingAddress: {
//         firstName: 'John',
//         lastName: 'Doe',
//         address1: '123 Main St',
//         city: 'New York',
//         state: 'NY',
//         zip: '10001',
//         country: 'United States',
//         phone: '+1-555-0123'
//       },
//       createdAt: new Date().toISOString()
//     },
//     {
//       id: 'ORD-002',
//       orderNumber: 'ORD-002',
//       user: 'jane@example.com',
//       items: [
//         { productId: '3', name: 'MacBook Air M3', price: 1299, quantity: 1, sku: 'MBA-M3-512' },
//         { productId: '2', name: 'Samsung Galaxy S24', price: 799, quantity: 1, sku: 'SGS24-256' }
//       ],
//       subtotal: 2098,
//       tax: 167.84,
//       shipping: 25,
//       discount: 100,
//       total: 2190.84,
//       currency: 'USD',
//       status: 'processing',
//       paymentStatus: 'pending',
//       shippingAddress: {
//         firstName: 'Jane',
//         lastName: 'Smith',
//         address1: '456 Oak Ave',
//         city: 'Los Angeles',
//         state: 'CA',
//         zip: '90210',
//         country: 'United States',
//         phone: '+1-555-0124'
//       },
//       createdAt: new Date().toISOString()
//     }
//   ];

//   // Modal handlers
//   const showSuccessMessage = (title, message) => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setShowSuccessModal(true);
//   };

//   const showErrorMessage = (title, message) => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setShowErrorModal(true);
//   };

//   // Load data from localStorage with fallback to sample data
//   const loadInitialData = () => {
//     const savedProducts = localStorage.getItem('products');
//     const savedOrders = localStorage.getItem('orders');
    
//     if (savedProducts) {
//       try {
//         const parsedProducts = JSON.parse(savedProducts);
//         setProducts(Array.isArray(parsedProducts) ? parsedProducts : sampleProducts);
//       } catch (error) {
//         setProducts(sampleProducts);
//       }
//     } else {
//       setProducts(sampleProducts);
//     }
    
//     if (savedOrders) {
//       try {
//         const parsedOrders = JSON.parse(savedOrders);
//         setOrders(Array.isArray(parsedOrders) ? parsedOrders : sampleOrders);
//       } catch (error) {
//         setOrders(sampleOrders);
//       }
//     } else {
//       setOrders(sampleOrders);
//     }
//   };

//   // API Functions with comprehensive error handling
//   const fetchProducts = async () => {
//     setLoading(prev => ({ ...prev, products: true }));
    
//     try {
//       const response = await api.get('/products');
//       console.log('Products API response:', response);
      
//       let productsData = [];
//       if (Array.isArray(response.data)) {
//         productsData = response.data;
//       } else if (response.data && Array.isArray(response.data.data)) {
//         productsData = response.data.data;
//       } else if (response.data && Array.isArray(response.data.products)) {
//         productsData = response.data.products;
//       } else if (response.data && typeof response.data === 'object') {
//         productsData = [response.data];
//       }
      
//       if (productsData.length > 0) {
//         setProducts(productsData);
//         localStorage.setItem('products', JSON.stringify(productsData));
//         setApiStatus(prev => ({ ...prev, products: true }));
//         showSuccessMessage('Success', `Loaded ${productsData.length} products from API`);
//       } else {
//         throw new Error('No products data received');
//       }
//     } catch (error) {
//       console.warn('Failed to fetch products from API, using local data:', error.message);
//       setApiStatus(prev => ({ ...prev, products: false }));
//       loadInitialData();
      
//       if (error.code === 'ERR_NETWORK') {
//         showErrorMessage('Connection Issue', 'Backend unavailable. Using local data.');
//       } else if (error.response?.status === 404) {
//         showErrorMessage('API Error', 'Products endpoint not found. Using local data.');
//       } else {
//         showErrorMessage('Warning', 'Using local product data.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, products: false }));
//     }
//   };

//   const fetchOrders = async () => {
//     setLoading(prev => ({ ...prev, orders: true }));
    
//     try {
//       const response = await api.get('/orders');
//       console.log('Orders API response:', response);
      
//       let ordersData = [];
//       if (Array.isArray(response.data)) {
//         ordersData = response.data;
//       } else if (response.data && Array.isArray(response.data.data)) {
//         ordersData = response.data.data;
//       } else if (response.data && Array.isArray(response.data.orders)) {
//         ordersData = response.data.orders;
//       }
      
//       if (ordersData.length > 0) {
//         setOrders(ordersData);
//         localStorage.setItem('orders', JSON.stringify(ordersData));
//         setApiStatus(prev => ({ ...prev, orders: true }));
//         showSuccessMessage('Success', `Loaded ${ordersData.length} orders from API`);
//       } else {
//         throw new Error('No orders data received');
//       }
//     } catch (error) {
//       console.warn('Failed to fetch orders from API, using local data:', error.message);
//       setApiStatus(prev => ({ ...prev, orders: false }));
//       loadInitialData();
      
//       if (error.code === 'ERR_NETWORK') {
//         showErrorMessage('Connection Issue', 'Backend unavailable. Using local data.');
//       } else if (error.response?.status === 404) {
//         showErrorMessage('API Error', 'Orders endpoint not found. Using local data.');
//       } else {
//         showErrorMessage('Warning', 'Using local order data.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, orders: false }));
//     }
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadInitialData();
//     // Try to fetch from API after initial load
//     setTimeout(() => {
//       fetchProducts();
//       fetchOrders();
//     }, 1000);
//   }, []);

//   // Save data to localStorage
//   const saveProducts = (updatedProducts) => {
//     const safeProducts = Array.isArray(updatedProducts) ? updatedProducts : [];
//     setProducts(safeProducts);
//     localStorage.setItem('products', JSON.stringify(safeProducts));
//   };

//   const saveOrders = (updatedOrders) => {
//     const safeOrders = Array.isArray(updatedOrders) ? updatedOrders : [];
//     setOrders(safeOrders);
//     localStorage.setItem('orders', JSON.stringify(safeOrders));
//   };

//   // Product Management Functions
//   const handleCreateProduct = async () => {
//     if (!newProduct.name || !newProduct.sku) {
//       showErrorMessage('Validation Error', 'Product name and SKU are required');
//       return;
//     }

//     try {
//       // Try API first
//       const product = {
//         ...newProduct,
//         createdAt: new Date().toISOString()
//       };

//       if (apiStatus.products) {
//         const response = await api.post('/products', product);
//         const createdProduct = response.data.data || response.data;
//         const updatedProducts = [...products, createdProduct];
//         saveProducts(updatedProducts);
//         showSuccessMessage('Success', 'Product created successfully!');
//       } else {
//         // Local fallback
//         const productWithId = {
//           ...product,
//           id: Date.now().toString()
//         };
//         const updatedProducts = [...products, productWithId];
//         saveProducts(updatedProducts);
//         showSuccessMessage('Success', 'Product created successfully (Local Storage)!');
//       }
      
//       setShowProductModal(false);
//       resetProductForm();
//     } catch (error) {
//       console.error('Error creating product:', error);
//       // Local fallback
//       const productWithId = {
//         ...newProduct,
//         id: Date.now().toString(),
//         createdAt: new Date().toISOString()
//       };
//       const updatedProducts = [...products, productWithId];
//       saveProducts(updatedProducts);
//       setShowProductModal(false);
//       resetProductForm();
//       showSuccessMessage('Success', 'Product created successfully (Local Fallback)!');
//     }
//   };

//   const handleUpdateProduct = async () => {
//     if (!newProduct.name || !newProduct.sku) {
//       showErrorMessage('Validation Error', 'Product name and SKU are required');
//       return;
//     }

//     try {
//       if (apiStatus.products && editingProduct.id) {
//         const response = await api.put(`/products/${editingProduct.id}`, newProduct);
//         const updatedProduct = response.data.data || response.data;
//         const updatedProducts = products.map(p => 
//           p.id === editingProduct.id ? updatedProduct : p
//         );
//         saveProducts(updatedProducts);
//         showSuccessMessage('Success', 'Product updated successfully!');
//       } else {
//         // Local fallback
//         const updatedProducts = products.map(p => 
//           p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
//         );
//         saveProducts(updatedProducts);
//         showSuccessMessage('Success', 'Product updated successfully (Local Storage)!');
//       }
      
//       setShowProductModal(false);
//       setEditingProduct(null);
//       resetProductForm();
//     } catch (error) {
//       console.error('Error updating product:', error);
//       // Local fallback
//       const updatedProducts = products.map(p => 
//         p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
//       );
//       saveProducts(updatedProducts);
//       setShowProductModal(false);
//       setEditingProduct(null);
//       resetProductForm();
//       showSuccessMessage('Success', 'Product updated successfully (Local Fallback)!');
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       if (apiStatus.products) {
//         await api.delete(`/products/${productId}`);
//       }
//       const updatedProducts = products.filter(p => p.id !== productId);
//       saveProducts(updatedProducts);
//       showSuccessMessage('Success', 'Product deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       const updatedProducts = products.filter(p => p.id !== productId);
//       saveProducts(updatedProducts);
//       showSuccessMessage('Success', 'Product deleted successfully (Local)!');
//     }
//   };

//   const resetProductForm = () => {
//     setNewProduct({
//       name: '', description: '', sku: '', category: 'smartphones',
//       price: 0, comparePrice: 0, cost: 0, stock: 0, lowStockAlert: 10,
//       brand: '', model: '', images: [], variants: [], tags: [],
//       isActive: true, isDigital: false, isAvailable: true, isFeatured: false,
//       weight: null, dimensions: { length: null, width: null, height: null },
//       specifications: {}, features: [], warranty: '', vendor: '',
//       seo: { title: '', description: '', keywords: '' }, metadata: {}
//     });
//   };

//   const openEditProductModal = (product) => {
//     setEditingProduct(product);
//     setNewProduct(product);
//     setShowProductModal(true);
//   };

//   const handleProductInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewProduct(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : 
//               type === 'number' ? parseFloat(value) || 0 : value
//     }));
//   };

//   const handleNestedProductInputChange = (section, field, value) => {
//     setNewProduct(prev => ({
//       ...prev,
//       [section]: { ...prev[section], [field]: value }
//     }));
//   };

//   // Order Management Functions
//   const handleCreateOrder = async () => {
//     if (!newOrder.user || newOrder.items.length === 0) {
//       showErrorMessage('Validation Error', 'Customer information and at least one product are required');
//       return;
//     }

//     try {
//       const order = {
//         ...newOrder,
//         orderNumber: `ORD-${Date.now()}`
//       };

//       if (apiStatus.orders) {
//         const response = await api.post('/orders', order);
//         const createdOrder = response.data.data || response.data;
//         const updatedOrders = [...orders, createdOrder];
//         saveOrders(updatedOrders);
//         showSuccessMessage('Success', 'Order created successfully!');
//       } else {
//         // Local fallback
//         const orderWithId = {
//           ...order,
//           id: `ORD-${Date.now()}`,
//           createdAt: new Date().toISOString()
//         };
//         const updatedOrders = [...orders, orderWithId];
//         saveOrders(updatedOrders);
//         showSuccessMessage('Success', 'Order created successfully (Local Storage)!');
//       }
      
//       setShowOrderModal(false);
//       resetOrderForm();
//       setSelectedProducts([]);
//     } catch (error) {
//       console.error('Error creating order:', error);
//       // Local fallback
//       const orderWithId = {
//         ...newOrder,
//         id: `ORD-${Date.now()}`,
//         createdAt: new Date().toISOString(),
//         orderNumber: `ORD-${orders.length + 1}`
//       };
//       const updatedOrders = [...orders, orderWithId];
//       saveOrders(updatedOrders);
//       setShowOrderModal(false);
//       resetOrderForm();
//       setSelectedProducts([]);
//       showSuccessMessage('Success', 'Order created successfully (Local Fallback)!');
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     try {
//       if (apiStatus.orders) {
//         await api.delete(`/orders/${orderId}`);
//       }
//       const updatedOrders = orders.filter(o => o.id !== orderId);
//       saveOrders(updatedOrders);
//       showSuccessMessage('Success', 'Order deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       const updatedOrders = orders.filter(o => o.id !== orderId);
//       saveOrders(updatedOrders);
//       showSuccessMessage('Success', 'Order deleted successfully (Local)!');
//     }
//   };

//   const resetOrderForm = () => {
//     setNewOrder({
//       user: '', items: [], subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0,
//       currency: 'USD', status: 'pending', paymentStatus: 'pending',
//       shippingAddress: {
//         firstName: '', lastName: '', company: '', address1: '', address2: '',
//         city: '', state: '', zip: '', country: 'United States', phone: ''
//       },
//       billingAddress: {
//         firstName: '', lastName: '', company: '', address1: '', address2: '',
//         city: '', state: '', zip: '', country: 'United States', phone: ''
//       },
//       notes: '', metadata: {}
//     });
//   };

//   const handleOrderInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewOrder(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : 
//               type === 'number' ? parseFloat(value) || 0 : value
//     }));
//   };

//   const handleNestedOrderInputChange = (section, field, value) => {
//     setNewOrder(prev => ({
//       ...prev,
//       [section]: { ...prev[section], [field]: value }
//     }));
//   };

//   const addProductToOrder = (product) => {
//     const existingItem = selectedProducts.find(item => item.productId === product.id);
//     let updatedItems;

//     if (existingItem) {
//       updatedItems = selectedProducts.map(item =>
//         item.productId === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     } else {
//       updatedItems = [
//         ...selectedProducts,
//         {
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           quantity: 1,
//           sku: product.sku
//         }
//       ];
//     }

//     setSelectedProducts(updatedItems);

//     const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const total = subtotal + newOrder.tax + newOrder.shipping - newOrder.discount;

//     setNewOrder(prev => ({
//       ...prev,
//       items: updatedItems,
//       subtotal,
//       total
//     }));
//   };

//   const removeProductFromOrder = (productId) => {
//     const updatedItems = selectedProducts.filter(item => item.productId !== productId);
//     setSelectedProducts(updatedItems);

//     const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const total = subtotal + newOrder.tax + newOrder.shipping - newOrder.discount;

//     setNewOrder(prev => ({
//       ...prev,
//       items: updatedItems,
//       subtotal,
//       total
//     }));
//   };

//   const updateProductQuantity = (productId, quantity) => {
//     if (quantity < 1) {
//       removeProductFromOrder(productId);
//       return;
//     }

//     const updatedItems = selectedProducts.map(item =>
//       item.productId === productId ? { ...item, quantity } : item
//     );
//     setSelectedProducts(updatedItems);

//     const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const total = subtotal + newOrder.tax + newOrder.shipping - newOrder.discount;

//     setNewOrder(prev => ({
//       ...prev,
//       items: updatedItems,
//       subtotal,
//       total
//     }));
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed': return 'bg-green-100 text-green-800';
//       case 'processing': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   const getPaymentStatusColor = (status) => {
//     switch (status) {
//       case 'paid': return 'bg-green-100 text-green-800';
//       case 'failed': return 'bg-red-100 text-red-800';
//       default: return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <motion.h1 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold text-gray-800"
//           >
//             Order Management
//           </motion.h1>
//           {(!apiStatus.products || !apiStatus.orders) && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex items-center space-x-2 mt-2 text-amber-600 text-sm"
//             >
//               <Warning className="w-4 h-4" />
//               <span>Using local data - Backend unavailable</span>
//             </motion.div>
//           )}
//         </div>
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => {
//               fetchProducts();
//               fetchOrders();
//             }}
//             disabled={loading.products || loading.orders}
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition-colors disabled:opacity-50"
//           >
//             <Refresh className={`w-5 h-5 ${loading.products || loading.orders ? 'animate-spin' : ''}`} />
//             <span>Refresh</span>
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowProductModal(true)}
//             className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
//           >
//             <Inventory className="w-5 h-5" />
//             <span>Add Product</span>
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowOrderModal(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//           >
//             <Add className="w-5 h-5" />
//             <span>Create Order</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
//             </div>
//             <ShoppingCart className="w-8 h-8 text-blue-600" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending</p>
//               <p className="text-2xl font-bold text-yellow-600">
//                 {orders.filter(o => o.status === 'pending').length}
//               </p>
//             </div>
//             <Pending className="w-8 h-8 text-yellow-600" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Completed</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {orders.filter(o => o.status === 'completed').length}
//               </p>
//             </div>
//             <CheckCircle className="w-8 h-8 text-green-600" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Products</p>
//               <p className="text-2xl font-bold text-purple-600">{products.length}</p>
//             </div>
//             <Inventory className="w-8 h-8 text-purple-600" />
//           </div>
//         </motion.div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Products Section */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-200">
//           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
//               <Inventory className="w-6 h-6" />
//               <span>Products ({products.length})</span>
//               {!apiStatus.products && (
//                 <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Local</span>
//               )}
//             </h2>
//             {loading.products && (
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             )}
//           </div>
//           <div className="p-6 max-h-96 overflow-y-auto">
//             <AnimatePresence>
//               {products.map((product, index) => (
//                 <motion.div
//                   key={product.id || index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex-1">
//                     <h3 className="font-medium text-gray-800">{product.name}</h3>
//                     <p className="text-sm text-gray-600">SKU: {product.sku}</p>
//                     <div className="flex items-center space-x-4 mt-1">
//                       <span className="text-lg font-bold text-blue-600">${product.price}</span>
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         Stock: {product.stock}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => addProductToOrder(product)}
//                       className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
//                       title="Add to Order"
//                     >
//                       <Add className="w-4 h-4" />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => openEditProductModal(product)}
//                       className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleDeleteProduct(product.id)}
//                       className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
//                     >
//                       <Delete className="w-4 h-4" />
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>

//             {products.length === 0 && !loading.products && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-8"
//               >
//                 <Inventory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No products</h3>
//                 <p className="text-gray-500 mb-4">Create your first product to start taking orders.</p>
//                 <button
//                   onClick={() => setShowProductModal(true)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Add Product
//                 </button>
//               </motion.div>
//             )}
//           </div>
//         </div>

//         {/* Orders Section */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-200">
//           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
//               <ShoppingCart className="w-6 h-6" />
//               <span>Recent Orders ({orders.length})</span>
//               {!apiStatus.orders && (
//                 <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Local</span>
//               )}
//             </h2>
//             {loading.orders && (
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             )}
//           </div>
//           <div className="p-6 max-h-96 overflow-y-auto">
//             <AnimatePresence>
//               {orders.map((order, index) => (
//                 <motion.div
//                   key={order.id || index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-colors cursor-pointer"
//                   onClick={() => viewOrderDetails(order)}
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-semibold text-gray-800">{order.orderNumber || `Order #${index + 1}`}</h3>
//                       <p className="text-sm text-gray-600">{order.user}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold text-green-600">${order.total?.toFixed(2)}</p>
//                       <p className="text-xs text-gray-500">
//                         {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'No date'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div className="flex space-x-2">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                         {order.status}
//                       </span>
//                       <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
//                         {order.paymentStatus}
//                       </span>
//                     </div>
//                     <div className="flex space-x-1">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteOrder(order.id);
//                         }}
//                         className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200 transition-colors"
//                       >
//                         <Delete className="w-4 h-4" />
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>

//             {orders.length === 0 && !loading.orders && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-8"
//               >
//                 <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No orders</h3>
//                 <p className="text-gray-500 mb-4">Create your first order to get started.</p>
//                 <button
//                   onClick={() => setShowOrderModal(true)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Create Order
//                 </button>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Success Modal */}
//       <AnimatePresence>
//         {showSuccessModal && (
//           <SuccessModal
//             title={modalTitle}
//             message={modalMessage}
//             onClose={() => setShowSuccessModal(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Error Modal */}
//       <AnimatePresence>
//         {showErrorModal && (
//           <ErrorModal
//             title={modalTitle}
//             message={modalMessage}
//             onClose={() => setShowErrorModal(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Product Modal */}
//       <AnimatePresence>
//         {showProductModal && (
//           <ProductModal
//             newProduct={newProduct}
//             editingProduct={editingProduct}
//             onInputChange={handleProductInputChange}
//             onNestedInputChange={handleNestedProductInputChange}
//             onCreate={handleCreateProduct}
//             onUpdate={handleUpdateProduct}
//             onClose={() => {
//               setShowProductModal(false);
//               setEditingProduct(null);
//               resetProductForm();
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* Order Modal */}
//       <AnimatePresence>
//         {showOrderModal && (
//           <OrderModal
//             newOrder={newOrder}
//             selectedProducts={selectedProducts}
//             products={products}
//             onInputChange={handleOrderInputChange}
//             onNestedInputChange={handleNestedOrderInputChange}
//             onAddProduct={addProductToOrder}
//             onRemoveProduct={removeProductFromOrder}
//             onUpdateQuantity={updateProductQuantity}
//             onCreate={handleCreateOrder}
//             onClose={() => {
//               setShowOrderModal(false);
//               resetOrderForm();
//               setSelectedProducts([]);
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* Order Details Modal */}
//       <AnimatePresence>
//         {showOrderDetails && selectedOrder && (
//           <OrderDetailsModal
//             order={selectedOrder}
//             onClose={() => {
//               setShowOrderDetails(false);
//               setSelectedOrder(null);
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Product Modal Component
// const ProductModal = ({ 
//   newProduct, 
//   editingProduct, 
//   onInputChange, 
//   onNestedInputChange, 
//   onCreate, 
//   onUpdate, 
//   onClose 
// }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//   >
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">
//             {editingProduct ? 'Edit Product' : 'Create Product'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <Close className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Basic Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={newProduct.name}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter product name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 SKU *
//               </label>
//               <input
//                 type="text"
//                 name="sku"
//                 value={newProduct.sku}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter SKU"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={newProduct.description}
//                 onChange={onInputChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter product description"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={newProduct.category}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="smartphones">Smartphones</option>
//                 <option value="laptops">Laptops</option>
//                 <option value="tablets">Tablets</option>
//                 <option value="accessories">Accessories</option>
//               </select>
//             </div>
//           </div>

//           {/* Pricing & Inventory */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h3>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price *
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={newProduct.price}
//                   onChange={onInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compare Price
//                 </label>
//                 <input
//                   type="number"
//                   name="comparePrice"
//                   value={newProduct.comparePrice}
//                   onChange={onInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Cost
//                 </label>
//                 <input
//                   type="number"
//                   name="cost"
//                   value={newProduct.cost}
//                   onChange={onInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Stock *
//                 </label>
//                 <input
//                   type="number"
//                   name="stock"
//                   value={newProduct.stock}
//                   onChange={onInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="0"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Low Stock Alert
//               </label>
//               <input
//                 type="number"
//                 name="lowStockAlert"
//                 value={newProduct.lowStockAlert}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 min="0"
//               />
//             </div>
//           </div>

//           {/* Brand & Model */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">Brand & Model</h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Brand
//               </label>
//               <input
//                 type="text"
//                 name="brand"
//                 value={newProduct.brand}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter brand"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Model
//               </label>
//               <input
//                 type="text"
//                 name="model"
//                 value={newProduct.model}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter model"
//               />
//             </div>
//           </div>

//           {/* Status & Features */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">Status & Features</h3>
            
//             <div className="space-y-2">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={newProduct.isActive}
//                   onChange={onInputChange}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Active</span>
//               </label>

//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isDigital"
//                   checked={newProduct.isDigital}
//                   onChange={onInputChange}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Digital Product</span>
//               </label>

//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isAvailable"
//                   checked={newProduct.isAvailable}
//                   onChange={onInputChange}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Available</span>
//               </label>

//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isFeatured"
//                   checked={newProduct.isFeatured}
//                   onChange={onInputChange}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Featured</span>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={editingProduct ? onUpdate : onCreate}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//           >
//             <Save className="w-4 h-4" />
//             <span>{editingProduct ? 'Update' : 'Create'} Product</span>
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// // Order Modal Component
// const OrderModal = ({
//   newOrder,
//   selectedProducts,
//   products,
//   onInputChange,
//   onNestedInputChange,
//   onAddProduct,
//   onRemoveProduct,
//   onUpdateQuantity,
//   onCreate,
//   onClose
// }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//   >
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <Close className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Customer & Products */}
//           <div className="space-y-6">
//             {/* Customer Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <Person className="w-5 h-5" />
//                 <span>Customer Information</span>
//               </h3>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Customer Name/Email *
//                 </label>
//                 <input
//                   type="text"
//                   name="user"
//                   value={newOrder.user}
//                   onChange={onInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter customer name or email"
//                 />
//               </div>
//             </div>

//             {/* Available Products */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <Inventory className="w-5 h-5" />
//                 <span>Available Products</span>
//               </h3>
              
//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {products.filter(p => p.isActive && p.stock > 0).map(product => (
//                   <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                     <div className="flex-1">
//                       <h4 className="font-medium text-gray-800">{product.name}</h4>
//                       <p className="text-sm text-gray-600">${product.price} • Stock: {product.stock}</p>
//                     </div>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => onAddProduct(product)}
//                       className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
//                     >
//                       Add
//                     </motion.button>
//                   </div>
//                 ))}
                
//                 {products.filter(p => p.isActive && p.stock > 0).length === 0 && (
//                   <p className="text-center text-gray-500 py-4">No available products</p>
//                 )}
//               </div>
//             </div>

//             {/* Selected Products */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <ShoppingCart className="w-5 h-5" />
//                 <span>Selected Products ({selectedProducts.length})</span>
//               </h3>
              
//               <div className="space-y-2">
//                 {selectedProducts.map(item => (
//                   <div key={item.productId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                     <div className="flex-1">
//                       <h4 className="font-medium text-gray-800">{item.name}</h4>
//                       <p className="text-sm text-gray-600">${item.price} each</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="flex items-center space-x-1">
//                         <button
//                           onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
//                           className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
//                         >
//                           -
//                         </button>
//                         <span className="w-8 text-center">{item.quantity}</span>
//                         <button
//                           onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
//                           className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <button
//                         onClick={() => onRemoveProduct(item.productId)}
//                         className="text-red-600 hover:text-red-800 transition-colors ml-2"
//                       >
//                         <Delete className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
                
//                 {selectedProducts.length === 0 && (
//                   <p className="text-center text-gray-500 py-4">No products selected</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Details & Address */}
//           <div className="space-y-6">
//             {/* Order Summary */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <Receipt className="w-5 h-5" />
//                 <span>Order Summary</span>
//               </h3>
              
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Subtotal:</span>
//                   <span>${newOrder.subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Tax:</span>
//                   <span>${newOrder.tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping:</span>
//                   <span>${newOrder.shipping.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Discount:</span>
//                   <span>-${newOrder.discount.toFixed(2)}</span>
//                 </div>
//                 <hr className="my-2" />
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total:</span>
//                   <span>${newOrder.total.toFixed(2)}</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
//                   <input
//                     type="number"
//                     value={newOrder.tax}
//                     onChange={(e) => onInputChange({ target: { name: 'tax', value: parseFloat(e.target.value) || 0 } })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     step="0.01"
//                     min="0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
//                   <input
//                     type="number"
//                     value={newOrder.shipping}
//                     onChange={(e) => onInputChange({ target: { name: 'shipping', value: parseFloat(e.target.value) || 0 } })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     step="0.01"
//                     min="0"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <LocationOn className="w-5 h-5" />
//                 <span>Shipping Address</span>
//               </h3>
              
//               <div className="grid grid-cols-2 gap-3">
//                 <input
//                   type="text"
//                   placeholder="First Name"
//                   value={newOrder.shippingAddress.firstName}
//                   onChange={(e) => onNestedInputChange('shippingAddress', 'firstName', e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Last Name"
//                   value={newOrder.shippingAddress.lastName}
//                   onChange={(e) => onNestedInputChange('shippingAddress', 'lastName', e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Address 1"
//                   value={newOrder.shippingAddress.address1}
//                   onChange={(e) => onNestedInputChange('shippingAddress', 'address1', e.target.value)}
//                   className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={newOrder.shippingAddress.city}
//                   onChange={(e) => onNestedInputChange('shippingAddress', 'city', e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="State"
//                   value={newOrder.shippingAddress.state}
//                   onChange={(e) => onNestedInputChange('shippingAddress', 'state', e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Order Status */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <Payment className="w-5 h-5" />
//                 <span>Order Status</span>
//               </h3>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     name="status"
//                     value={newOrder.status}
//                     onChange={onInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
//                   <select
//                     name="paymentStatus"
//                     value={newOrder.paymentStatus}
//                     onChange={onInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="paid">Paid</option>
//                     <option value="failed">Failed</option>
//                     <option value="refunded">Refunded</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onCreate}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//           >
//             <Save className="w-4 h-4" />
//             <span>Create Order</span>
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// // Order Details Modal Component
// const OrderDetailsModal = ({ order, onClose }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//   >
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Order Details - {order.orderNumber || 'Unknown Order'}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <Close className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
//             <div className="space-y-2">
//               <p><strong>Order ID:</strong> {order.id || 'N/A'}</p>
//               <p><strong>Customer:</strong> {order.user || 'N/A'}</p>
//               <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
//               <p><strong>Status:</strong> 
//                 <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
//                   order.status === 'completed' ? 'bg-green-100 text-green-800' :
//                   order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
//                   order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
//                   order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {order.status || 'unknown'}
//                 </span>
//               </p>
//               <p><strong>Payment Status:</strong> 
//                 <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
//                   order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
//                   order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {order.paymentStatus || 'unknown'}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal:</span>
//                 <span>${(order.subtotal || 0).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tax:</span>
//                 <span>${(order.tax || 0).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping:</span>
//                 <span>${(order.shipping || 0).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Discount:</span>
//                 <span>-${(order.discount || 0).toFixed(2)}</span>
//               </div>
//               <hr className="my-2" />
//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total:</span>
//                 <span>${(order.total || 0).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
//           <div className="space-y-2">
//             {(order.items || []).map((item, index) => (
//               <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex-1">
//                   <h4 className="font-medium text-gray-800">{item.name}</h4>
//                   <p className="text-sm text-gray-600">SKU: {item.sku}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-gray-800">${item.price} x {item.quantity}</p>
//                   <p className="text-sm text-gray-600">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
//                 </div>
//               </div>
//             ))}
//             {(order.items || []).length === 0 && (
//               <p className="text-center text-gray-500 py-4">No items in this order</p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
//               <p>{order.shippingAddress?.address1}</p>
//               {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
//               <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
//               <p>{order.shippingAddress?.country}</p>
//               {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
//               {!order.shippingAddress && <p className="text-gray-500 italic">No shipping address provided</p>}
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               {order.notes ? (
//                 <p className="text-gray-700">{order.notes}</p>
//               ) : (
//                 <p className="text-gray-500 italic">No notes provided</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   </motion.div>
// );


/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// components/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  Add, 
  ShoppingCart,
  Person,
  LocationOn,
  Payment,
  Save,
  Close,
  Delete,
  Edit,
  Inventory,
  LocalShipping,
  Receipt,
  AttachMoney,
  CheckCircle,
  Pending,
  Cancel,
  Refresh,
  Warning,
  CheckCircleOutline,
  Error as ErrorIcon,
  Search,
  Category,
  FilterList
} from '@mui/icons-material';

// Create axios instance with better error handling
const api = axios.create({
  baseURL: 'https://newsubackend-hdyk.onrender.com',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.warn('Network error - backend might be down or CORS issue');
    }
    return Promise.reject(error);
  }
);

// Success Modal Component
const SuccessModal = ({ title, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-md"
    >
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircleOutline className="w-8 h-8 text-green-600" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-gradient-to-br from-green-500 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg w-full font-semibold"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// Error Modal Component
const ErrorModal = ({ title, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-md"
    >
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ErrorIcon className="w-8 h-8 text-red-600" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-gradient-to-br from-red-500 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg w-full font-semibold"
        >
          Try Again
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// Product Selection Modal Component
const ProductSelectionModal = ({ 
  products, 
  onAddProduct, 
  onClose,
  selectedProducts 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'all' || product.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  const isProductSelected = (productId) => {
    return selectedProducts.some(item => item.productId === productId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Select Products</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Close className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Category className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="relative">
              <FilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                  isProductSelected(product.id) 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.sku}</p>
                    <p className="text-xs text-gray-500 capitalize mt-1">{product.category}</p>
                  </div>
                  {isProductSelected(product.id) && (
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} in stock
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddProduct(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isProductSelected(product.id)
                      ? 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg'
                      : product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isProductSelected(product.id) ? 'Added to Order' : 'Add to Order'}
                </motion.button>
              </motion.div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Inventory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gradient-to-br from-gray-600 to-gray-800 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 shadow-lg font-medium"
            >
              Done Selecting
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ElectronicOrdersManagement = () => {
  // Products State
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    dimensions: { length: null, width: null, height: null },
    specifications: {},
    features: [],
    warranty: '',
    vendor: '',
    seo: { title: '', description: '', keywords: '' },
    metadata: {}
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
      firstName: '', lastName: '', company: '',
      address1: '', address2: '', city: '', state: '', zip: '',
      country: 'United States', phone: ''
    },
    billingAddress: {
      firstName: '', lastName: '', company: '',
      address1: '', address2: '', city: '', state: '', zip: '',
      country: 'United States', phone: ''
    },
    notes: '',
    metadata: {}
  });

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  
  // Loading States
  const [loading, setLoading] = useState({ products: false, orders: false });
  const [apiStatus, setApiStatus] = useState({ products: true, orders: true });

  // Sample data for demonstration
  const sampleProducts = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system',
      sku: 'IP15P-256',
      category: 'smartphones',
      price: 999,
      comparePrice: 1099,
      cost: 750,
      stock: 50,
      lowStockAlert: 10,
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      description: 'Powerful Android smartphone with AI features',
      sku: 'SGS24-256',
      category: 'smartphones',
      price: 799,
      comparePrice: 899,
      cost: 600,
      stock: 30,
      lowStockAlert: 10,
      brand: 'Samsung',
      model: 'Galaxy S24',
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      description: 'Lightweight laptop with M3 chip',
      sku: 'MBA-M3-512',
      category: 'laptops',
      price: 1299,
      comparePrice: 1399,
      cost: 1000,
      stock: 20,
      lowStockAlert: 5,
      brand: 'Apple',
      model: 'MacBook Air M3',
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'iPad Pro 12.9"',
      description: 'Professional tablet with M2 chip',
      sku: 'IPADP-129',
      category: 'tablets',
      price: 1099,
      comparePrice: 1199,
      cost: 850,
      stock: 25,
      lowStockAlert: 5,
      brand: 'Apple',
      model: 'iPad Pro',
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Sony WH-1000XM5',
      description: 'Wireless noise-canceling headphones',
      sku: 'SONY-XM5',
      category: 'accessories',
      price: 399,
      comparePrice: 449,
      cost: 300,
      stock: 40,
      lowStockAlert: 10,
      brand: 'Sony',
      model: 'WH-1000XM5',
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Dell XPS 15',
      description: 'Professional laptop for creators',
      sku: 'DELL-XPS15',
      category: 'laptops',
      price: 1899,
      comparePrice: 1999,
      cost: 1500,
      stock: 15,
      lowStockAlert: 5,
      brand: 'Dell',
      model: 'XPS 15',
      isActive: true,
      isDigital: false,
      isAvailable: true,
      isFeatured: false,
      createdAt: new Date().toISOString()
    }
  ];

  const sampleOrders = [
    {
      id: 'ORD-001',
      orderNumber: 'ORD-001',
      user: 'john@example.com',
      items: [
        { productId: '1', name: 'iPhone 15 Pro', price: 999, quantity: 1, sku: 'IP15P-256' }
      ],
      subtotal: 999,
      tax: 79.92,
      shipping: 15,
      discount: 0,
      total: 1093.92,
      currency: 'USD',
      status: 'completed',
      paymentStatus: 'paid',
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        phone: '+1-555-0123'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-002',
      user: 'jane@example.com',
      items: [
        { productId: '3', name: 'MacBook Air M3', price: 1299, quantity: 1, sku: 'MBA-M3-512' },
        { productId: '2', name: 'Samsung Galaxy S24', price: 799, quantity: 1, sku: 'SGS24-256' }
      ],
      subtotal: 2098,
      tax: 167.84,
      shipping: 25,
      discount: 100,
      total: 2190.84,
      currency: 'USD',
      status: 'processing',
      paymentStatus: 'pending',
      shippingAddress: {
        firstName: 'Jane',
        lastName: 'Smith',
        address1: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
        country: 'United States',
        phone: '+1-555-0124'
      },
      createdAt: new Date().toISOString()
    }
  ];

  // Modal handlers
  const showSuccessMessage = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const showErrorMessage = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowErrorModal(true);
  };

  // Load data from localStorage with fallback to sample data
  const loadInitialData = () => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(Array.isArray(parsedProducts) ? parsedProducts : sampleProducts);
      } catch (error) {
        setProducts(sampleProducts);
      }
    } else {
      setProducts(sampleProducts);
    }
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(Array.isArray(parsedOrders) ? parsedOrders : sampleOrders);
      } catch (error) {
        setOrders(sampleOrders);
      }
    } else {
      setOrders(sampleOrders);
    }
  };

  // API Functions with comprehensive error handling
  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    
    try {
      const response = await api.get('/products');
      console.log('Products API response:', response);
      
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response.data && typeof response.data === 'object') {
        productsData = [response.data];
      }
      
      if (productsData.length > 0) {
        setProducts(productsData);
        localStorage.setItem('products', JSON.stringify(productsData));
        setApiStatus(prev => ({ ...prev, products: true }));
        showSuccessMessage('Success', `Loaded ${productsData.length} products from API`);
      } else {
        throw new Error('No products data received');
      }
    } catch (error) {
      console.warn('Failed to fetch products from API, using local data:', error.message);
      setApiStatus(prev => ({ ...prev, products: false }));
      loadInitialData();
      
      if (error.code === 'ERR_NETWORK') {
        showErrorMessage('Connection Issue', 'Backend unavailable. Using local data.');
      } else if (error.response?.status === 404) {
        showErrorMessage('API Error', 'Products endpoint not found. Using local data.');
      } else {
        showErrorMessage('Warning', 'Using local product data.');
      }
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    
    try {
      const response = await api.get('/orders');
      console.log('Orders API response:', response);
      
      let ordersData = [];
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (response.data && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      }
      
      if (ordersData.length > 0) {
        setOrders(ordersData);
        localStorage.setItem('orders', JSON.stringify(ordersData));
        setApiStatus(prev => ({ ...prev, orders: true }));
        showSuccessMessage('Success', `Loaded ${ordersData.length} orders from API`);
      } else {
        throw new Error('No orders data received');
      }
    } catch (error) {
      console.warn('Failed to fetch orders from API, using local data:', error.message);
      setApiStatus(prev => ({ ...prev, orders: false }));
      loadInitialData();
      
      if (error.code === 'ERR_NETWORK') {
        showErrorMessage('Connection Issue', 'Backend unavailable. Using local data.');
      } else if (error.response?.status === 404) {
        showErrorMessage('API Error', 'Orders endpoint not found. Using local data.');
      } else {
        showErrorMessage('Warning', 'Using local order data.');
      }
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
    // Try to fetch from API after initial load
    setTimeout(() => {
      fetchProducts();
      fetchOrders();
    }, 1000);
  }, []);

  // Save data to localStorage
  const saveProducts = (updatedProducts) => {
    const safeProducts = Array.isArray(updatedProducts) ? updatedProducts : [];
    setProducts(safeProducts);
    localStorage.setItem('products', JSON.stringify(safeProducts));
  };

  const saveOrders = (updatedOrders) => {
    const safeOrders = Array.isArray(updatedOrders) ? updatedOrders : [];
    setOrders(safeOrders);
    localStorage.setItem('orders', JSON.stringify(safeOrders));
  };

  // Product Management Functions
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.sku) {
      showErrorMessage('Validation Error', 'Product name and SKU are required');
      return;
    }

    try {
      // Try API first
      const product = {
        ...newProduct,
        createdAt: new Date().toISOString()
      };

      if (apiStatus.products) {
        const response = await api.post('/products', product);
        const createdProduct = response.data.data || response.data;
        const updatedProducts = [...products, createdProduct];
        saveProducts(updatedProducts);
        showSuccessMessage('Success', 'Product created successfully!');
      } else {
        // Local fallback
        const productWithId = {
          ...product,
          id: Date.now().toString()
        };
        const updatedProducts = [...products, productWithId];
        saveProducts(updatedProducts);
        showSuccessMessage('Success', 'Product created successfully (Local Storage)!');
      }
      
      setShowProductModal(false);
      resetProductForm();
    } catch (error) {
      console.error('Error creating product:', error);
      // Local fallback
      const productWithId = {
        ...newProduct,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedProducts = [...products, productWithId];
      saveProducts(updatedProducts);
      setShowProductModal(false);
      resetProductForm();
      showSuccessMessage('Success', 'Product created successfully (Local Fallback)!');
    }
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.sku) {
      showErrorMessage('Validation Error', 'Product name and SKU are required');
      return;
    }

    try {
      if (apiStatus.products && editingProduct.id) {
        const response = await api.put(`/products/${editingProduct.id}`, newProduct);
        const updatedProduct = response.data.data || response.data;
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? updatedProduct : p
        );
        saveProducts(updatedProducts);
        showSuccessMessage('Success', 'Product updated successfully!');
      } else {
        // Local fallback
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
        );
        saveProducts(updatedProducts);
        showSuccessMessage('Success', 'Product updated successfully (Local Storage)!');
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
    } catch (error) {
      console.error('Error updating product:', error);
      // Local fallback
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
      );
      saveProducts(updatedProducts);
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      showSuccessMessage('Success', 'Product updated successfully (Local Fallback)!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (apiStatus.products) {
        await api.delete(`/products/${productId}`);
      }
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
      showSuccessMessage('Success', 'Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
      showSuccessMessage('Success', 'Product deleted successfully (Local)!');
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '', description: '', sku: '', category: 'smartphones',
      price: 0, comparePrice: 0, cost: 0, stock: 0, lowStockAlert: 10,
      brand: '', model: '', images: [], variants: [], tags: [],
      isActive: true, isDigital: false, isAvailable: true, isFeatured: false,
      weight: null, dimensions: { length: null, width: null, height: null },
      specifications: {}, features: [], warranty: '', vendor: '',
      seo: { title: '', description: '', keywords: '' }, metadata: {}
    });
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowProductModal(true);
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleNestedProductInputChange = (section, field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // Order Management Functions
  const handleCreateOrder = async () => {
    if (!newOrder.user || newOrder.items.length === 0) {
      showErrorMessage('Validation Error', 'Customer information and at least one product are required');
      return;
    }

    try {
      const order = {
        ...newOrder,
        orderNumber: `ORD-${Date.now()}`
      };

      if (apiStatus.orders) {
        const response = await api.post('/orders', order);
        const createdOrder = response.data.data || response.data;
        const updatedOrders = [...orders, createdOrder];
        saveOrders(updatedOrders);
        showSuccessMessage('Success', 'Order created successfully!');
      } else {
        // Local fallback
        const orderWithId = {
          ...order,
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        const updatedOrders = [...orders, orderWithId];
        saveOrders(updatedOrders);
        showSuccessMessage('Success', 'Order created successfully (Local Storage)!');
      }
      
      setShowOrderModal(false);
      resetOrderForm();
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error creating order:', error);
      // Local fallback
      const orderWithId = {
        ...newOrder,
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        orderNumber: `ORD-${orders.length + 1}`
      };
      const updatedOrders = [...orders, orderWithId];
      saveOrders(updatedOrders);
      setShowOrderModal(false);
      resetOrderForm();
      setSelectedProducts([]);
      showSuccessMessage('Success', 'Order created successfully (Local Fallback)!');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      if (apiStatus.orders) {
        await api.delete(`/orders/${orderId}`);
      }
      const updatedOrders = orders.filter(o => o.id !== orderId);
      saveOrders(updatedOrders);
      showSuccessMessage('Success', 'Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      const updatedOrders = orders.filter(o => o.id !== orderId);
      saveOrders(updatedOrders);
      showSuccessMessage('Success', 'Order deleted successfully (Local)!');
    }
  };

  const resetOrderForm = () => {
    setNewOrder({
      user: '', items: [], subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0,
      currency: 'USD', status: 'pending', paymentStatus: 'pending',
      shippingAddress: {
        firstName: '', lastName: '', company: '', address1: '', address2: '',
        city: '', state: '', zip: '', country: 'United States', phone: ''
      },
      billingAddress: {
        firstName: '', lastName: '', company: '', address1: '', address2: '',
        city: '', state: '', zip: '', country: 'United States', phone: ''
      },
      notes: '', metadata: {}
    });
  };

  const handleOrderInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleNestedOrderInputChange = (section, field, value) => {
    setNewOrder(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const addProductToOrder = (product) => {
    const existingItem = selectedProducts.find(item => item.productId === product.id);
    let updatedItems;

    if (existingItem) {
      updatedItems = selectedProducts.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedItems = [
        ...selectedProducts,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sku: product.sku
        }
      ];
    }

    setSelectedProducts(updatedItems);

    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + newOrder.tax + newOrder.shipping - newOrder.discount;

    setNewOrder(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total
    }));
  };

  const removeProductFromOrder = (productId) => {
    const updatedItems = selectedProducts.filter(item => item.productId !== productId);
    setSelectedProducts(updatedItems);

    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + newOrder.tax + newOrder.shipping - newOrder.discount;

    setNewOrder(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total
    }));
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeProductFromOrder(productId);
      return;
    }

    const updatedItems = selectedProducts.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setSelectedProducts(updatedItems);

    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + newOrder.tax + newOrder.shipping - newOrder.discount;

    setNewOrder(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800"
          >
            Order Management
          </motion.h1>
          {(!apiStatus.products || !apiStatus.orders) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 mt-2 text-amber-600 text-sm"
            >
              <Warning className="w-4 h-4" />
              <span>Using local data - Backend unavailable</span>
            </motion.div>
          )}
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              fetchProducts();
              fetchOrders();
            }}
            disabled={loading.products || loading.orders}
            className="bg-gradient-to-br from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 font-medium"
          >
            <Refresh className={`w-5 h-5 ${loading.products || loading.orders ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProductModal(true)}
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 shadow-lg font-medium"
          >
            <Inventory className="w-5 h-5" />
            <span>Add Product</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOrderModal(true)}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg font-medium"
          >
            <Add className="w-5 h-5" />
            <span>Create Order</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100">Pending</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <Pending className="w-8 h-8 text-amber-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Completed</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <Inventory className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Inventory className="w-6 h-6" />
              <span>Products ({products.length})</span>
              {!apiStatus.products && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Local</span>
              )}
            </h2>
            {loading.products && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-lg font-bold text-blue-600">${product.price}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addProductToOrder(product)}
                      className="bg-gradient-to-br from-green-500 to-green-700 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
                      title="Add to Order"
                    >
                      <Add className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditProductModal(product)}
                      className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-gradient-to-br from-red-500 to-red-700 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-md"
                    >
                      <Delete className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {products.length === 0 && !loading.products && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Inventory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products</h3>
                <p className="text-gray-500 mb-4">Create your first product to start taking orders.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProductModal(true)}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg font-medium"
                >
                  Add Product
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6" />
              <span>Recent Orders ({orders.length})</span>
              {!apiStatus.orders && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Local</span>
              )}
            </h2>
            {loading.orders && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id || index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => viewOrderDetails(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{order.orderNumber || `Order #${index + 1}`}</h3>
                      <p className="text-sm text-gray-600">{order.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${order.total?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order.id);
                        }}
                        className="bg-gradient-to-br from-red-500 to-red-700 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-md"
                      >
                        <Delete className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {orders.length === 0 && !loading.orders && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders</h3>
                <p className="text-gray-500 mb-4">Create your first order to get started.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOrderModal(true)}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg font-medium"
                >
                  Create Order
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            title={modalTitle}
            message={modalMessage}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <ErrorModal
            title={modalTitle}
            message={modalMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <ProductModal
            newProduct={newProduct}
            editingProduct={editingProduct}
            onInputChange={handleProductInputChange}
            onNestedInputChange={handleNestedProductInputChange}
            onCreate={handleCreateProduct}
            onUpdate={handleUpdateProduct}
            onClose={() => {
              setShowProductModal(false);
              setEditingProduct(null);
              resetProductForm();
            }}
          />
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <OrderModal
            newOrder={newOrder}
            selectedProducts={selectedProducts}
            products={products}
            onInputChange={handleOrderInputChange}
            onNestedInputChange={handleNestedOrderInputChange}
            onAddProduct={addProductToOrder}
            onRemoveProduct={removeProductFromOrder}
            onUpdateQuantity={updateProductQuantity}
            onCreate={handleCreateOrder}
            onClose={() => {
              setShowOrderModal(false);
              resetOrderForm();
              setSelectedProducts([]);
            }}
            onShowProductSelection={() => setShowProductSelection(true)}
          />
        )}
      </AnimatePresence>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {showProductSelection && (
          <ProductSelectionModal
            products={products}
            onAddProduct={addProductToOrder}
            onClose={() => setShowProductSelection(false)}
            selectedProducts={selectedProducts}
          />
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderDetails(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ 
  newProduct, 
  editingProduct, 
  onInputChange, 
  onNestedInputChange, 
  onCreate, 
  onUpdate, 
  onClose 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={newProduct.sku}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SKU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={onInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={newProduct.category}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="tablets">Tablets</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compare Price
                </label>
                <input
                  type="number"
                  name="comparePrice"
                  value={newProduct.comparePrice}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost
                </label>
                <input
                  type="number"
                  name="cost"
                  value={newProduct.cost}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Alert
              </label>
              <input
                type="number"
                name="lowStockAlert"
                value={newProduct.lowStockAlert}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* Brand & Model */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Brand & Model</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={newProduct.brand}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={newProduct.model}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter model"
              />
            </div>
          </div>

          {/* Status & Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Status & Features</h3>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newProduct.isActive}
                  onChange={onInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDigital"
                  checked={newProduct.isDigital}
                  onChange={onInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Digital Product</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={newProduct.isAvailable}
                  onChange={onInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={newProduct.isFeatured}
                  onChange={onInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gradient-to-br from-gray-500 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={editingProduct ? onUpdate : onCreate}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg font-medium"
          >
            <Save className="w-4 h-4" />
            <span>{editingProduct ? 'Update' : 'Create'} Product</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Order Modal Component
const OrderModal = ({
  newOrder,
  selectedProducts,
  products,
  onInputChange,
  onNestedInputChange,
  onAddProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onCreate,
  onClose,
  onShowProductSelection
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer & Products */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Person className="w-5 h-5" />
                <span>Customer Information</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name/Email *
                </label>
                <input
                  type="text"
                  name="user"
                  value={newOrder.user}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name or email"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Inventory className="w-5 h-5" />
                  <span>Product Selection</span>
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShowProductSelection}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg text-sm font-medium"
                >
                  Browse Products
                </motion.button>
              </div>
              
              <div className="space-y-2">
                {selectedProducts.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded flex items-center justify-center hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-md"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-700 text-white rounded flex items-center justify-center hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveProduct(item.productId)}
                        className="text-red-600 hover:text-red-800 transition-colors ml-2"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {selectedProducts.length === 0 && (
                  <div className="text-center py-6">
                    <Inventory className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products selected yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Browse Products" to add items</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Details & Address */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Order Summary</span>
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${newOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${newOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${newOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${newOrder.discount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${newOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                  <input
                    type="number"
                    value={newOrder.tax}
                    onChange={(e) => onInputChange({ target: { name: 'tax', value: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
                  <input
                    type="number"
                    value={newOrder.shipping}
                    onChange={(e) => onInputChange({ target: { name: 'shipping', value: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <LocationOn className="w-5 h-5" />
                <span>Shipping Address</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newOrder.shippingAddress.firstName}
                  onChange={(e) => onNestedInputChange('shippingAddress', 'firstName', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newOrder.shippingAddress.lastName}
                  onChange={(e) => onNestedInputChange('shippingAddress', 'lastName', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address 1"
                  value={newOrder.shippingAddress.address1}
                  onChange={(e) => onNestedInputChange('shippingAddress', 'address1', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newOrder.shippingAddress.city}
                  onChange={(e) => onNestedInputChange('shippingAddress', 'city', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newOrder.shippingAddress.state}
                  onChange={(e) => onNestedInputChange('shippingAddress', 'state', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Payment className="w-5 h-5" />
                <span>Order Status</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newOrder.status}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={newOrder.paymentStatus}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gradient-to-br from-gray-500 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreate}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg font-medium"
          >
            <Save className="w-4 h-4" />
            <span>Create Order</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Order Details - {order.orderNumber || 'Unknown Order'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {order.id || 'N/A'}</p>
              <p><strong>Customer:</strong> {order.user || 'N/A'}</p>
              <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status || 'unknown'}
                </span>
              </p>
              <p><strong>Payment Status:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus || 'unknown'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(order.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${(order.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${(order.discount || 0).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
          <div className="space-y-2">
            {(order.items || []).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${item.price} x {item.quantity}</p>
                  <p className="text-sm text-gray-600">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                </div>
              </div>
            ))}
            {(order.items || []).length === 0 && (
              <p className="text-center text-gray-500 py-4">No items in this order</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
              <p>{order.shippingAddress?.address1}</p>
              {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
              {!order.shippingAddress && <p className="text-gray-500 italic">No shipping address provided</p>}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {order.notes ? (
                <p className="text-gray-700">{order.notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);