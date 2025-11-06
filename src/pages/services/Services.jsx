// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { services } from "../../assets/images/images";

// // API Base URL
// const API_BASE_URL = "https://nexusbackend-hdyk.onrender.com";

// export const Services = () => {
//   const [activeService, setActiveService] = useState(null);
//   const [bookingModal, setBookingModal] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [bookingStatus, setBookingStatus] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [hoveredService, setHoveredService] = useState(null);
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);
//   const [testimonials, setTestimonials] = useState([]);
//   const [loadingTestimonials, setLoadingTestimonials] = useState(true);

//   const [bookingForm, setBookingForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     serviceType: "",
//     budget: "",
//     timeline: "",
//     requirements: "",
//   });

//   const [paymentForm, setPaymentForm] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardHolder: "",
//     mobileNumber: "",
//     provider: "mtn",
//   });

//   const stats = [
//     {
//       number: "5000+",
//       label: "Custom PCs Built",
//       icon: "🎯",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       number: "98%",
//       label: "Repair Success Rate",
//       icon: "✅",
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       number: "24/7",
//       label: "Support Available",
//       icon: "🛡️",
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       number: "1Hr",
//       label: "Response Time",
//       icon: "⚡",
//       color: "from-orange-500 to-red-500",
//     },
//   ];

//   // Fetch testimonials from API
//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       try {
//         setLoadingTestimonials(true);
//         const response = await axios.get(`${API_BASE_URL}/testimonials`);

//         if (
//           response.data &&
//           response.data.success &&
//           response.data.testimonials
//         ) {
//           setTestimonials(response.data.testimonials);
//         } else {
//           console.warn("Unexpected API response structure:", response.data);
//           setTestimonials([]);
//         }
//       } catch (error) {
//         console.error("Error fetching testimonials:", error);
//         toast.error("Failed to load testimonials");
//         setTestimonials([]);
//       } finally {
//         setLoadingTestimonials(false);
//       }
//     };

//     fetchTestimonials();
//   }, []);

//   // Auto-rotate testimonials
//   useEffect(() => {
//     if (testimonials.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) =>
//         prev === testimonials.length - 1 ? 0 : prev + 1
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [testimonials.length]);

//   // Handle booking form input changes
//   const handleBookingInputChange = (e) => {
//     const { name, value } = e.target;
//     setBookingForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle payment form input changes
//   const handlePaymentInputChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Format card number with spaces
//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//     const matches = v.match(/\d{4,16}/g);
//     const match = (matches && matches[0]) || "";
//     const parts = [];
//     for (let i = 0; i < match.length; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
//     return parts.length ? parts.join(" ") : value;
//   };

//   // Format expiry date
//   const formatExpiryDate = (value) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//     if (v.length >= 2) {
//       return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
//     }
//     return v;
//   };

//   // Handle booking submission
//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const bookingData = {
//         ...bookingForm,
//         service: bookingModal?.title,
//         serviceId: bookingModal?.id,
//         timestamp: new Date().toISOString(),
//         status: "pending",
//       };

//       // Real API call
//       const response = await axios.post(
//         `${API_BASE_URL}/bookings`,
//         bookingData
//       );

//       if (response.data.success) {
//         setBookingStatus("success");
//         const bookingId = response.data.bookingId || `BK${Date.now()}`;

//         toast.success("Booking request submitted successfully!");

//         // Auto-proceed to payment after 2 seconds
//         setTimeout(() => {
//           setBookingModal({
//             ...bookingModal,
//             step: "payment",
//             bookingId: bookingId,
//           });
//           setBookingStatus(null);
//         }, 2000);
//       } else {
//         setBookingStatus("failed");
//         toast.error("Failed to submit booking. Please try again.");
//       }
//     } catch (error) {
//       setBookingStatus("failed");
//       toast.error("Failed to submit booking. Please try again.");
//       console.error("Booking error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle payment submission
//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const paymentData = {
//         ...paymentForm,
//         service: bookingModal?.title,
//         amount: bookingModal?.price,
//         method: paymentMethod,
//         bookingId: bookingModal?.bookingId || Date.now().toString(),
//         status: "completed",
//       };

//       // Real API call
//       const response = await axios.post(
//         `${API_BASE_URL}/payments`,
//         paymentData
//       );

//       if (response.data.success) {
//         setPaymentStatus("success");
//         toast.success("Payment successful! Your service has been booked.");
//       } else {
//         setPaymentStatus("failed");
//         toast.error("Payment failed. Please try again.");
//       }
//     } catch (error) {
//       setPaymentStatus("failed");
//       toast.error("Payment failed. Please try again.");
//       console.error("Payment error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /**
//    * @description Resets all modal and form states to close any open modal
//    * and clear data, ensuring a clean slate for the next interaction.
//    */
//   const resetModals = () => {
//     setBookingModal(null);
//     setPaymentStatus(null);
//     setBookingStatus(null);
//     setActiveService(null);
//     setBookingForm({
//       name: "",
//       email: "",
//       phone: "",
//       company: "",
//       serviceType: "",
//       budget: "",
//       timeline: "",
//       requirements: "",
//     });
//     setPaymentForm({
//       cardNumber: "",
//       expiryDate: "",
//       cvv: "",
//       cardHolder: "",
//       mobileNumber: "",
//       provider: "mtn",
//     });
//   };

