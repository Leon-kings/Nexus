// /* eslint-disable no-unused-vars */
// // components/TestimonyDashboard.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   Add,
//   Edit,
//   Delete,
//   Search,
//   FilterList,
//   Refresh,
//   Close,
//   CheckCircle,
//   Error as ErrorIcon,
//   Warning
// } from '@mui/icons-material';
// import axios from 'axios';

// export const TestimonyDashboard = () => {
//   // States for data
//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredTestimonials, setFilteredTestimonials] = useState([]);

//   // Modal states
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);

//   // Form and selection states
//   const [selectedTestimony, setSelectedTestimony] = useState(null);
//   const [modalMessage, setModalMessage] = useState('');
//   const [actionType, setActionType] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     position: '',
//     quote: '',
//     image: null
//   });
//   const [previewImage, setPreviewImage] = useState('');
//   const [formLoading, setFormLoading] = useState(false);

//   // Refs for form inputs to maintain focus
//   const nameInputRef = useRef(null);
//   const positionInputRef = useRef(null);
//   const quoteInputRef = useRef(null);

//   // API base URL
//   const API_BASE_URL = 'https://nexusbackend-hdyk.onrender.com';

//   // Initialize axios
//   useEffect(() => {
//     axios.defaults.baseURL = API_BASE_URL;
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     fetchTestimonials();
//   }, []);

//   // Filter testimonials based on search
//   useEffect(() => {
//     const filtered = testimonials.filter(testimonial =>
//       testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       testimonial.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       testimonial.quote?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredTestimonials(filtered);
//   }, [searchTerm, testimonials]);

//   // Focus on first input when modal opens
//   useEffect(() => {
//     if ((showCreateModal || showEditModal) && nameInputRef.current) {
//       // Small timeout to ensure modal is fully rendered
//       setTimeout(() => {
//         nameInputRef.current?.focus();
//       }, 100);
//     }
//   }, [showCreateModal, showEditModal]);

//   // Fetch all testimonials
//   const fetchTestimonials = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching testimonials from:', `${API_BASE_URL}/testimonials`);
//       const response = await axios.get(`${API_BASE_URL}/testimonials`);
//       // console.log('API Response:', response.data);
      
//       if (response.data.testimonials?.success) {
//         setTestimonials(response.data.testimonials || []);
//         toast.success('Testimonials loaded successfully');
//       } else {
//         toast.error('Failed to load testimonials');
//       }
//     } catch (error) {
//       console.error('Error fetching testimonials:', error);
//       toast.error(`Failed to fetch testimonials: ${error.message}`);
      

//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form input changes - FIXED: Properly handle input without losing cursor
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle image selection
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         showError('Please select a valid image file (JPEG, PNG, etc.)');
//         return;
//       }
      
//       // Validate file size (5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         showError('Image size should be less than 5MB');
//         return;
//       }

//       setFormData(prev => ({ ...prev, image: file }));
//       try {
//         setPreviewImage(URL.createObjectURL(file));
//       } catch (err) {
//         setPreviewImage('');
//       }
//     }
//   };

//   // Show error modal
//   const showError = (message) => {
//     setModalMessage(message);
//     setShowErrorModal(true);
//     setShowSuccessModal(false); // Ensure success modal is closed
//   };

//   // Show success modal
//   const showSuccess = (message) => {
//     setModalMessage(message);
//     setShowSuccessModal(true);
//     setShowErrorModal(false); // Ensure error modal is closed
//   };

//   // Reset form data
//   const resetForm = () => {
//     setFormData({
//       name: '',
//       position: '',
//       quote: '',
//       image: null
//     });
//     setPreviewImage('');
//     setSelectedTestimony(null);
//   };

//   // Open create modal
//   const openCreateModal = () => {
//     console.log('Opening create modal');
//     resetForm();
//     setShowCreateModal(true);
//   };

