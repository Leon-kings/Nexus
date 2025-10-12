/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/components/CheckoutManagement.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  Person,
  CreditCard,
  Security,
  CheckCircle,
  Clear,
  Add,
  Remove,
  Discount,
  Receipt,
  Lock,
  Schedule,
  Google,
  PhoneIphone,
} from "@mui/icons-material";

export const CheckoutManagement = () => {
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Shipping information
  const [shippingInfo, setShippingInfo] = useState({
    method: "standard",
    sameAsBilling: true,
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
  });

  // Payment information
  const [paymentInfo, setPaymentInfo] = useState({
    method: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false,
  });

  // Available products
  const electronicProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      image: "https://picsum.photos/200/200?random=1",
      category: "Smartphones",
      inStock: true,
      description: "Latest iPhone with advanced camera system",
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      price: 2399,
      image: "https://picsum.photos/200/200?random=2",
      category: "Laptops",
      inStock: true,
      description: "Powerful laptop for professionals",
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      price: 849,
      image: "https://picsum.photos/200/200?random=3",
      category: "Smartphones",
      inStock: true,
      description: "Advanced Android smartphone",
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      price: 399,
      image: "https://picsum.photos/200/200?random=4",
      category: "Audio",
      inStock: true,
      description: "Noise-canceling wireless headphones",
    },
  ];

  // Shipping methods
  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      cost: 9.99,
      days: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      cost: 19.99,
      days: "2-3 business days",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      cost: 39.99,
      days: "1 business day",
    },
    { id: "free", name: "Free Shipping", cost: 0, days: "7-10 business days" },
  ];

  // Payment methods
  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: <CreditCard /> },
    { id: "paypal", name: "PayPal", icon: <Google /> },
    { id: "apple-pay", name: "Apple Pay", icon: <PhoneIphone /> },
  ];

  useEffect(() => {
    // Load initial cart with some demo items
    setCart([
      { ...electronicProducts[0], quantity: 1 },
      { ...electronicProducts[2], quantity: 1 },
    ]);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    toast.success("Item removed from cart");
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success("Item added to cart");
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getShippingCost = () => {
    const method = shippingMethods.find((m) => m.id === shippingInfo.method);
    return method ? method.cost : 0;
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost() + getTax();
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order = {
        id: Date.now(),
        orderNumber: `ORD-${1000 + Date.now()}`,
        customer: customerInfo,
        shipping: shippingInfo,
        payment: paymentInfo,
        items: cart,
        subtotal: getSubtotal(),
        shippingCost: getShippingCost(),
        tax: getTax(),
        total: getTotal(),
        status: "confirmed",
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      setOrderDetails(order);
      setOrderComplete(true);
      setCheckoutStep(4);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ProgressSteps = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              checkoutStep >= step
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-300 text-gray-300"
            } font-semibold`}
          >
            {checkoutStep > step ? <CheckCircle /> : step}
          </div>
          {step < 4 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                checkoutStep > step ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const StepLabels = () => (
    <div className="flex justify-between mb-2 -mt-6">
      <span
        className={`text-sm ${
          checkoutStep >= 1 ? "text-blue-600 font-semibold" : "text-gray-500"
        }`}
      >
        Cart
      </span>
      <span
        className={`text-sm ${
          checkoutStep >= 2 ? "text-blue-600 font-semibold" : "text-gray-500"
        }`}
      >
        Information
      </span>
      <span
        className={`text-sm ${
          checkoutStep >= 3 ? "text-blue-600 font-semibold" : "text-gray-500"
        }`}
      >
        Payment
      </span>
      <span
        className={`text-sm ${
          checkoutStep >= 4 ? "text-blue-600 font-semibold" : "text-gray-500"
        }`}
      >
        Complete
      </span>
    </div>
  );

  const CartStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingCart />
            Shopping Cart ({cart.length} items)
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some electronic devices to get started
              </p>
              <button
                onClick={() => setCheckoutStep(1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Remove className="text-sm" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Add className="text-sm" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Clear className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Suggestions */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              You might also like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {electronicProducts
                .filter((p) => !cart.some((item) => item.id === p.id))
                .slice(0, 2)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {product.name}
                      </h4>
                      <p className="text-blue-600 font-semibold">
                        ${product.price}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal ({cart.length} items)
              </span>
              <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">
                ${getShippingCost().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${getTax().toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {cart.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckoutStep(2)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300 font-semibold text-lg"
            >
              Proceed to Checkout
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  const InformationStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Customer Information Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Person />
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={customerInfo.firstName}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    firstName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={customerInfo.lastName}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter phone number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={customerInfo.city}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, city: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={customerInfo.state}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, state: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={customerInfo.zipCode}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, zipCode: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter ZIP code"
              />
            </div>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <LocalShipping />
            Shipping Method
          </h2>

          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <label
                key={method.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="shipping"
                  value={method.id}
                  checked={shippingInfo.method === method.id}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, method: e.target.value })
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {method.name}
                    </span>
                    <span className="font-bold text-blue-600">
                      {method.cost === 0 ? "FREE" : `$${method.cost}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.days}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h3>

          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-600 text-sm block">
                    Qty: {item.quantity}
                  </span>
                </div>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  ${getShippingCost().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${getTax().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setCheckoutStep(1)}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300 font-semibold"
            >
              Back to Cart
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckoutStep(3)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300 font-semibold text-lg"
            >
              Continue to Payment
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Information */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Payment />
            Payment Information
          </h2>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentInfo.method === method.id}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, method: e.target.value })
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="mt-2 text-gray-600">
                    {React.cloneElement(method.icon, { className: "text-2xl" })}
                  </div>
                  <span className="mt-2 font-medium text-gray-800">
                    {method.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Credit Card Form */}
          {paymentInfo.method === "credit-card" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentInfo.cardNumber}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.expiryDate}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cvv}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={paymentInfo.nameOnCard}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      nameOnCard: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter name as shown on card"
                />
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={paymentInfo.saveCard}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      saveCard: e.target.checked,
                    })
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Save card for future purchases
                </span>
              </label>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <Security className="text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Your payment information is secure and encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary & Actions */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h3>

          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-600 text-sm block">
                    Qty: {item.quantity}
                  </span>
                </div>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  ${getShippingCost().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${getTax().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setCheckoutStep(2)}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300 font-semibold"
            >
              Back to Information
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-300 font-semibold text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Schedule className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2" />
                  Complete Order
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const CompleteStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 text-4xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase, {customerInfo.firstName}!
        </p>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed and is being processed.
        </p>

        {orderDetails && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">
                  {orderDetails.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-blue-600">
                  ${orderDetails.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">
                  {new Date(
                    orderDetails.estimatedDelivery
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              setCheckoutStep(1);
              setOrderComplete(false);
              setCart([]);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-300 font-semibold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Print Receipt
          </button>
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
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <div className="p-2 bg-white rounded-2xl shadow-lg">
              <ShoppingCart className="text-blue-600 text-2xl md:text-3xl" />
            </div>
            Checkout Process
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your purchase securely and conveniently
          </p>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-8">
        <ProgressSteps />
        <StepLabels />
      </div>

      {/* Checkout Steps */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={checkoutStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {checkoutStep === 1 && <CartStep />}
            {checkoutStep === 2 && <InformationStep />}
            {checkoutStep === 3 && <PaymentStep />}
            {checkoutStep === 4 && <CompleteStep />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