//   // Close specific modal only
//   const closeActiveServiceModal = () => {
//     setActiveService(null);
//   };

//   const closeBookingModal = () => {
//     setBookingModal(null);
//     setBookingStatus(null);
//   };

//   const closePaymentModal = () => {
//     setPaymentStatus(null);
//     if (bookingModal?.step === "payment") {
//       setBookingModal(null);
//     }
//   };

//   // Open booking modal
//   const openBookingModal = (service) => {
//     setBookingModal({
//       ...service,
//       step: "booking",
//     });
//     setBookingForm((prev) => ({
//       ...prev,
//       serviceType: service.title,
//     }));
//   };

//   // Floating animation variants
//   const floatingAnimation = {
//     animate: {
//       y: [0, -10, 0],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: "easeInOut",
//       },
//     },
//   };

//   // Loading Spinner Component
//   const LoadingSpinner = ({ size = "medium" }) => {
//     const sizes = {
//       small: "w-4 h-4",
//       medium: "w-6 h-6",
//       large: "w-8 h-8",
//     };

//     return (
//       <div
//         className={`${sizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}
//       ></div>
//     );
//   };

//   // Updated Testimonial Card Component with dark mode support
// const TestimonialCard = ({ testimonial }) => (
//   <motion.div
//     key={testimonial._id}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -20 }}
//     transition={{ duration: 0.5 }}
//     className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 relative max-w-2xl mx-auto"
//   >
//     <div className="absolute top-0 left-0 text-9xl font-serif text-blue-100 dark:text-blue-800/30 opacity-80">
//       &ldquo;
//     </div>
//     <p className="text-xl italic text-gray-700 dark:text-gray-200 mb-6 relative z-10 leading-relaxed">
//       &quot;{testimonial.quote}&quot;
//     </p>
//     <div className="flex items-center space-x-4">
//       <img
//         src={testimonial.image?.url}
//         alt={testimonial.name || 'Testimonial author'}
//         className="w-16 h-16 rounded-full object-cover border-4 border-blue-500/30 dark:border-blue-400/30 shadow-md"
//       />
//       <div>
//         <p className="font-bold text-gray-800 dark:text-white text-lg">
//           {testimonial.name}
//         </p>
//         <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
//           {testimonial.position}
//         </p>
//       </div>
//     </div>
//   </motion.div>
// );

//   // Booking Status Modal Component
//   const BookingStatusModal = ({ status, onClose, onRetry }) => (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 text-center"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full text-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
//         >
//           ✕
//         </button>
//         {status === "success" ? (
//           <>
//             <div className="text-6xl mb-4">🎉</div>
//             <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
//               Booking Submitted!
//             </h3>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               Your booking request has been received successfully. Proceeding to
//               payment...
//             </p>
//             <div className="flex justify-center">
//               <LoadingSpinner size="medium" />
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="text-6xl mb-4">❌</div>
//             <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
//               Booking Failed
//             </h3>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               There was an issue submitting your booking. Please try again.
//             </p>
//             <div className="flex space-x-3 justify-center">
//               <motion.button
//                 onClick={onRetry}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300"
//               >
//                 Try Again
//               </motion.button>
//               <motion.button
//                 onClick={onClose}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </>
//         )}
//       </motion.div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 mt-2 mb-1 rounded-2xl overflow-hidden">
//       {/* Hero Section */}
//       <section className="relative py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black/40"></div>