//   // Open edit modal
//   const openEditModal = (testimonial) => {
//     console.log('Opening edit modal for:', testimonial);
//     setSelectedTestimony(testimonial);
//     setFormData({
//       name: testimonial.name,
//       position: testimonial.position,
//       quote: testimonial.quote,
//       image: null
//     });
//     setPreviewImage(testimonial.image?.url);
//     setShowEditModal(true);
//   };

//   // Close modals properly
//   const closeCreateModal = () => {
//     setShowCreateModal(false);
//     resetForm();
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     resetForm();
//   };

//   // Open delete confirmation modal
//   const openDeleteModal = (testimonial) => {
//     console.log('Opening delete modal for:', testimonial);
//     setSelectedTestimony(testimonial);
//     setModalMessage(`Are you sure you want to delete testimonial from ${testimonial.name}? This action cannot be undone.`);
//     setShowDeleteModal(true);
//   };

//   // Handle form submission (create/update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Form submission started');
//     setFormLoading(true);

//     // Close any existing modals
//     setShowSuccessModal(false);
//     setShowErrorModal(false);

//     try {
//       const submitData = new FormData();
//       submitData.append('name', formData.name);
//       submitData.append('position', formData.position);
//       submitData.append('quote', formData.quote);
      
//       if (formData.image) {
//         submitData.append('image', formData.image);
//       }

//       console.log('Form data:', {
//         name: formData.name,
//         position: formData.position,
//         quote: formData.quote,
//         hasImage: !!formData.image
//       });

//       let response;
//       if (selectedTestimony) {
//         // Update existing testimonial
//         console.log('Updating testimonial:', selectedTestimony._id);
//         response = await axios.put(`${API_BASE_URL}/testimonials/${selectedTestimony._id}`, submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       } else {
//         // Create new testimonial
//         console.log('Creating new testimonial');
//         if (!formData.image) {
//           showError('Please select an image');
//           setFormLoading(false);
//           return;
//         }
//         response = await axios.post(`${API_BASE_URL}/testimonials`, submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }

//       console.log('API Response:', response.data);

//       if (response.data?.success) {
//         await fetchTestimonials();
//         const successMessage = selectedTestimony ? 'Testimonial updated successfully!' : 'Testimonial created successfully!';
//         showSuccess(successMessage);
//         setShowCreateModal(false);
//         setShowEditModal(false);
//         resetForm();
//       } else {
//         const errorMessage = response.data?.message || 'Operation failed';
//         showError(errorMessage);
//       }
//     } catch (error) {
//       console.error('Error submitting testimonial:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to save testimonial';
//       showError(errorMessage);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Handle delete confirmation
//   const handleDelete = async () => {
//     try {
//       console.log('Deleting testimonial:', selectedTestimony?._id);
//       const response = await axios.delete(`${API_BASE_URL}/testimonials/${selectedTestimony._id}`);
      
//       if (response.data?.success) {
//         await fetchTestimonials();
//         showSuccess('Testimonial deleted successfully!');
//         setShowDeleteModal(false);
//       } else {
//         showError(response.data?.message || 'Delete failed');
//       }
//     } catch (error) {
//       console.error('Error deleting testimonial:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to delete testimonial';
//       showError(errorMessage);
//     }
//   };

//   // Common Modal Component (only this component performs the visibility check)
//   const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
//     if (!isOpen) return null;

//     const sizeClasses = {
//       sm: 'max-w-md',
//       md: 'max-w-2xl',
//       lg: 'max-w-4xl',
//       xl: 'max-w-6xl'
//     };

//     // Use flex centering and high z-index so modal panel is visible above overlay
//     return (
//       <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 bg-gray-700 bg-opacity-60"
//           onClick={onClose}
//         ></div>

//         {/* Modal panel */}
//         <div className={`relative w-full ${sizeClasses[size]} mx-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
//           {children}
//         </div>
//       </div>
//     );
//   };

