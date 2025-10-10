/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { imageGridData } from "../../assets/images/images";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-2xl">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Image Modal Component
const ImageModal = ({ image, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors z-10"
            >
              ✕
            </button>
            <div className="bg-white rounded-2xl overflow-hidden">
              <img
                src={image.image}
                alt={image.alt}
                className="w-full h-auto max-h-[70vh] object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {image.category}
                </h3>
                <p className="text-gray-600 text-lg">{image.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Image Component with Loading State
const LazyImage = ({ image, alt, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg cursor-pointer group">
      {isLoading && <LoadingSpinner />}
      {hasError ? (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-2xl">
          <span className="text-gray-500">Failed to load image</span>
        </div>
      ) : (
        <img
          src={image}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
        <div className="p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full">
          <span className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            {alt}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Head() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div className="w-full bg-white mt-2 mb-1 rounded-2xl">
        <div className="w-full">
          <div className="relative overflow-hidden bg-white w-full">
            {/* Header Section */}
            <div className="text-center mb-8 pt-8 px-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-blue-600 font-bold text-2xl sm:text-3xl lg:text-4xl mb-4"
              >
                BUY YOUR DEVICES
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-medium text-gray-600 text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto"
              >
                Don't miss today's best electronics deals with fast shipping &
                great customer service!
              </motion.p>
            </div>

            {/* Main Content */}
            <div className="pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 xl:pt-20 xl:pb-32">
              <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                      LD Tech is{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Finally Here
                      </span>
                    </h1>

                    <div className="space-y-4">
                      <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                        This year, our new summer collection will shelter you
                        the best magnificent Computers To advance technology
                        Here in Rwanda.
                      </p>

                      <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                        Check It out for Your best Wants. We glad to Offer you
                        Qualited Products with unmatched customer service.
                      </p>
                    </div>

                    {/* Features List */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
                    >
                      {[
                        "Free Shipping Nationwide",
                        "2-Year Warranty",
                        "24/7 Customer Support",
                        "30-Day Return Policy",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Image Grid */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      {/* Column 1 */}
                      <div className="grid grid-rows-2 gap-3 sm:gap-4 lg:gap-6">
                        {imageGridData.slice(0, 2).map((image, index) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                          >
                            <LazyImage
                              image={image.image}
                              alt={image.alt}
                              onClick={() => handleImageClick(image)}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Column 2 */}
                      <div className="grid grid-rows-3 gap-3 sm:gap-4 lg:gap-6 mt-8">
                        {imageGridData.slice(2, 5).map((image, index) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                          >
                            <LazyImage
                              image={image.image}
                              alt={image.alt}
                              onClick={() => handleImageClick(image)}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Column 3 */}
                      <div className="grid grid-rows-2 gap-3 sm:gap-4 lg:gap-6 mt-4">
                        {imageGridData.slice(5, 7).map((image, index) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                          >
                            <LazyImage
                              image={image.image}
                              alt={image.alt}
                              onClick={() => handleImageClick(image)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-xl"
                    ></motion.div>
                  </motion.div>
                </div>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mt-12 lg:mt-16"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-12 border border-blue-100">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      Ready to Upgrade Your Tech?
                    </h3>
                    <p className="text-gray-600 text-lg sm:text-xl mb-6 max-w-2xl mx-auto">
                      Join thousands of satisfied customers who trust LD Tech
                      for their computing needs.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Shop Now & Get 10% Off
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