//         {/* Animated Graphics */}
//         <div className="absolute inset-0">
//           <motion.div
//             className="absolute top-20 left-20 text-6xl opacity-20"
//             variants={floatingAnimation}
//             animate="animate"
//           >
//             💻
//           </motion.div>
//           <motion.div
//             className="absolute top-40 right-32 text-4xl opacity-30"
//             variants={floatingAnimation}
//             animate="animate"
//             style={{ animationDelay: "1s" }}
//           >
//             🔧
//           </motion.div>
//           <motion.div
//             className="absolute bottom-32 left-1/4 text-5xl opacity-25"
//             variants={floatingAnimation}
//             animate="animate"
//             style={{ animationDelay: "2s" }}
//           >
//             🛠️
//           </motion.div>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//               className="inline-block mb-6"
//             >
//               <div className="text-6xl mb-4">🚀</div>
//             </motion.div>
//             <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
//               Premium Services
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
//               Experience cutting-edge technology solutions with our expert
//               services. From custom builds to enterprise solutions, we deliver
//               excellence.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="relative py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ scale: 1.05, y: -5 }}
//                 className={`text-center p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
//               >
//                 <motion.div
//                   className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   {stat.icon}
//                 </motion.div>
//                 <div className="text-3xl md:text-4xl font-bold mb-2">
//                   {stat.number}
//                 </div>
//                 <div className="font-medium opacity-90">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Grid */}
//       <section className="relative py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center mb-20"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               whileInView={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//               className="inline-block mb-4"
//             >
//               <div className="text-4xl">⭐</div>
//             </motion.div>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
//               Our Expert Services
//             </h2>
//             <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//               Discover our comprehensive range of technology services designed
//               to meet your every need with precision and excellence.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {services.map((service, index) => (
//               <motion.div
//                 key={service.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 onHoverStart={() => setHoveredService(service.id)}
//                 onHoverEnd={() => setHoveredService(null)}
//                 className={`${service.bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 cursor-pointer group relative`}
//                 onClick={() =>
//                   setActiveService(
//                     activeService?.id === service.id ? null : service
//                   )
//                 }
//               >
//                 {/* Service Header */}
//                 <div
//                   className={`bg-gradient-to-r ${service.color} p-6 text-white relative overflow-hidden`}
//                 >
//                   <motion.div
//                     className="absolute -top-4 -right-4 text-8xl opacity-20"
//                     animate={{
//                       rotate: hoveredService === service.id ? 360 : 0,
//                     }}
//                     transition={{ duration: 2 }}
//                   >
//                     {service.graphic}
//                   </motion.div>
//                   <div className="relative z-10">
//                     <motion.div
//                       className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block"
//                       whileHover={{ rotate: [0, -10, 10, 0] }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       {service.icon}
//                     </motion.div>
//                     <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
//                     <p className="text-blue-100">{service.description}</p>
//                   </div>
//                 </div>

//                 {/* Service Content */}
//                 <div className="p-6 relative z-10 bg-white dark:bg-gray-800">
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                       {service.price}
//                     </span>
//                     <span className="text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
//                       {service.duration}
//                     </span>
//                   </div>

//                   <ul className="space-y-2 mb-6">
//                     {service.features.slice(0, 3).map((feature, idx) => (
//                       <motion.h5
//                         key={idx}
//                         initial={{ opacity: 0, x: -20 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.1 }}
//                         className="flex items-center text-gray-900 dark:text-gray-300"
//                       >
//                         <motion.div
//                           className="w-2 h-2 bg-green-400 rounded-full mr-3"
//                           whileHover={{ scale: 1.5 }}
//                         />
//                         {feature}
//                       </motion.h5>
//                     ))}
//                   </ul>

//                   <div className="flex space-x-3">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setActiveService(service);
//                       }}
//                       className="flex-1 bg-gradient-to-tr from-blue-400 to-indigo-400 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-colors duration-300 flex items-center justify-center space-x-2"
//                     >
//                       <span>Learn More</span>
//                       <span>🔍</span>
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         openBookingModal(service);
//                       }}
//                       className="px-4 text-white bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl font-semibold hover:from-blue-700 hover:to-violet-700 transition-colors duration-300 flex items-center justify-center"
//                     >
//                       <span>⚡</span>
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="relative py-24 bg-gray-50 text-black dark:bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
//               What Our Clients Say
//             </h2>
//             <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//               Trusted by industry leaders and satisfied customers worldwide.
//             </p>
//           </div>

//           {loadingTestimonials ? (
//             <div className="flex justify-center items-center h-64">
//               <LoadingSpinner
//                 size="large"
//                 className="text-blue-700 font-bold"
//               />
//             </div>
//           ) : testimonials.length > 0 ? (
//             <>
//               <div className="relative h-64">
//                 <AnimatePresence initial={false} mode="wait">
//                   <div className="absolute w-full">
//                     {testimonials.map((testimonial, index) =>
//                       index === currentTestimonial ? (
//                         <TestimonialCard
//                           key={testimonial._id}
//                           testimonial={testimonial}
//                         />
//                       ) : null
//                     )}
//                   </div>
//                 </AnimatePresence>
//               </div>

//               <div className="flex justify-center mt-12 space-x-3">
//                 {testimonials.map((_, index) => (
//                   <motion.button
//                     key={index}
//                     onClick={() => setCurrentTestimonial(index)}
//                     className={`w-3 h-3 rounded-full transition-colors duration-300 ${
//                       index === currentTestimonial
//                         ? "bg-blue-600 w-8"
//                         : "bg-gray-300 dark:bg-gray-600"
//                     }`}
//                     whileHover={{ scale: 1.2 }}
//                     whileTap={{ scale: 0.9 }}
//                   />
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">😊</div>
//               <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
//                 No Testimonials Yet
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Be the first to share your experience with our services!
//               </p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Booking Status Modal */}
//       <AnimatePresence>
//         {bookingStatus && (
//           <BookingStatusModal
//             status={bookingStatus}
//             onClose={closeBookingModal}
//             onRetry={handleBookingSubmit}
//           />
//         )}
//       </AnimatePresence>