//   // Create/Edit Form Modal
//   const TestimonyFormModal = ({ isOpen, onClose, isEdit = false }) => {
//     // NOTE: visibility is handled by Modal above — DO NOT return null here
//     return (
//       <Modal isOpen={isOpen} onClose={onClose} size="lg">
//         <div className="bg-white rounded-2xl">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-900">
//               {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
//             </h3>
//             <button
//               onClick={onClose}
//               className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
//               type="button"
//             >
//               <Close />
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               {/* Name Field */}
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Name *
//                 </label>
//                 <input
//                   ref={nameInputRef}
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   placeholder="Enter full name"
//                 />
//               </div>

//               {/* Position Field */}
//               <div>
//                 <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
//                   Position *
//                 </label>
//                 <input
//                   ref={positionInputRef}
//                   type="text"
//                   id="position"
//                   name="position"
//                   value={formData.position}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   placeholder="Enter position"
//                 />
//               </div>
//             </div>

//             {/* Quote Field */}
//             <div>
//               <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-2">
//                 Quote *
//               </label>
//               <textarea
//                 ref={quoteInputRef}
//                 id="quote"
//                 name="quote"
//                 value={formData.quote}
//                 onChange={handleInputChange}
//                 required
//                 rows="4"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//                 placeholder="Enter testimonial quote"
//               />
//             </div>

//             {/* Image Upload */}
//             <div>
//               <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
//                 Image {!isEdit && '*'}
//               </label>
//               <div className="flex flex-col sm:flex-row gap-4 items-start">
//                 <input
//                   type="file"
//                   id="image"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//                 {previewImage && (
//                   <div className="flex-shrink-0">
//                     <img
//                       src={previewImage}
//                       alt="Preview"
//                       className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
//                       onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
//                     />
//                   </div>
//                 )}
//               </div>
//               <p className="mt-1 text-sm text-gray-500">
//                 {isEdit ? 'Select new image to replace current one' : 'Upload a profile image (max 5MB)'}
//               </p>
//             </div>

//             {/* Form Actions */}
//             <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={formLoading}
//                 className="flex-1 px-6 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={formLoading}
//                 className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//               >
//                 {formLoading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     {isEdit ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     {isEdit ? 'Update Testimonial' : 'Create Testimonial'}
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     );
//   };

//   // Delete Confirmation Modal
//   const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
//     // NOTE: visibility handled by Modal -> do not short-circuit here
//     return (
//       <Modal isOpen={isOpen} onClose={onClose} size="sm">
//         <div className="bg-white rounded-2xl p-6">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="flex-shrink-0">
//               <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
//                 <Warning className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
//               <p className="text-gray-600 mt-1">{modalMessage}</p>
//             </div>
//           </div>

//           <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
//               type="button"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//               type="button"
//             >
//               <Delete className="w-5 h-5" />
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     );
//   };

//   // Success Modal
//   const SuccessModal = ({ isOpen, onClose, message }) => {
//     // NOTE: visibility handled by Modal -> do not short-circuit here
//     return (
//       <Modal isOpen={isOpen} onClose={onClose} size="sm">
//         <div className="bg-white rounded-2xl p-6 text-center">
//           <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//           </div>
          
//           <h3 className="text-xl font-semibold text-green-600 mb-2">
//             Success!
//           </h3>
          
//           <p className="text-gray-600 mb-6">
//             {message}
//           </p>

//           <button
//             onClick={onClose}
//             className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//             type="button"
//           >
//             Continue
//           </button>
//         </div>
//       </Modal>
//     );
//   };

//   // Error Modal
//   const ErrorModal = ({ isOpen, onClose, message }) => {
//     // NOTE: visibility handled by Modal -> do not short-circuit here
//     return (
//       <Modal isOpen={isOpen} onClose={onClose} size="sm">
//         <div className="bg-white rounded-2xl p-6 text-center">
//           <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <ErrorIcon className="w-8 h-8 text-red-600" />
//           </div>
          