//       {/* Service Detail Modal */}
//       <AnimatePresence>
//         {activeService && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={closeActiveServiceModal}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div
//                 className={`bg-gradient-to-r ${activeService.color} p-8 text-white relative overflow-hidden`}
//               >
//                 <button
//                   onClick={closeActiveServiceModal}
//                   className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-tr from-red-500 to-red-700 text-white rounded-full text-2xl z-10 shadow-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//                 <div className="flex items-center space-x-4 mb-4 relative z-10">
//                   <motion.div
//                     className="text-5xl"
//                     whileHover={{ scale: 1.1, rotate: 360 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     {activeService.icon}
//                   </motion.div>
//                   <div>
//                     <h2 className="text-3xl font-bold">
//                       {activeService.title}
//                     </h2>
//                     <p className="text-blue-100 text-lg">
//                       {activeService.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-8">
//                 <div className="grid lg:grid-cols-2 gap-8">
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
//                       <span className="mr-2">📋</span>
//                       Service Overview
//                     </h3>
//                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
//                       {activeService.fullDescription}
//                     </p>

//                     <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-100 dark:border-gray-600">
//                       <div className="flex justify-between items-center mb-4">
//                         <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                           {activeService.price}
//                         </span>
//                         <span className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 px-4 py-2 rounded-xl font-semibold shadow-sm">
//                           ⏱️ {activeService.duration}
//                         </span>
//                       </div>
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => openBookingModal(activeService)}
//                         className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
//                       >
//                         <span>Book This Service</span>
//                         <span>🎯</span>
//                       </motion.button>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
//                       <span className="mr-2">✨</span>
//                       Key Features
//                     </h3>
//                     <ul className="space-y-3 mb-8">
//                       {activeService.features.map((feature, index) => (
//                         <motion.li
//                           key={index}
//                           initial={{ opacity: 0, x: 20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                           className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl p-3"
//                         >
//                           <motion.div
//                             className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"
//                             whileHover={{ scale: 1.5 }}
//                           />
//                           {feature}
//                         </motion.li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Booking Modal (Step 1: Form) */}
//       <AnimatePresence>
//         {bookingModal && bookingModal.step === "booking" && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={closeBookingModal}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div
//                 className={`bg-gradient-to-r ${bookingModal.color} p-6 text-white relative overflow-hidden`}
//               >
//                 <button
//                   onClick={closeBookingModal}
//                   className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full text-2xl z-10 shadow-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//                 <div className="flex items-center space-x-4 relative z-10">
//                   <div className="text-4xl">{bookingModal.icon}</div>
//                   <div>
//                     <h2 className="text-2xl font-bold">
//                       Book {bookingModal.title}
//                     </h2>
//                     <p className="text-blue-100">
//                       Complete the form below to request this service
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <form
//                 onSubmit={handleBookingSubmit}
//                 className="p-6 text-black dark:text-white"
//               >
//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Full Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={bookingForm.name}
//                       onChange={handleBookingInputChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={bookingForm.email}
//                       onChange={handleBookingInputChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Phone Number *
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={bookingForm.phone}
//                       onChange={handleBookingInputChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       placeholder="Enter your phone number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Company
//                     </label>
//                     <input
//                       type="text"
//                       name="company"
//                       value={bookingForm.company}
//                       onChange={handleBookingInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       placeholder="Your company name"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Service Type
//                     </label>
//                     <input
//                       type="text"
//                       name="serviceType"
//                       value={bookingForm.serviceType}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Budget Range
//                     </label>
//                     <select
//                       name="budget"
//                       value={bookingForm.budget}
//                       onChange={handleBookingInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     >
//                       <option value="">Select budget range</option>
//                       <option value="$100 - $500">$100 - $500</option>
//                       <option value="$500 - $1,000">$500 - $1,000</option>
//                       <option value="$1,000 - $5,000">$1,000 - $5,000</option>
//                       <option value="$5,000+">$5,000+</option>
//                       <option value="Custom Quote">Custom Quote</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Target Timeline
//                     </label>
//                     <select
//                       name="timeline"
//                       value={bookingForm.timeline}
//                       onChange={handleBookingInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     >
//                       <option value="">Select timeline</option>
//                       <option value="1-2 Weeks">1-2 Weeks</option>
//                       <option value="2-4 Weeks">2-4 Weeks</option>
//                       <option value="1-3 Months">1-3 Months</option>
//                       <option value="3+ Months">3+ Months</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Project Requirements / Details *
//                   </label>
//                   <textarea
//                     name="requirements"
//                     value={bookingForm.requirements}
//                     onChange={handleBookingInputChange}
//                     required
//                     rows="4"
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     placeholder="Describe your project, specific needs, or any initial questions..."
//                   ></textarea>
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={isSubmitting}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
//                     isSubmitting
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-lg"
//                   }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <LoadingSpinner size="small" />
//                       <span>Submitting Request...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Submit Request & Proceed to Payment</span>
//                       <span>➡️</span>
//                     </>
//                   )}
//                 </motion.button>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Booking Modal (Step 2: Payment) */}
//       <AnimatePresence>
//         {bookingModal && bookingModal.step === "payment" && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={closePaymentModal}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div
//                 className={`bg-gradient-to-r ${bookingModal.color} p-6 text-white relative overflow-hidden`}
//               >
//                 <button
//                   onClick={closePaymentModal}
//                   className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full text-2xl z-10 shadow-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//                 <div className="flex items-center justify-between relative z-10">
//                   <div className="flex items-center space-x-4">
//                     <div className="text-4xl">💳</div>
//                     <div>
//                       <h2 className="text-2xl font-bold">Secure Payment</h2>
//                       <p className="text-blue-100">
//                         Finalize your booking: {bookingModal.title}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-3xl font-bold text-yellow-300">
//                     {bookingModal.price}
//                   </div>
//                 </div>
//               </div>