//           <h3 className="text-xl font-semibold text-red-600 mb-2">
//             Error!
//           </h3>
          
//           <p className="text-gray-600 mb-6">
//             {message}
//           </p>

//           <button
//             onClick={onClose}
//             className="w-full px-6 py-3 text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//             type="button"
//           >
//             Try Again
//           </button>
//         </div>
//       </Modal>
//     );
//   };

//   // Loading Skeleton
//   const LoadingSkeleton = () => (
//     <div className="space-y-4">
//       {[...Array(3)].map((_, index) => (
//         <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
//           <div className="flex items-start space-x-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
//             <div className="flex-1 space-y-3">
//               <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
//               <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
//               <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
//               <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Testimonials Management
//               </h1>
//               <p className="text-gray-600 mt-2">Manage and organize customer testimonials</p>
//             </div>
            
//             <button
//               onClick={openCreateModal}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-start lg:self-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//               type="button"
//             >
//               <Add className="w-5 h-5" />
//               <span className="font-semibold">Add Testimonial</span>
//             </button>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             {/* Search Input */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search testimonials by name, position, or quote..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
//               />
//             </div>
            
//             {/* Action Buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={fetchTestimonials}
//                 className="p-3 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
//                 title="Refresh"
//                 type="button"
//               >
//                 <Refresh className="w-5 h-5" />
//               </button>
//               <button
//                 className="p-3 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
//                 title="Filters"
//                 type="button"
//               >
//                 <FilterList className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Testimonials Grid */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           {/* Header Stats */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">
//               All Testimonials ({filteredTestimonials.length})
//             </h2>
//             {searchTerm && (
//               <p className="text-sm text-gray-600">
//                 Showing results for "{searchTerm}"
//               </p>
//             )}
//           </div>

//           {/* Testimonials List */}
//           {loading ? (
//             <LoadingSkeleton />
//           ) : filteredTestimonials.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Search className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 {searchTerm ? 'No testimonials found' : 'No testimonials yet'}
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {searchTerm 
//                   ? 'Try adjusting your search terms' 
//                   : 'Get started by adding your first testimonial'
//                 }
//               </p>
//               {!searchTerm && (
//                 <button
//                   onClick={openCreateModal}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                   type="button"
//                 >
//                   <Add className="w-5 h-5" />
//                   Add First Testimonial
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//               {filteredTestimonials.map((testimonial) => (
//                 <div
//                   key={testimonial._id}
//                   className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//                 >
//                   <div className="flex items-start space-x-4">
//                     <img
//                       src={testimonial.image?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
//                       alt={testimonial.name}
//                       className="w-16 h-16 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 shadow-sm"
//                       onError={(e) => {
//                         e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
//                       }}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 truncate">
//                         {testimonial.name}
//                       </h3>
//                       <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium truncate">
//                         {testimonial.position}
//                       </p>
//                       <p className="text-gray-600 text-sm mt-2 line-clamp-3">
//                         "{testimonial.quote}"
//                       </p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : ''}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {/* Action Buttons */}
//                   <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
//                     <button
//                       onClick={() => openEditModal(testimonial)}
//                       className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
//                       type="button"
//                     >
//                       <Edit className="w-4 h-4" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => openDeleteModal(testimonial)}
//                       className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
//                       type="button"
//                     >
//                       <Delete className="w-4 h-4" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       <TestimonyFormModal
//         isOpen={showCreateModal}
//         onClose={closeCreateModal}
//         isEdit={false}
//       />

//       <TestimonyFormModal
//         isOpen={showEditModal}
//         onClose={closeEditModal}
//         isEdit={true}
//       />

//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//       />

//       <SuccessModal
//         isOpen={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         message={modalMessage}
//       />

//       <ErrorModal
//         isOpen={showErrorModal}
//         onClose={() => setShowErrorModal(false)}
//         message={modalMessage}
//       />
//     </div>
//   );
// };


/* eslint-disable no-unused-vars */
// components/TestimonyDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Refresh,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  Warning
} from '@mui/icons-material';
import axios from 'axios';