//               {paymentStatus === "success" && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-6 text-center bg-green-50 dark:bg-green-900/20 rounded-b-3xl"
//                 >
//                   <div className="text-6xl mb-4">🎉</div>
//                   <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
//                     Payment Confirmed!
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300 mb-4">
//                     Your service has been successfully booked. We've sent a
//                     confirmation email to **{bookingForm.email}**.
//                   </p>
//                   <motion.button
//                     onClick={resetModals}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300"
//                   >
//                     Close & Go to Dashboard
//                   </motion.button>
//                 </motion.div>
//               )}

//               {paymentStatus === "failed" && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-b-3xl"
//                 >
//                   <button
//                     onClick={closePaymentModal}
//                     className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full text-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
//                   >
//                     ✕
//                   </button>
//                   <div className="text-6xl mb-4">❌</div>
//                   <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
//                     Payment Failed
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300 mb-4">
//                     There was an issue processing your payment. Please check
//                     your details or try a different method.
//                   </p>
//                   <div className="flex space-x-3 justify-center">
//                     <motion.button
//                       onClick={() => setPaymentStatus(null)}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-300"
//                     >
//                       Try Again
//                     </motion.button>
//                     <motion.button
//                       onClick={resetModals}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
//                     >
//                       Cancel Booking
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               )}

//               {paymentStatus === null && (
//                 <form
//                   onSubmit={handlePaymentSubmit}
//                   className="p-6 text-black dark:text-white"
//                 >
//                   {/* Payment Method Selector */}
//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
//                       Choose Payment Method
//                     </h3>
//                     <div className="flex space-x-4">
//                       <motion.button
//                         type="button"
//                         onClick={() => setPaymentMethod("card")}
//                         className={`flex-1 p-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
//                           paymentMethod === "card"
//                             ? "bg-blue-500 text-white border-blue-600 shadow-md"
//                             : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
//                         }`}
//                         whileHover={{ y: -2 }}
//                       >
//                         💳 Credit/Debit Card
//                       </motion.button>
//                       <motion.button
//                         type="button"
//                         onClick={() => setPaymentMethod("mobile")}
//                         className={`flex-1 p-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
//                           paymentMethod === "mobile"
//                             ? "bg-purple-500 text-white border-purple-600 shadow-md"
//                             : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
//                         }`}
//                         whileHover={{ y: -2 }}
//                       >
//                         📱 Mobile Money
//                       </motion.button>
//                     </div>
//                   </div>

//                   {/* Card Payment Form */}
//                   <AnimatePresence mode="wait">
//                     {paymentMethod === "card" && (
//                       <motion.div
//                         key="card-form"
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <div className="grid md:grid-cols-2 gap-4 mb-6">
//                           <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Card Number *
//                             </label>
//                             <input
//                               type="text"
//                               name="cardNumber"
//                               value={formatCardNumber(paymentForm.cardNumber)}
//                               onChange={handlePaymentInputChange}
//                               maxLength="19"
//                               required
//                               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                               placeholder="XXXX XXXX XXXX XXXX"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Expiry Date (MM/YY) *
//                             </label>
//                             <input
//                               type="text"
//                               name="expiryDate"
//                               value={formatExpiryDate(paymentForm.expiryDate)}
//                               onChange={handlePaymentInputChange}
//                               maxLength="5"
//                               required
//                               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                               placeholder="MM/YY"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               CVV *
//                             </label>
//                             <input
//                               type="text"
//                               name="cvv"
//                               value={paymentForm.cvv}
//                               onChange={handlePaymentInputChange}
//                               maxLength="4"
//                               required
//                               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                               placeholder="CVV"
//                             />
//                           </div>
//                           <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Card Holder Name *
//                             </label>
//                             <input
//                               type="text"
//                               name="cardHolder"
//                               value={paymentForm.cardHolder}
//                               onChange={handlePaymentInputChange}
//                               required
//                               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                               placeholder="Card Holder Name"
//                             />
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {/* Mobile Money Form */}
//                   <AnimatePresence mode="wait">
//                     {paymentMethod === "mobile" && (
//                       <motion.div
//                         key="mobile-form"
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <div className="grid md:grid-cols-2 gap-4 mb-6">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Mobile Number *
//                             </label>
//                             <input
//                               type="tel"
//                               name="mobileNumber"
//                               value={paymentForm.mobileNumber}
//                               onChange={handlePaymentInputChange}
//                               required
//                               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                               placeholder="e.g., +250 788 XXX XXX"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Provider *
//                             </label>
//                             <select
//                               name="provider"
//                               value={paymentForm.provider}
//                               onChange={handlePaymentInputChange}
//                               required
//                               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                             >
//                               <option value="mtn">MTN Mobile Money</option>
//                               <option value="airtel">Airtel Money</option>
//                               <option value="vodacom">Vodacom MPesa</option>
//                             </select>
//                           </div>
//                         </div>
//                         <p className="text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl mb-4 border border-purple-100 dark:border-purple-800">
//                           Note: You will receive a prompt on your phone to
//                           confirm the payment after submission.
//                         </p>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
//                       isSubmitting
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl"
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <LoadingSpinner size="small" />
//                         <span>Processing Payment...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Pay {bookingModal.price}</span>
//                         <span>💸</span>
//                       </>
//                     )}
//                   </motion.button>
//                 </form>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };


/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { services } from "../../assets/images/images";
import { Close } from "@mui/icons-material";

// API Base URL
const API_BASE_URL = "https://nexusbackend-hdyk.onrender.com";

export const Services = () => {
  const [activeService, setActiveService] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [hoveredService, setHoveredService] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    mobileNumber: "",
    provider: "mtn",
  });

  const stats = [
    {
      number: "5000+",
      label: "Custom PCs Built",
      icon: "🎯",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "98%",
      label: "Repair Success Rate",
      icon: "✅",
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: "🛡️",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "1Hr",
      label: "Response Time",
      icon: "⚡",
      color: "from-orange-500 to-red-500",
    },
  ];

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await axios.get(`${API_BASE_URL}/testimonials`);
        
        if (response.data && response.data.success && response.data.testimonials) {
          setTestimonials(response.data.testimonials);
        } else {
          console.warn("Unexpected API response structure:", response.data);
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        toast.error("Failed to load testimonials");
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle booking form input changes
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment form input changes
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...bookingForm,
        service: bookingModal?.title,
        serviceId: bookingModal?.id,
        timestamp: new Date().toISOString(),
        status: "pending"
      };

      // Real API call
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
      
      if (response.data.success) {
        setBookingStatus("success");
        const bookingId = response.data.bookingId || `BK${Date.now()}`;
        
        toast.success("Booking request submitted successfully!");
        
        // Auto-proceed to payment after 2 seconds
        setTimeout(() => {
          setBookingModal({
            ...bookingModal,
            step: "payment",
            bookingId: bookingId,
          });
          setBookingStatus(null);
        }, 2000);
      } else {
        setBookingStatus("failed");
        toast.error("Failed to submit booking. Please try again.");
      }
    } catch (error) {
      setBookingStatus("failed");
      toast.error("Failed to submit booking. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const paymentData = {
        ...paymentForm,
        service: bookingModal?.title,
        amount: bookingModal?.price,
        method: paymentMethod,
        bookingId: bookingModal?.bookingId || Date.now().toString(),
        status: "completed"
      };

      // Real API call
      const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
      
      if (response.data.success) {
        setPaymentStatus("success");
        toast.success("Payment successful! Your service has been booked.");
      } else {
        setPaymentStatus("failed");
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("failed");
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * @description Resets all modal and form states to close any open modal
   * and clear data, ensuring a clean slate for the next interaction.
   */
  const resetModals = () => {
    setBookingModal(null);
    setPaymentStatus(null);
    setBookingStatus(null);
    setActiveService(null);
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "",
      budget: "",
      timeline: "",
      requirements: "",
    });
    setPaymentForm({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolder: "",
      mobileNumber: "",
      provider: "mtn",
    });
  };

  // Close specific modal only
  const closeActiveServiceModal = () => {
    setActiveService(null);
  };

  const closeBookingModal = () => {
    setBookingModal(null);
    setBookingStatus(null);
  };

  const closePaymentModal = () => {
    setPaymentStatus(null);
    if (bookingModal?.step === "payment") {
      setBookingModal(null);
    }
  };

  // Open booking modal
  const openBookingModal = (service) => {
    setBookingModal({
      ...service,
      step: "booking",
    });
    setBookingForm((prev) => ({
      ...prev,
      serviceType: service.title,
    }));
  };

  // Floating animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Loading Spinner Component
  const LoadingSpinner = ({ size = "medium" }) => {
    const sizes = {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    };

    return (
      <div
        className={`${sizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}
      ></div>
    );
  };

  // Updated Testimonial Card Component with dark mode support
  const TestimonialCard = ({ testimonial }) => (
    <motion.div
      key={testimonial._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative max-w-2xl mx-auto"
    >
      <div className="absolute top-0 left-0 text-9xl font-serif text-blue-100 dark:text-blue-900 opacity-5">
        &ldquo;
      </div>
      <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-6 relative z-10">
        &quot;{testimonial.quote}&quot;
      </p>
      <div className="flex items-center space-x-4">
        <img
          src={testimonial.image?.url || "/default-avatar.png"}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-blue-500/50 dark:border-blue-400/50"
        />
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-lg">
            {testimonial.name}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {testimonial.position}
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Booking Status Modal Component
  const BookingStatusModal = ({ status, onClose, onRetry }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-b from-red-500 to-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 font-bold"
        >
          {/* × */}
          <Close className='text-red-500' />
        </button>
        {status === "success" ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
              Booking Submitted!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your booking request has been received successfully. Proceeding to payment...
            </p>
            <div className="flex justify-center">
              <LoadingSpinner size="medium" className='text-blue-500'/>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Booking Failed
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              There was an issue submitting your booking. Please try again.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={onRetry}
                className="bg-gradient-to-r from-blue-300 to-indigo-400 py-3 px-6 rounded-xl font-semibold transition-colors duration-300"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="bg-gradient-to-l dark:from-red-600 dark:to-red-800 from-red-500 to-red-700 py-3 px-6 rounded-xl font-semibold transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 mt-2 mb-1 rounded-2xl overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Animated Graphics */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 text-6xl opacity-20"
            variants={floatingAnimation}
            animate="animate"
          >
            💻
          </motion.div>
          <motion.div
            className="absolute top-40 right-32 text-4xl opacity-30"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: "1s" }}
          >
            🔧
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-1/4 text-5xl opacity-25"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: "2s" }}
          >
            🛠️
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="text-6xl mb-4">🚀</div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Premium Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience cutting-edge technology solutions with our expert
              services. From custom builds to enterprise solutions, we deliver
              excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`text-center p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              >
                <motion.div
                  className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="font-medium opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="text-4xl">⭐</div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-500 dark:text-white mb-4">
              Our Expert Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our comprehensive range of technology services designed
              to meet your every need with precision and excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
                className={`${service.bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 cursor-pointer group relative`}
                onClick={() =>
                  setActiveService(
                    activeService?.id === service.id ? null : service
                  )
                }
              >
                {/* Service Header */}
                <div
                  className={`bg-gradient-to-r ${service.color} p-6 text-white relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute -top-4 -right-4 text-8xl opacity-20"
                    animate={{
                      rotate: hoveredService === service.id ? 360 : 0,
                    }}
                    transition={{ duration: 2 }}
                  >
                    {service.graphic}
                  </motion.div>
                  <div className="relative z-10">
                    <motion.div
                      className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-blue-100">{service.description}</p>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 relative z-10 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {service.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {service.duration}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full mr-3"
                          whileHover={{ scale: 1.5 }}
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveService(service);
                      }}
                      className="flex-1 bg-gradient-to-tr from-blue-400 to-indigo-400 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Learn More</span>
                      <span>🔍</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookingModal(service);
                      }}
                      className="px-4 text-white bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl font-semibold hover:from-blue-700 hover:to-violet-700 transition-colors duration-300 flex items-center justify-center"
                    >
                      <span>⚡</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trusted by industry leaders and satisfied customers worldwide.
            </p>
          </div>

          {loadingTestimonials ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading testimonials...</span>
            </div>
          ) : testimonials.length > 0 ? (
            <>
              <div className="relative h-64">
                <AnimatePresence initial={false} mode="wait">
                  <div className="absolute w-full">
                    {testimonials.map((testimonial, index) =>
                      index === currentTestimonial ? (
                        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                      ) : null
                    )}
                  </div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center mt-12 space-x-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentTestimonial
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😊</div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                No Testimonials Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to share your experience with our services!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Status Modal */}
      <AnimatePresence>
        {bookingStatus && (
          <BookingStatusModal
            status={bookingStatus}
            onClose={closeBookingModal}
            onRetry={handleBookingSubmit}
          />
        )}
      </AnimatePresence>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeActiveServiceModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeActiveServiceModal}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-50 transition-all duration-300 font-bold text-lg"
              >
                ×
              </button>
              <div
                className={`bg-gradient-to-r ${activeService.color} p-8 text-white relative overflow-hidden`}
              >
                <motion.div
                  className="absolute -top-8 -right-8 text-9xl opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {activeService.graphic}
                </motion.div>
                <div className="flex items-center space-x-4 mb-4 relative z-10">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {activeService.icon}
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold">
                      {activeService.title}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      {activeService.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="mr-2">📋</span>
                      Service Overview
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {activeService.fullDescription}
                    </p>

                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-100 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {activeService.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 px-4 py-2 rounded-xl font-semibold shadow-sm">
                          ⏱️ {activeService.duration}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openBookingModal(activeService)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>Book This Service</span>
                        <span>🎯</span>
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="mr-2">✨</span>
                      Key Features
                    </h3>
                    <ul className="space-y-3 mb-8">
                      {activeService.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl p-3"
                        >
                          <motion.div
                            className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"
                            whileHover={{ scale: 1.5 }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal (Step 1: Form) */}
      <AnimatePresence>
        {bookingModal && bookingModal.step === "booking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeBookingModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeBookingModal}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-50 transition-all duration-300 font-bold text-lg"
              >
                ×
              </button>
              <div
                className={`bg-gradient-to-r ${bookingModal.color} p-6 text-white relative overflow-hidden`}
              >
                <motion.div
                  className="absolute -top-4 -right-4 text-6xl opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {bookingModal.graphic}
                </motion.div>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="text-4xl">{bookingModal.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Book {bookingModal.title}
                    </h2>
                    <p className="text-blue-100">
                      Complete the form below to request this service
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-6 text-black dark:text-white">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={bookingForm.company}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Type
                    </label>
                    <input
                      type="text"
                      name="serviceType"
                      value={bookingForm.serviceType}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={bookingForm.budget}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select budget range</option>
                      <option value="$100 - $500">$100 - $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000+">$5,000+</option>
                      <option value="Custom Quote">Custom Quote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Timeline
                    </label>
                    <select
                      name="timeline"
                      value={bookingForm.timeline}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select timeline</option>
                      <option value="1-2 Weeks">1-2 Weeks</option>
                      <option value="2-4 Weeks">2-4 Weeks</option>
                      <option value="1-3 Months">1-3 Months</option>
                      <option value="3+ Months">3+ Months</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Requirements / Details *
                  </label>
                  <textarea
                    name="requirements"
                    value={bookingForm.requirements}
                    onChange={handleBookingInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe your project, specific needs, or any initial questions..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request & Proceed to Payment</span>
                      <span>➡️</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal (Step 2: Payment) */}
      <AnimatePresence>
        {bookingModal && bookingModal.step === "payment" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePaymentModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePaymentModal}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-50 transition-all duration-300 font-bold text-lg"
              >
                ×
              </button>
              <div
                className={`bg-gradient-to-r ${bookingModal.color} p-6 text-white relative overflow-hidden`}
              >
                <motion.div
                  className="absolute -top-4 -right-4 text-6xl opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {bookingModal.graphic}
                </motion.div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">💳</div>
                    <div>
                      <h2 className="text-2xl font-bold">Secure Payment</h2>
                      <p className="text-blue-100">
                        Finalize your booking: {bookingModal.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-yellow-300">
                    {bookingModal.price}
                  </div>
                </div>
              </div>

              {paymentStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 text-center bg-green-50 dark:bg-green-900/20 rounded-b-3xl"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                    Payment Confirmed!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your service has been successfully booked. We've sent a
                    confirmation email to **{bookingForm.email}**.
                  </p>
                  <button
                    onClick={resetModals}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-300"
                  >
                    Close & Go to Dashboard
                  </button>
                </motion.div>
              )}

              {paymentStatus === "failed" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-b-3xl relative"
                >
                  <button
                    onClick={closePaymentModal}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 font-bold"
                  >
                    ×
                  </button>
                  <div className="text-6xl mb-4">❌</div>
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    There was an issue processing your payment. Please check your
                    details or try a different method.
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => setPaymentStatus(null)}
                      className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-300"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={resetModals}
                      className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold transition-colors duration-300"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </motion.div>
              )}

              {paymentStatus === null && (
                <form onSubmit={handlePaymentSubmit} className="p-6 text-black dark:text-white">
                  {/* Payment Method Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                      Choose Payment Method
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex-1 p-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
                          paymentMethod === "card"
                            ? "bg-blue-500 text-white border-blue-600 shadow-md"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        💳 Credit/Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("mobile")}
                        className={`flex-1 p-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
                          paymentMethod === "mobile"
                            ? "bg-purple-500 text-white border-purple-600 shadow-md"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        📱 Mobile Money
                      </button>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === "card" && (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formatCardNumber(paymentForm.cardNumber)}
                              onChange={handlePaymentInputChange}
                              maxLength="19"
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="XXXX XXXX XXXX XXXX"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date (MM/YY) *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formatExpiryDate(paymentForm.expiryDate)}
                              onChange={handlePaymentInputChange}
                              maxLength="5"
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={paymentForm.cvv}
                              onChange={handlePaymentInputChange}
                              maxLength="4"
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="CVV"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Card Holder Name *
                            </label>
                            <input
                              type="text"
                              name="cardHolder"
                              value={paymentForm.cardHolder}
                              onChange={handlePaymentInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Card Holder Name"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mobile Money Form */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === "mobile" && (
                      <motion.div
                        key="mobile-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Mobile Number *
                            </label>
                            <input
                              type="tel"
                              name="mobileNumber"
                              value={paymentForm.mobileNumber}
                              onChange={handlePaymentInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="e.g., +250 788 XXX XXX"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Provider *
                            </label>
                            <select
                              name="provider"
                              value={paymentForm.provider}
                              onChange={handlePaymentInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="mtn">MTN Mobile Money</option>
                              <option value="airtel">Airtel Money</option>
                              <option value="vodacom">Vodacom MPesa</option>
                            </select>
                          </div>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl mb-4 border border-purple-100 dark:border-purple-800">
                          Note: You will receive a prompt on your phone to confirm
                          the payment after submission.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {bookingModal.price}</span>
                        <span>💸</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};