export const TestimonyDashboard = () => {
  // States for data
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Form and selection states
  const [selectedTestimony, setSelectedTestimony] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [actionType, setActionType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    quote: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Refs for form inputs to maintain focus
  const nameInputRef = useRef(null);
  const positionInputRef = useRef(null);
  const quoteInputRef = useRef(null);

  // API base URL
  const API_BASE_URL = 'https://nexusbackend-hdyk.onrender.com';

  // Initialize axios
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchTestimonials();
  }, []);

  // Filter testimonials based on search
  useEffect(() => {
    const filtered = testimonials.filter(testimonial =>
      testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.quote?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTestimonials(filtered);
  }, [searchTerm, testimonials]);

  // Focus on first input when modal opens
  useEffect(() => {
    if ((showCreateModal || showEditModal) && nameInputRef.current) {
      // Small timeout to ensure modal is fully rendered
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [showCreateModal, showEditModal]);

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      console.log('Fetching testimonials from:', `${API_BASE_URL}/testimonials`);
      const response = await axios.get(`${API_BASE_URL}/testimonials`);
      console.log('API Response:', response.data);
      
      // Updated to match the new API response structure
      if (response.data && response.data.success) {
        setTestimonials(response.data.testimonials || []);
        toast.success('Testimonials loaded successfully');
      } else {
        toast.error('Failed to load testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error(`Failed to fetch testimonials: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes - FIXED: Properly handle input without losing cursor
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      try {
        setPreviewImage(URL.createObjectURL(file));
      } catch (err) {
        setPreviewImage('');
      }
    }
  };

  // Show error modal
  const showError = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
    setShowSuccessModal(false); // Ensure success modal is closed
  };

  // Show success modal
  const showSuccess = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
    setShowErrorModal(false); // Ensure error modal is closed
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      quote: '',
      image: null
    });
    setPreviewImage('');
    setSelectedTestimony(null);
  };

  // Open create modal
  const openCreateModal = () => {
    console.log('Opening create modal');
    resetForm();
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (testimonial) => {
    console.log('Opening edit modal for:', testimonial);
    setSelectedTestimony(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      quote: testimonial.quote,
      image: null
    });
    setPreviewImage(testimonial.image?.url);
    setShowEditModal(true);
  };

  // Close modals properly
  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  // Open delete confirmation modal
  const openDeleteModal = (testimonial) => {
    console.log('Opening delete modal for:', testimonial);
    setSelectedTestimony(testimonial);
    setModalMessage(`Are you sure you want to delete testimonial from ${testimonial.name}? This action cannot be undone.`);
    setShowDeleteModal(true);
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    setFormLoading(true);

    // Close any existing modals
    setShowSuccessModal(false);
    setShowErrorModal(false);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('position', formData.position);
      submitData.append('quote', formData.quote);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      console.log('Form data:', {
        name: formData.name,
        position: formData.position,
        quote: formData.quote,
        hasImage: !!formData.image
      });

      let response;
      if (selectedTestimony) {
        // Update existing testimonial
        console.log('Updating testimonial:', selectedTestimony._id);
        response = await axios.put(`${API_BASE_URL}/testimonials/${selectedTestimony._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new testimonial
        console.log('Creating new testimonial');
        if (!formData.image) {
          showError('Please select an image');
          setFormLoading(false);
          return;
        }
        response = await axios.post(`${API_BASE_URL}/testimonials`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      console.log('API Response:', response.data);

      if (response.data?.success) {
        await fetchTestimonials();
        const successMessage = selectedTestimony ? 'Testimonial updated successfully!' : 'Testimonial created successfully!';
        showSuccess(successMessage);
        setShowCreateModal(false);
        setShowEditModal(false);
        resetForm();
      } else {
        const errorMessage = response.data?.message || 'Operation failed';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save testimonial';
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      console.log('Deleting testimonial:', selectedTestimony?._id);
      const response = await axios.delete(`${API_BASE_URL}/testimonials/${selectedTestimony._id}`);
      
      if (response.data?.success) {
        await fetchTestimonials();
        showSuccess('Testimonial deleted successfully!');
        setShowDeleteModal(false);
      } else {
        showError(response.data?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete testimonial';
      showError(errorMessage);
    }
  };

  // Common Modal Component (only this component performs the visibility check)
  const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl'
    };

    // Use flex centering and high z-index so modal panel is visible above overlay
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-60"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className={`relative w-full ${sizeClasses[size]} mx-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
          {children}
        </div>
      </div>
    );
  };

  // Create/Edit Form Modal
  const TestimonyFormModal = ({ isOpen, onClose, isEdit = false }) => {
    // NOTE: visibility is handled by Modal above — DO NOT return null here
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="bg-white rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
              type="button"
            >
              <Close />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              {/* Position Field */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  ref={positionInputRef}
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter position"
                />
              </div>
            </div>

            {/* Quote Field */}
            <div>
              <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-2">
                Quote *
              </label>
              <textarea
                ref={quoteInputRef}
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Enter testimonial quote"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image {!isEdit && '*'}
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {previewImage && (
                  <div className="flex-shrink-0">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                    />
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {isEdit ? 'Select new image to replace current one' : 'Upload a profile image (max 5MB)'}
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={formLoading}
                className="flex-1 px-6 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                {formLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isEdit ? 'Update Testimonial' : 'Create Testimonial'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    // NOTE: visibility handled by Modal -> do not short-circuit here
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Warning className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <p className="text-gray-600 mt-1">{modalMessage}</p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              type="button"
            >
              <Delete className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Success Modal
  const SuccessModal = ({ isOpen, onClose, message }) => {
    // NOTE: visibility handled by Modal -> do not short-circuit here
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            Success!
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            type="button"
          >
            Continue
          </button>
        </div>
      </Modal>
    );
  };

  // Error Modal
  const ErrorModal = ({ isOpen, onClose, message }) => {
    // NOTE: visibility handled by Modal -> do not short-circuit here
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ErrorIcon className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Error!
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            type="button"
          >
            Try Again
          </button>
        </div>
      </Modal>
    );
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Testimonials Management
              </h1>
              <p className="text-gray-600 mt-2">Manage and organize customer testimonials</p>
            </div>
            
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-start lg:self-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              type="button"
            >
              <Add className="w-5 h-5" />
              <span className="font-semibold">Add Testimonial</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search testimonials by name, position, or quote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={fetchTestimonials}
                className="p-3 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Refresh"
                type="button"
              >
                <Refresh className="w-5 h-5" />
              </button>
              <button
                className="p-3 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Filters"
                type="button"
              >
                <FilterList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* Header Stats */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Testimonials ({filteredTestimonials.length})
            </h2>
            {searchTerm && (
              <p className="text-sm text-gray-600">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>

          {/* Testimonials List */}
          {loading ? (
            <LoadingSkeleton />
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No testimonials found' : 'No testimonials yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Get started by adding your first testimonial'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  type="button"
                >
                  <Add className="w-5 h-5" />
                  Add First Testimonial
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.image?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 shadow-sm"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {testimonial.name}
                      </h3>
                      <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium truncate">
                        {testimonial.position}
                      </p>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        "{testimonial.quote}"
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openEditModal(testimonial)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                      type="button"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(testimonial)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                      type="button"
                    >
                      <Delete className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TestimonyFormModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        isEdit={false}
      />

      <TestimonyFormModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        isEdit={true}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={modalMessage}
      />
    </div>
  );
};